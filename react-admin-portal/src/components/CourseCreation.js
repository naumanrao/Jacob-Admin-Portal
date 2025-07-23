import React, { useState, useRef, useEffect } from 'react';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
];

const API_CONFIG = {
  PUBLISH_URL: 'https://jacobpersonal.onrender.com/admin/api/courses',
  UPLOAD_URL: (courseId) => `https://jacobpersonal.onrender.com/admin/api/courses/${courseId}/upload-assets`,
};

function CourseCreation({ editingCourse }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Language tab state for each section
  const [titleLang, setTitleLang] = useState('en');
  const [subtitleLang, setSubtitleLang] = useState('en');
  const [descLang, setDescLang] = useState('en');
  const [objectivesLang, setObjectivesLang] = useState('en');
  const [tagsLang, setTagsLang] = useState('en');

  // Dynamic objectives and tags per language
  const [objectives, setObjectives] = useState({ en: [], 'zh-CN': [], 'zh-TW': [] });
  const [objectiveInput, setObjectiveInput] = useState({ en: '', 'zh-CN': '', 'zh-TW': '' });
  const [tags, setTags] = useState({ en: [], 'zh-CN': [], 'zh-TW': [] });
  const [tagInput, setTagInput] = useState({ en: '', 'zh-CN': '', 'zh-TW': '' });

  // Form state for all fields
  const [titles, setTitles] = useState({ en: '', 'zh-CN': '', 'zh-TW': '' });
  const [subtitles, setSubtitles] = useState({ en: '', 'zh-CN': '', 'zh-TW': '' });
  const [descriptions, setDescriptions] = useState({ en: '', 'zh-CN': '', 'zh-TW': '' });
  const [dropdowns, setDropdowns] = useState({ en: '', 'zh-CN': '', 'zh-TW': '' });
  const [price, setPrice] = useState('');

  // File upload state
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailKey, setThumbnailKey] = useState('');
  const [videoKey, setVideoKey] = useState('');
  const [uploadingAsset, setUploadingAsset] = useState('');
  const [uploadError, setUploadError] = useState('');
  const thumbnailInputRef = useRef();
  const videoInputRef = useRef();

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewComment, setReviewComment] = useState('');

  // Add API state
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishAlert, setPublishAlert] = useState({ message: '', type: '' });

  // Load editingCourse data into form
  useEffect(() => {
    if (editingCourse) {
      setTitles({
        en: typeof editingCourse.title === 'object' ? (editingCourse.title.en || '') : (editingCourse.title || ''),
        'zh-CN': typeof editingCourse.title === 'object' ? (editingCourse.title['zh-CN'] || '') : '',
        'zh-TW': typeof editingCourse.title === 'object' ? (editingCourse.title['zh-TW'] || '') : '',
      });
      setSubtitles({
        en: typeof editingCourse.subtitle === 'object' ? (editingCourse.subtitle.en || '') : (editingCourse.subtitle || ''),
        'zh-CN': typeof editingCourse.subtitle === 'object' ? (editingCourse.subtitle['zh-CN'] || '') : '',
        'zh-TW': typeof editingCourse.subtitle === 'object' ? (editingCourse.subtitle['zh-TW'] || '') : '',
      });
      setDescriptions({
        en: typeof editingCourse.description === 'object' ? (editingCourse.description.en || '') : (editingCourse.description || ''),
        'zh-CN': typeof editingCourse.description === 'object' ? (editingCourse.description['zh-CN'] || '') : '',
        'zh-TW': typeof editingCourse.description === 'object' ? (editingCourse.description['zh-TW'] || '') : '',
      });
      setDropdowns({
        en: typeof editingCourse.dropdowns === 'object' ? (editingCourse.dropdowns.en || '') : (editingCourse.dropdowns || ''),
        'zh-CN': typeof editingCourse.dropdowns === 'object' ? (editingCourse.dropdowns['zh-CN'] || '') : '',
        'zh-TW': typeof editingCourse.dropdowns === 'object' ? (editingCourse.dropdowns['zh-TW'] || '') : '',
      });
      setPrice(editingCourse.price ? String(editingCourse.price) : '');
      setObjectives(editingCourse.objectives || { en: [], 'zh-CN': [], 'zh-TW': [] });
      setTags(editingCourse.tags || { en: [], 'zh-CN': [], 'zh-TW': [] });
      setThumbnailKey(editingCourse.thumbnail || '');
      setVideoKey(editingCourse.preview_video || '');
      setReviews(editingCourse.reviews || []);
      // Optionally, set preview images if you have URLs
      setThumbnailPreview(null); // You can set a URL if available
      setVideoPreview(null); // You can set a URL if available
      setCurrentStep(1);
    } else {
      // Reset form for new course
      setTitles({ en: '', 'zh-CN': '', 'zh-TW': '' });
      setSubtitles({ en: '', 'zh-CN': '', 'zh-TW': '' });
      setDescriptions({ en: '', 'zh-CN': '', 'zh-TW': '' });
      setDropdowns({ en: '', 'zh-CN': '', 'zh-TW': '' });
      setPrice('');
      setObjectives({ en: [], 'zh-CN': [], 'zh-TW': [] });
      setTags({ en: [], 'zh-CN': [], 'zh-TW': [] });
      setThumbnailKey('');
      setVideoKey('');
      setReviews([]);
      setThumbnailPreview(null);
      setVideoPreview(null);
      setCurrentStep(1);
    }
  }, [editingCourse]);

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Add/Remove Objectives
  const addObjective = (lang) => {
    const value = objectiveInput[lang].trim();
    if (value && !objectives[lang].includes(value)) {
      setObjectives((prev) => ({ ...prev, [lang]: [...prev[lang], value] }));
      setObjectiveInput((prev) => ({ ...prev, [lang]: '' }));
    }
  };
  const removeObjective = (lang, idx) => {
    setObjectives((prev) => ({ ...prev, [lang]: prev[lang].filter((_, i) => i !== idx) }));
  };

  // Add/Remove Tags
  const addTag = (lang) => {
    const value = tagInput[lang].trim();
    if (value && !tags[lang].includes(value)) {
      setTags((prev) => ({ ...prev, [lang]: [...prev[lang], value] }));
      setTagInput((prev) => ({ ...prev, [lang]: '' }));
    }
  };
  const removeTag = (lang, idx) => {
    setTags((prev) => ({ ...prev, [lang]: prev[lang].filter((_, i) => i !== idx) }));
  };

  // Asset upload handler
  const handleAssetUpload = async (file, type) => {
    setUploadingAsset(type);
    setUploadError('');
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      // For new course, use 'new' as courseId (backend should handle this or return a temp ID)
      const courseId = 'new';
      const formData = new FormData();
      formData.append(type, file);
      const response = await fetch(API_CONFIG.UPLOAD_URL(courseId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Failed to upload asset');
      }
      const result = await response.json();
      if (type === 'thumbnail' && result.data?.thumbnail_key) {
        setThumbnailKey(result.data.thumbnail_key);
      }
      if (type === 'preview_video' && result.data?.preview_video_key) {
        setVideoKey(result.data.preview_video_key);
      }
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingAsset('');
    }
  };

  // File upload handlers
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
      handleAssetUpload(file, 'thumbnail');
    } else {
      setThumbnailPreview(null);
      setThumbnailKey('');
    }
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      handleAssetUpload(file, 'preview_video');
    } else {
      setVideoPreview(null);
      setVideoKey('');
    }
  };

  // Reviews handlers
  const addReview = () => {
    if (reviewName.trim() && reviewComment.trim()) {
      setReviews((prev) => [
        ...prev,
        { name: reviewName, rating: reviewRating, comment: reviewComment }
      ]);
      setReviewName('');
      setReviewRating('5');
      setReviewComment('');
    }
  };
  const removeReview = (idx) => {
    setReviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // API: Gather all form data
  const getCoursePayload = () => {
    return {
      title: { ...titles },
      subtitle: { ...subtitles },
      price: price ? parseFloat(price) : 0,
      description: { ...descriptions },
      dropdowns: { ...dropdowns },
      objectives: { ...objectives },
      tags: { ...tags },
      thumbnail: thumbnailKey,
      preview_video: videoKey,
      reviews,
    };
  };

  // API: Publish course
  const handlePublishCourse = async () => {
    setPublishLoading(true);
    setPublishAlert({ message: '', type: '' });
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      const payload = getCoursePayload();
      const response = await fetch(API_CONFIG.PUBLISH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Failed to publish course');
      }
      setPublishAlert({ message: 'Course published successfully!', type: 'success' });
      setTimeout(() => setPublishAlert({ message: '', type: '' }), 3000);
    } catch (error) {
      setPublishAlert({ message: error.message || 'Failed to publish course.', type: 'danger' });
    } finally {
      setPublishLoading(false);
    }
  };

  // Progress bar width
  const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

  return (
    <div className="page-section active" id="course-creation-section">
      {/* Progress Container */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className="progress-line"></div>
          <div className="progress-line-active" id="progress-line-active" style={{ width: progressWidth }}></div>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={
                'step' +
                (currentStep === step
                  ? ' active'
                  : currentStep > step
                  ? ' completed'
                  : '')
              }
              data-step={step}
            >
              <div className="step-circle">{step}</div>
              <div className="step-label">
                {step === 1 && 'Course Details'}
                {step === 2 && 'About Course'}
                {step === 3 && 'Sample Reviews'}
                {step === 4 && 'Publish Course'}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Form Container */}
      <div className="form-container">
        {/* Step 1: Course Details (thumbnail upload) */}
        <div className={`form-section${currentStep === 1 ? ' active' : ''}`} id="step-1">
          <h2 className="section-title">Course Details</h2>
          <p className="section-subtitle">Enter the basic information about your course</p>
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <div className="language-tabs">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-tab${titleLang === lang.code ? ' active' : ''}`}
                      data-lang={lang.code}
                      type="button"
                      onClick={() => setTitleLang(lang.code)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                {LANGS.map((lang) => (
                  <input
                    key={lang.code}
                    type="text"
                    className="form-control"
                    id={`title-${lang.code}`}
                    placeholder={
                      lang.code === 'en'
                        ? 'Enter course title in English'
                        : lang.code === 'zh-CN'
                        ? '输入中文课程标题'
                        : '輸入中文課程標題'
                    }
                    style={{ display: titleLang === lang.code ? 'block' : 'none' }}
                    value={titles[lang.code] || ''}
                    onChange={e => setTitles(prev => ({ ...prev, [lang.code]: e.target.value }))}
                  />
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Course Subtitle</label>
                <div className="language-tabs">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-tab${subtitleLang === lang.code ? ' active' : ''}`}
                      data-lang={lang.code}
                      type="button"
                      onClick={() => setSubtitleLang(lang.code)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                {LANGS.map((lang) => (
                  <textarea
                    key={lang.code}
                    className="form-control"
                    id={`subtitle-${lang.code}`}
                    rows={3}
                    placeholder={
                      lang.code === 'en'
                        ? 'Brief description of your course'
                        : lang.code === 'zh-CN'
                        ? '课程简短描述'
                        : '課程簡短描述'
                    }
                    style={{ display: subtitleLang === lang.code ? 'block' : 'none' }}
                    value={subtitles[lang.code] || ''}
                    onChange={e => setSubtitles(prev => ({ ...prev, [lang.code]: e.target.value }))}
                  ></textarea>
                ))}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Course Price ($)</label>
                    <input type="number" className="form-control" id="price" placeholder="0.00" min="0" step="0.01" value={price || ''} onChange={e => setPrice(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form-label">Course Thumbnail</label>
                <div className="file-upload-area" onClick={() => thumbnailInputRef.current.click()}>
                  <div className="file-upload-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p className="mb-1">Click to upload thumbnail</p>
                  <small className="text-muted">JPG, PNG up to 5MB</small>
                </div>
                <input ref={thumbnailInputRef} type="file" id="thumbnail-upload" accept="image/*" style={{ display: 'none' }} onChange={handleThumbnailChange} />
                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="img-fluid mt-2" style={{ maxHeight: '150px', display: 'block' }} />
                )}
                {uploadingAsset === 'thumbnail' && <div className="text-muted mt-2">Uploading...</div>}
                {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
              </div>
            </div>
          </div>
        </div>
        {/* Step 2: About Course (video upload) */}
        <div className={`form-section${currentStep === 2 ? ' active' : ''}`} id="step-2">
          <h2 className="section-title">About Course</h2>
          <p className="section-subtitle">Provide detailed information about your course</p>
          <div className="form-group">
            <label className="form-label">Course Description</label>
            <div className="language-tabs">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-tab${descLang === lang.code ? ' active' : ''}`}
                  data-lang={lang.code}
                  type="button"
                  onClick={() => setDescLang(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            {/* English */}
            <div className="row mb-3" id="row-en" style={{ display: descLang === 'en' ? 'flex' : 'none' }}>
              <div className="col-md-6">
                <label htmlFor="description-en" className="form-label">Description (English)</label>
                <textarea className="form-control" id="description-en" rows={4} placeholder="Enter course description..." value={descriptions['en'] || ''} onChange={e => setDescriptions(prev => ({ ...prev, en: e.target.value }))}></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="dropdown-en" className="form-label">Select Option</label>
                <select className="form-control" id="dropdown-en" value={dropdowns['en'] || ''} onChange={e => setDropdowns(prev => ({ ...prev, en: e.target.value }))}>
                  <option value="">Select an option</option>
                  <option value="1">EN Option 1</option>
                  <option value="2">EN Option 2</option>
                </select>
              </div>
            </div>
            {/* Simplified Chinese */}
            <div className="row mb-3" id="row-zh-CN" style={{ display: descLang === 'zh-CN' ? 'flex' : 'none' }}>
              <div className="col-md-6">
                <label htmlFor="description-zh-CN" className="form-label">Description (简体中文)</label>
                <textarea className="form-control" id="description-zh-CN" rows={4} placeholder="输入课程描述..." value={descriptions['zh-CN'] || ''} onChange={e => setDescriptions(prev => ({ ...prev, 'zh-CN': e.target.value }))}></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="dropdown-zh-CN" className="form-label">Select Option</label>
                <select className="form-control" id="dropdown-zh-CN" value={dropdowns['zh-CN'] || ''} onChange={e => setDropdowns(prev => ({ ...prev, 'zh-CN': e.target.value }))}>
                  <option value="">Select an option</option>
                  <option value="1">ZH-CN Option 1</option>
                  <option value="2">ZH-CN Option 2</option>
                </select>
              </div>
            </div>
            {/* Traditional Chinese */}
            <div className="row mb-3" id="row-zh-TW" style={{ display: descLang === 'zh-TW' ? 'flex' : 'none' }}>
              <div className="col-md-6">
                <label htmlFor="description-zh-TW" className="form-label">Description (繁體中文)</label>
                <textarea className="form-control" id="description-zh-TW" rows={4} placeholder="輸入課程描述..." value={descriptions['zh-TW'] || ''} onChange={e => setDescriptions(prev => ({ ...prev, 'zh-TW': e.target.value }))}></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="dropdown-zh-TW" className="form-label">Select Option</label>
                <select className="form-control" id="dropdown-zh-TW" value={dropdowns['zh-TW'] || ''} onChange={e => setDropdowns(prev => ({ ...prev, 'zh-TW': e.target.value }))}>
                  <option value="">Select an option</option>
                  <option value="1">ZH-TW Option 1</option>
                  <option value="2">ZH-TW Option 2</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Learning Objectives</label>
            <div className="language-tabs">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-tab${objectivesLang === lang.code ? ' active' : ''}`}
                  data-lang={lang.code}
                  type="button"
                  onClick={() => setObjectivesLang(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <div id="objectives-container-en" style={{ display: objectivesLang === 'en' ? 'block' : 'none' }}>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter learning objective"
                  value={objectiveInput['en'] || ''}
                  onChange={e => setObjectiveInput(prev => ({ ...prev, en: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addObjective('en'); } }}
                />
                <button className="btn btn-primary" type="button" onClick={() => addObjective('en')}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="tag-container">
                {objectives['en'].map((obj, idx) => (
                  <span className="tag" key={idx}>
                    {obj}
                    <span className="tag-remove" onClick={() => removeObjective('en', idx)}>
                      <i className="fas fa-times"></i>
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div id="objectives-container-zh-CN" style={{ display: objectivesLang === 'zh-CN' ? 'block' : 'none' }}>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="输入学习目标"
                  value={objectiveInput['zh-CN'] || ''}
                  onChange={e => setObjectiveInput(prev => ({ ...prev, 'zh-CN': e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addObjective('zh-CN'); } }}
                />
                <button className="btn btn-primary" type="button" onClick={() => addObjective('zh-CN')}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="tag-container">
                {objectives['zh-CN'].map((obj, idx) => (
                  <span className="tag" key={idx}>
                    {obj}
                    <span className="tag-remove" onClick={() => removeObjective('zh-CN', idx)}>
                      <i className="fas fa-times"></i>
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div id="objectives-container-zh-TW" style={{ display: objectivesLang === 'zh-TW' ? 'block' : 'none' }}>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="輸入學習目標"
                  value={objectiveInput['zh-TW'] || ''}
                  onChange={e => setObjectiveInput(prev => ({ ...prev, 'zh-TW': e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addObjective('zh-TW'); } }}
                />
                <button className="btn btn-primary" type="button" onClick={() => addObjective('zh-TW')}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="tag-container">
                {objectives['zh-TW'].map((obj, idx) => (
                  <span className="tag" key={idx}>
                    {obj}
                    <span className="tag-remove" onClick={() => removeObjective('zh-TW', idx)}>
                      <i className="fas fa-times"></i>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Course Tags</label>
                <div className="language-tabs">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      className={`lang-tab${tagsLang === lang.code ? ' active' : ''}`}
                      data-lang={lang.code}
                      type="button"
                      onClick={() => setTagsLang(lang.code)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <div className="input-group mb-2" id="tag-group-en" style={{ display: tagsLang === 'en' ? 'flex' : 'none' }}>
                  <input
                    type="text"
                    className="form-control"
                    id="tag-input-en"
                    placeholder="Enter tag and press Enter"
                    value={tagInput['en'] || ''}
                    onChange={e => setTagInput(prev => ({ ...prev, en: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('en'); } }}
                  />
                  <button className="btn btn-primary" type="button" onClick={() => addTag('en')}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="tag-container" id="tags-en" style={{ display: tagsLang === 'en' ? 'flex' : 'none' }}>
                  {tags['en'].map((tag, idx) => (
                    <span className="tag" key={idx}>
                      {tag}
                      <span className="tag-remove" onClick={() => removeTag('en', idx)}>
                        <i className="fas fa-times"></i>
                      </span>
                    </span>
                  ))}
                </div>
                <div className="input-group mb-2" id="tag-group-zh-CN" style={{ display: tagsLang === 'zh-CN' ? 'flex' : 'none' }}>
                  <input
                    type="text"
                    className="form-control"
                    id="tag-input-zh-CN"
                    placeholder="输入标签"
                    value={tagInput['zh-CN'] || ''}
                    onChange={e => setTagInput(prev => ({ ...prev, 'zh-CN': e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('zh-CN'); } }}
                  />
                  <button className="btn btn-primary" type="button" onClick={() => addTag('zh-CN')}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="tag-container" id="tags-zh-CN" style={{ display: tagsLang === 'zh-CN' ? 'flex' : 'none' }}>
                  {tags['zh-CN'].map((tag, idx) => (
                    <span className="tag" key={idx}>
                      {tag}
                      <span className="tag-remove" onClick={() => removeTag('zh-CN', idx)}>
                        <i className="fas fa-times"></i>
                      </span>
                    </span>
                  ))}
                </div>
                <div className="input-group mb-2" id="tag-group-zh-TW" style={{ display: tagsLang === 'zh-TW' ? 'flex' : 'none' }}>
                  <input
                    type="text"
                    className="form-control"
                    id="tag-input-zh-TW"
                    placeholder="輸入標籤"
                    value={tagInput['zh-TW'] || ''}
                    onChange={e => setTagInput(prev => ({ ...prev, 'zh-TW': e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('zh-TW'); } }}
                  />
                  <button className="btn btn-primary" type="button" onClick={() => addTag('zh-TW')}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="tag-container" id="tags-zh-TW" style={{ display: tagsLang === 'zh-TW' ? 'flex' : 'none' }}>
                  {tags['zh-TW'].map((tag, idx) => (
                    <span className="tag" key={idx}>
                      {tag}
                      <span className="tag-remove" onClick={() => removeTag('zh-TW', idx)}>
                        <i className="fas fa-times"></i>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Course Thumbnail Video</label>
                <div className="file-upload-area" onClick={() => videoInputRef.current.click()}>
                  <div className="file-upload-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p className="mb-1">Click to upload Video</p>
                </div>
                <input ref={videoInputRef} type="file" id="preview-video" accept="video/*" style={{ display: 'none' }} onChange={handleVideoChange} />
                {videoPreview && (
                  <video src={videoPreview} controls className="img-fluid mt-2" style={{ maxHeight: '150px', display: 'block' }} />
                )}
                {uploadingAsset === 'preview_video' && <div className="text-muted mt-2">Uploading...</div>}
                {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
              </div>
            </div>
          </div>
        </div>
        {/* Step 3: Sample Reviews (dynamic) */}
        <div className={`form-section${currentStep === 3 ? ' active' : ''}`} id="step-3">
          <h2 className="section-title">Sample Reviews</h2>
          <p className="section-subtitle">Add sample reviews and testimonials for your course</p>
          <div className="form-group">
            <label className="form-label">Sample Reviews</label>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Reviewer Name"
                value={reviewName || ''}
                onChange={e => setReviewName(e.target.value)}
              />
              <select
                className="form-control mb-2"
                value={reviewRating || ''}
                onChange={e => setReviewRating(e.target.value)}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <textarea
                className="form-control mb-2"
                placeholder="Review Comment"
                value={reviewComment || ''}
                onChange={e => setReviewComment(e.target.value)}
              ></textarea>
              <button className="btn btn-primary" type="button" onClick={addReview}>
                <i className="fas fa-plus me-2"></i>Add Review
              </button>
            </div>
            <div id="reviews-container">
              {reviews.length === 0 && <div className="text-muted">No reviews added yet.</div>}
              {reviews.map((review, idx) => (
                <div className="lesson-item mb-3" key={idx}>
                  <div className="lesson-header">
                    <h6 className="mb-0">{review.name} ({review.rating} Stars)</h6>
                    <button className="btn btn-danger btn-sm" type="button" onClick={() => removeReview(idx)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="lesson-content" style={{ display: 'block' }}>
                    <div className="form-group">
                      <label className="form-label">Review Comment</label>
                      <p>{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Step 4: Publish Course (show reviews in preview) */}
        <div className={`form-section${currentStep === 4 ? ' active' : ''}`} id="step-4">
          <h2 className="section-title">Course Preview</h2>
          <p className="section-subtitle">Review your course before publishing</p>
          {publishAlert.message && (
            <div className={`alert alert-${publishAlert.type}`}>{publishAlert.message}</div>
          )}
          <div className="row">
            <div className="col-md-8">
              <div className="course-preview">
                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt="Course Thumbnail" className="preview-thumbnail" id="preview-thumbnail" />
                )}
                <h3 className="preview-title" id="preview-title">{titles['en'] || 'Course Title'}</h3>
                <p className="text-muted mb-3" id="preview-subtitle">{subtitles['en'] || 'Course subtitle will appear here'}</p>
                <div className="preview-price mb-3" id="preview-price">${price || '0.00'}</div>
                <div className="mb-3">
                  <h6>Learning Objectives:</h6>
                  <ul id="preview-objectives" className="text-muted">
                    {objectives['en'].map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6>Course Content:</h6>
                  <div id="preview-lessons" className="text-muted">
                    {/* Lessons will be listed here */}
                  </div>
                </div>
                {videoPreview && (
                  <div className="mt-3">
                    <h6>Preview Video:</h6>
                    <video src={videoPreview} controls className="img-fluid" style={{ maxHeight: '150px', display: 'block' }} />
                  </div>
                )}
                <div className="mt-3">
                  <h6>Sample Reviews:</h6>
                  {reviews.length === 0 && <div className="text-muted">No reviews added yet.</div>}
                  {reviews.map((review, idx) => (
                    <div key={idx} className="mb-2">
                      <strong>{review.name}</strong> ({review.rating} Stars):<br />
                      <span>{review.comment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="course-preview">
                <h6 className="mb-3">Course Statistics</h6>
                <div className="mb-2">
                  <strong>Total Lessons:</strong>
                  <span id="total-lessons">0</span>
                </div>
                <div className="mb-2">
                  <strong>Free Lessons:</strong>
                  <span id="free-lessons">0</span>
                </div>
                <div className="mb-2">
                  <strong>Total Duration:</strong>
                  <span id="total-duration">0:00</span>
                </div>
                <div className="mb-2">
                  <strong>Languages:</strong>
                  <span>EN, 中文</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="wizard-navigation">
          <button
            className="btn btn-outline-primary"
            id="prev-btn"
            style={{ display: currentStep > 1 ? 'block' : 'none' }}
            onClick={handlePrev}
          >
            <i className="fas fa-arrow-left me-2"></i>Previous
          </button>
          <button
            className={currentStep === totalSteps ? 'btn btn-success' : 'btn btn-primary'}
            id="next-btn"
            onClick={currentStep === totalSteps ? handlePublishCourse : handleNext}
            disabled={publishLoading || uploadingAsset}
          >
            {publishLoading || uploadingAsset ? (
              <span className="loading-spinner"></span>
            ) : currentStep === totalSteps ? (
              <>
                <i className="fas fa-rocket me-2"></i>Publish Course
              </>
            ) : (
              <>
                Next <i className="fas fa-arrow-right ms-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCreation; 