import React, { useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
];

function LessonsModal({ show, onClose, course, lessons: initialLessons, onSaveLessons, onEditLesson, onViewLesson }) {
  const [lessons, setLessons] = useState(initialLessons || []);
  const [expandedLessons, setExpandedLessons] = useState([]); // Track expanded/collapsed state
  const [uploadingVideoIdx, setUploadingVideoIdx] = useState(null); // Track which lesson is uploading
  const [saving, setSaving] = useState(false); // Track if saving lessons

  // Add a new lesson
  const handleAddLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        title: { en: '', 'zh-CN': '', 'zh-TW': '' },
        content: { en: '', 'zh-CN': '', 'zh-TW': '' },
        video: '',
        duration: '',
        isFree: false,
        activeLang: 'en',
      },
    ]);
  };

  // Remove a lesson
  const handleRemoveLesson = (idx) => {
    setLessons((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update lesson field
  const handleLessonChange = (idx, field, value, lang) => {
    setLessons((prev) =>
      prev.map((lesson, i) => {
        if (i !== idx) return lesson;
        if (field === 'title' || field === 'content') {
          return {
            ...lesson,
            [field]: { ...lesson[field], [lang]: value },
          };
        }
        return { ...lesson, [field]: value };
      })
    );
  };

  // Switch language tab
  const handleLangTab = (idx, lang) => {
    setLessons((prev) =>
      prev.map((lesson, i) => (i === idx ? { ...lesson, activeLang: lang } : lesson))
    );
  };

  // Handle file upload
  const handleVideoUpload = async (idx, file) => {
    if (!course || !course.course_id) {
      alert('Course ID is required to upload video.');
      return;
    }
    setUploadingVideoIdx(idx);
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      const formData = new FormData();
      formData.append('preview_video', file);
      const response = await fetch(`https://jacobpersonal.onrender.com/admin/api/courses/${course.course_id}/upload-assets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Failed to upload video');
      }
      const result = await response.json();
      const videoKey = result.data?.preview_video_key;
      if (videoKey) {
        setLessons((prev) =>
          prev.map((lesson, i) => (i === idx ? { ...lesson, videoKey } : lesson))
        );
      }
    } catch (error) {
      alert(error.message || 'Video upload failed');
    } finally {
      setUploadingVideoIdx(null);
    }
  };

  // Toggle expand/collapse for a lesson
  const handleToggleExpand = (idx) => {
    setExpandedLessons((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Save lessons to API
  const handleSaveLessons = async () => {
    if (!course || !course.course_id) {
      alert('Course ID is required to save lessons.');
      return;
    }
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Not authenticated');
      return;
    }
    setSaving(true);
    try {
      for (const lesson of lessons) {
        const video_url = lesson.videoKey
          ? `courses/${course.course_id}/lessons/${lesson.videoKey}`
          : '';
        const lessonData = {
          title: lesson.title,
          content: lesson.content,
          video_duration: lesson.duration,
          video_url,
          is_free: lesson.isFree,
        };
        const response = await fetch(`https://jacobpersonal.onrender.com/admin/api/courses/${course.course_id}/lessons`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lesson_data: lessonData }),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.message || 'Failed to save lesson');
        }
      }
      alert('Lessons saved successfully!');
      onClose();
    } catch (error) {
      alert(error.message || 'Failed to save lessons');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.25)', pointerEvents: (saving || uploadingVideoIdx !== null) ? 'none' : 'auto' }} tabIndex="-1" aria-labelledby="lessonModalLabel" aria-modal="true" role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content shadow-lg">
          <div className="modal-header sticky-top bg-white" style={{ zIndex: 2 }}>
            <h5 className="modal-title d-flex align-items-center gap-2" id="lessonModalLabel">
              <i className="fas fa-chalkboard-teacher me-2 text-primary"></i> Manage Lessons
            </h5>
            <button type="button" className="btn-close" onClick={saving || uploadingVideoIdx !== null ? undefined : onClose} aria-label="Close" disabled={saving || uploadingVideoIdx !== null}></button>
          </div>

          <div className="modal-body" style={{ background: '#f8f9fa' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h5 id="modal-subheading" className="mb-1">Course Lessons</h5>
                <p className="text-muted mb-0">Manage your course lessons and video content</p>
              </div>
              <button className="btn btn-primary d-flex align-items-center gap-2" id="add-lesson-btn" onClick={handleAddLesson} title="Add a new lesson">
                <i className="fas fa-plus"></i> Add Lesson
              </button>
            </div>

            <div id="lessons-container">
              {lessons && lessons.length > 0 ? (
                <div className="d-flex flex-column gap-4">
                  {lessons.map((lesson, idx) => (
                    <div
                      className={`lesson-item p-3 border rounded position-relative ${expandedLessons.includes(idx) ? 'bg-white shadow-sm border-primary' : 'bg-light'}`}
                      key={idx}
                      style={{ transition: 'box-shadow 0.2s, background 0.2s' }}
                    >
                      <div className="lesson-header d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-primary me-2" style={{ fontSize: '1rem' }}>#{idx + 1}</span>
                          <h6 className="lesson-title mb-0">{lesson.title.en || `Lesson ${idx + 1}`}</h6>
                        </div>
                        <div className="lesson-actions d-flex gap-2">
                          <button
                            className={`btn btn-info btn-sm d-flex align-items-center gap-1 ${expandedLessons.includes(idx) ? 'active' : ''}`}
                            onClick={() => handleToggleExpand(idx)}
                            title={expandedLessons.includes(idx) ? 'Collapse' : 'Expand'}
                          >
                            {expandedLessons.includes(idx) ? (
                              <><i className="fas fa-chevron-up"></i> Collapse</>
                            ) : (
                              <><i className="fas fa-chevron-down"></i> Expand</>
                            )}
                          </button>
                          <button
                            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleRemoveLesson(idx)}
                            title="Remove lesson"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      {expandedLessons.includes(idx) && (
                        <div className="lesson-content mt-3 border-top pt-3">
                          {/* Title with language tabs */}
                          <div className="form-group mb-3">
                            <label className="form-label fw-semibold">Lesson Title</label>
                            <div className="language-tabs">
                              {LANGUAGES.map((lang) => (
                                <button
                                  key={lang.code}
                                  className={`lang-tab${lesson.activeLang === lang.code ? ' active' : ''}`}
                                  type="button"
                                  onClick={() => handleLangTab(idx, lang.code)}
                                >
                                  {lang.label}
                                </button>
                              ))}
                            </div>
                            {LANGUAGES.map((lang) => (
                              <input
                                key={lang.code}
                                type="text"
                                className="form-control mb-2"
                                style={{ display: lesson.activeLang === lang.code ? 'block' : 'none' }}
                                value={lesson.title[lang.code] || ''}
                                onChange={e => handleLessonChange(idx, 'title', e.target.value, lang.code)}
                                placeholder={`Title (${lang.label})`}
                              />
                            ))}
                          </div>
                          {/* Content with language tabs */}
                          <div className="form-group mb-3">
                            <label className="form-label fw-semibold">Lesson Content</label>
                            <div className="language-tabs">
                              {LANGUAGES.map((lang) => (
                                <button
                                  key={lang.code}
                                  className={`lang-tab${lesson.activeLang === lang.code ? ' active' : ''}`}
                                  type="button"
                                  onClick={() => handleLangTab(idx, lang.code)}
                                >
                                  {lang.label}
                                </button>
                              ))}
                            </div>
                            {LANGUAGES.map((lang) => (
                              <textarea
                                key={lang.code}
                                className="form-control mb-2"
                                style={{ display: lesson.activeLang === lang.code ? 'block' : 'none' }}
                                value={lesson.content[lang.code] || ''}
                                onChange={e => handleLessonChange(idx, 'content', e.target.value, lang.code)}
                                placeholder={`Content (${lang.label})`}
                              />
                            ))}
                          </div>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <div className="form-group">
                                <label className="form-label fw-semibold">Course Thumbnail Video</label>
                                <div
                                  className="file-upload-area"
                                  onClick={() => (saving || uploadingVideoIdx !== null) ? null : document.getElementById(`lesson-video-${idx}`).click()}
                                  style={{ cursor: (saving || uploadingVideoIdx !== null) ? 'not-allowed' : 'pointer', border: '1px dashed #ccc', padding: '1rem', textAlign: 'center', background: '#fff' }}
                                >
                                  <div className="file-upload-icon">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                  </div>
                                  <p className="mb-1">Click to upload Video</p>
                                  {uploadingVideoIdx === idx ? (
                                    <div className="text-muted small">Uploading...</div>
                                  ) : lesson.videoKey && (
                                    <>
                                      <div className="text-success small">Video uploaded</div>
                                      <span className="badge bg-primary">1</span>
                                    </>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  id={`lesson-video-${idx}`}
                                  accept="video/*"
                                  style={{ display: 'none' }}
                                  onChange={e => handleVideoUpload(idx, e.target.files[0])}
                                  disabled={saving || uploadingVideoIdx !== null}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold">Duration</label>
                              <input
                                type="text"
                                className="form-control"
                                value={lesson.duration}
                                onChange={e => handleLessonChange(idx, 'duration', e.target.value)}
                                placeholder="e.g. 10:00"
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold">Settings</label>
                              <div className="form-check mt-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`free-lesson-${idx}`}
                                  checked={lesson.isFree}
                                  onChange={e => handleLessonChange(idx, 'isFree', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`free-lesson-${idx}`}>
                                  <i className="fas fa-unlock me-1"></i> Free Lesson
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted text-center py-5">
                  <i className="fas fa-info-circle fa-2x mb-2"></i>
                  <div>No lessons found for this course. Click <b>Add Lesson</b> to get started.</div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer sticky-bottom bg-white" style={{ zIndex: 2 }}>
            <button className="btn btn-secondary" onClick={saving || uploadingVideoIdx !== null ? undefined : onClose} disabled={saving || uploadingVideoIdx !== null}>Close</button>
            <button className="btn btn-success" id="save-lessons-btn" onClick={handleSaveLessons} disabled={saving || uploadingVideoIdx !== null}>
              {saving ? <span className="loading-spinner spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-save me-2"></i>}
              Save Lessons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonsModal; 