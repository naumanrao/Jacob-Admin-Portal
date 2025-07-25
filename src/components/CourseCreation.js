import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
];

const API_CONFIG = {
  PUBLISH_URL: 'https://jacobpersonal.onrender.com/admin/api/courses',
  UPLOAD_URL: (courseId) => `https://jacobpersonal.onrender.com/admin/api/courses/${courseId}/upload-assets`,
};

function CourseCreation({ editingCourse, darkMode, setDarkMode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

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

  // Dropdown options state
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState('');

  // Add state for courseId
  const [courseId, setCourseId] = useState(null);

  // Add state for pending uploads
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState(null);
  const [pendingVideoFile, setPendingVideoFile] = useState(null);

  // Add state for final submission loading and alert
  const [finalSubmitLoading, setFinalSubmitLoading] = useState(false);
  const [finalSubmitAlert, setFinalSubmitAlert] = useState({ message: '', type: '' });

  // Fetch dropdown options from API on mount
  useEffect(() => {
    setDropdownLoading(true);
    setDropdownError('');
    const token = sessionStorage.getItem('authToken');
    fetch('https://jacobpersonal.onrender.com/admin/api/content-types?entity=courses', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dropdown options');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data?.data?.content_types)) {
          setDropdownOptions(data.data.content_types);
        } else {
          setDropdownOptions([]);
        }
      })
      .catch(err => {
        setDropdownError('Could not load options');
        setDropdownOptions([]);
      })
      .finally(() => setDropdownLoading(false));
  }, []);

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

  // useEffect to watch for courseId and upload any pending files
  useEffect(() => {
    if (courseId && pendingThumbnailFile) {
      handleAssetUpload(pendingThumbnailFile, 'thumbnail');
      setPendingThumbnailFile(null);
    }
    if (courseId && pendingVideoFile) {
      handleAssetUpload(pendingVideoFile, 'preview_video');
      setPendingVideoFile(null);
    }
  }, [courseId]);

  // Add useEffect to automatically call handleFinalSubmit after both thumbnailKey and videoKey are set and courseId is available
  // Remove any useEffect that calls handleFinalSubmit automatically

  const handleNext = () => {
    if (currentStep === 4) {
      handlePublishCourse();
    } else if (currentStep === 5) {
      handleFinalSubmit();
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
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
      if (!courseId) throw new Error('Course ID not available. Please publish the course first.');
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
      if (courseId) {
        handleAssetUpload(file, 'thumbnail');
      } else {
        setPendingThumbnailFile(file);
      }
    } else {
      setThumbnailPreview(null);
      setThumbnailKey('');
      setPendingThumbnailFile(null);
    }
  };
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      if (courseId) {
        handleAssetUpload(file, 'preview_video');
      } else {
        setPendingVideoFile(file);
      }
    } else {
      setVideoPreview(null);
      setVideoKey('');
      setPendingVideoFile(null);
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
    const LANGS = ['en', 'zh-CN', 'zh-TW'];
    // Helper to fill missing language fields
    const fillLangs = (obj, fallback = '-') => {
      const enVal = obj.en || fallback;
      return {
        en: obj.en || enVal,
        'zh-CN': obj['zh-CN'] || enVal,
        'zh-TW': obj['zh-TW'] || enVal
      };
    };

    // Description content block
    const descContent = {
      text: fillLangs({
        en: descriptions.en || '-',
        'zh-CN': descriptions['zh-CN'] || '-',
        'zh-TW': descriptions['zh-TW'] || '-'
      }),
      type: dropdowns['en'] || 'p'
    };

    // Objectives block
    let hasObjectives = LANGS.some(lang => (objectives[lang] && objectives[lang].length > 0));
    let objectivesContent = null;
    if (hasObjectives) {
      let textObj = {};
      const maxObjectives = Math.max(...LANGS.map(lang => (objectives[lang] || []).length));
      for (let i = 0; i < maxObjectives; i++) {
        // For each objective, fill missing languages with English or '-'
        const enVal = objectives.en[i] || '-';
        textObj[`li${i + 1}`] = fillLangs({
          en: objectives.en[i] || enVal,
          'zh-CN': objectives['zh-CN'][i] || enVal,
          'zh-TW': objectives['zh-TW'][i] || enVal
        }, enVal);
      }
      objectivesContent = {
        text: textObj,
        type: 'li'
      };
    }

    // Reviews object
    const reviewsObj = (reviews || []).reduce((acc, review, idx) => {
      const enComment = review.comment || '-';
      acc[`user_${idx + 1}`] = {
        name: review.name,
        comment: fillLangs({
          en: review.comment || enComment,
          'zh-CN': '',
          'zh-TW': ''
        }, enComment),
        rating: Number(review.rating) || 0
      };
      return acc;
    }, {});

    // Tags: remove empty arrays
    const cleanedTags = {};
    Object.entries(tags).forEach(([lang, arr]) => {
      if (Array.isArray(arr) && arr.length > 0) {
        cleanedTags[lang] = arr;
      }
    });

    // Build content array
    const contentArr = [descContent];
    if (objectivesContent) contentArr.push(objectivesContent);

    return {
      course_template: {
        title: fillLangs(titles, '-'),
        subtitle: fillLangs(subtitles, '-'),
        price: price ? parseFloat(price) : 0,
        preview_video: videoKey,
        thumbnail: thumbnailKey,
        full_details: {
          content: contentArr,
          reviews: reviewsObj,
          tags: cleanedTags
        },
        lessons: {}
      }
    };
  };

  // API: Publish course
  const handlePublishCourse = async () => {
    setPublishLoading(true);
    setPublishAlert({ message: '', type: '' });
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      // Get the payload and override thumbnail and preview_video with empty strings
      const payload = getCoursePayload();
      payload.course_template.thumbnail = '';
      payload.course_template.preview_video = '';
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
      const result = await response.json();
      // Store course_id and move to upload step
      setCourseId(result.data?.course_id || result.course_id || null);
      setPublishAlert({ message: 'Course published successfully! Please upload assets.', type: 'success' });
      setCurrentStep(5);
      setTimeout(() => setPublishAlert({ message: '', type: '' }), 3000);
    } catch (error) {
      setPublishAlert({ message: error.message || 'Failed to publish course.', type: 'danger' });
    } finally {
      setPublishLoading(false);
    }
  };

  // Add handleFinalSubmit
  const handleFinalSubmit = async () => {
    setFinalSubmitLoading(true);
    setFinalSubmitAlert({ message: '', type: '' });
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      if (!courseId) throw new Error('Course ID not available.');
      const payload = getCoursePayload();
      payload.course_template.thumbnail = thumbnailKey;
      payload.course_template.preview_video = videoKey;
      const response = await fetch(`https://jacobpersonal.onrender.com/admin/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Failed to update course');
      }
      setFinalSubmitAlert({ message: 'Course updated successfully!', type: 'success' });
      setTimeout(() => {
        setFinalSubmitAlert({ message: '', type: '' });
        navigate('/courses'); // Adjust path if CoursesList is at a different route
      }, 1500);
    } catch (error) {
      setFinalSubmitAlert({ message: error.message || 'Failed to update course.', type: 'danger' });
    } finally {
      setFinalSubmitLoading(false);
    }
  };

  // Progress bar width
  const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

  const navigate = useNavigate();

  return (
    <div className="page-section active" id="course-creation-section">
      {/* Progress Container */}
      <div className="progress-container">
        <div className="progress-steps">
          <div className="progress-line"></div>
          <div className="progress-line-active" id="progress-line-active" style={{ width: progressWidth }}></div>
          {[1, 2, 3, 4, 5].map((step) => (
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
                {step === 4 && 'Course Preview'}
                {step === 5 && 'Upload Assets'}
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
          <p className="section-subtitle">Enter basic information for your course.</p>
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
                    <label className="form-label">Course Price</label>
                    <input type="number" className="form-control" id="price" placeholder="0.00" min="0" step="0.01" value={price || ''} onChange={e => setPrice(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Step 2: About Course (video upload) */}
        <div className={`form-section${currentStep === 2 ? ' active' : ''}`} id="step-2">
          <h2 className="section-title">About Course</h2>
          <p className="section-subtitle">Provide detailed information about your course.</p>
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
                  <option value="">{dropdownLoading ? 'Loading...' : dropdownError ? dropdownError : 'Select an option'}</option>
                  {dropdownOptions && dropdownOptions.length > 0 && dropdownOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Simplified Chinese */}
            <div className="row mb-3" id="row-zh-CN" style={{ display: descLang === 'zh-CN' ? 'flex' : 'none' }}>
              <div className="col-md-6">
                <label htmlFor="description-zh-CN" className="form-label">Description (Simplified Chinese)</label>
                <textarea className="form-control" id="description-zh-CN" rows={4} placeholder="输入课程描述..." value={descriptions['zh-CN'] || ''} onChange={e => setDescriptions(prev => ({ ...prev, 'zh-CN': e.target.value }))}></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="dropdown-zh-CN" className="form-label">Select Option</label>
                <select className="form-control" id="dropdown-zh-CN" value={dropdowns['zh-CN'] || ''} onChange={e => setDropdowns(prev => ({ ...prev, 'zh-CN': e.target.value }))}>
                  <option value="">{dropdownLoading ? 'Loading...' : dropdownError ? dropdownError : 'Select an option'}</option>
                  {dropdownOptions && dropdownOptions.length > 0 && dropdownOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Traditional Chinese */}
            <div className="row mb-3" id="row-zh-TW" style={{ display: descLang === 'zh-TW' ? 'flex' : 'none' }}>
              <div className="col-md-6">
                <label htmlFor="description-zh-TW" className="form-label">Description (Traditional Chinese)</label>
                <textarea className="form-control" id="description-zh-TW" rows={4} placeholder="輸入課程描述..." value={descriptions['zh-TW'] || ''} onChange={e => setDescriptions(prev => ({ ...prev, 'zh-TW': e.target.value }))}></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="dropdown-zh-TW" className="form-label">Select Option</label>
                <select className="form-control" id="dropdown-zh-TW" value={dropdowns['zh-TW'] || ''} onChange={e => setDropdowns(prev => ({ ...prev, 'zh-TW': e.target.value }))}>
                  <option value="">{dropdownLoading ? 'Loading...' : dropdownError ? dropdownError : 'Select an option'}</option>
                  {dropdownOptions && dropdownOptions.length > 0 && dropdownOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
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
          </div>
        </div>
        {/* Step 3: Sample Reviews (dynamic) */}
        <div className={`form-section${currentStep === 3 ? ' active' : ''}`} id="step-3">
          <h2 className="section-title">Sample Reviews</h2>
          <p className="section-subtitle">Add sample reviews for your course.</p>
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
        {/* Step 4: Course Preview */}
        <div className={`form-section${currentStep === 4 ? ' active' : ''}`} id="step-4">
          <h2 className="section-title">Course Preview</h2>
          <p className="section-subtitle">Review your course details before publishing.</p>
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
                  <span>English, Chinese</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Step 5: Upload Assets */}
        <div className={`form-section${currentStep === 5 ? ' active' : ''}`} id="step-5">
          <h2 className="section-title">Upload Assets</h2>
          <p className="section-subtitle">Upload your course thumbnail and preview video.</p>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Course Thumbnail</label>
                <div className="file-upload-area" onClick={() => { if (thumbnailInputRef.current) thumbnailInputRef.current.click(); }}>
                  <div className="file-upload-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p className="mb-1">Click to upload thumbnail</p>
                  <small className="text-muted">JPG/PNG up to 5MB</small>
                </div>
                <input ref={thumbnailInputRef} type="file" id="thumbnail-upload" accept="image/*" style={{ display: 'none' }} onChange={handleThumbnailChange} />
                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="img-fluid mt-2" style={{ maxHeight: '150px', display: 'block' }} />
                )}
                {uploadingAsset === 'thumbnail' && <div className="text-muted mt-2">Uploading...</div>}
                {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Course Preview Video</label>
                <div className="file-upload-area" onClick={() => { if (videoInputRef.current) videoInputRef.current.click(); }}>
                  <div className="file-upload-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <p className="mb-1">Click to upload video</p>
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
            onClick={handleNext}
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
      {finalSubmitAlert.message && (
        <div className={`alert alert-${finalSubmitAlert.type} position-fixed top-0 start-50 translate-middle-x mt-3`} style={{ zIndex: 9999, minWidth: 300 }}>
          {finalSubmitAlert.message}
        </div>
      )}
    </div>
  );
}

export default CourseCreation; 