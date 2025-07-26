import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonsModal from './LessonsModal';

const shimmerRows = 4;

const ShimmerTable = () => (
  <div className="table-responsive">
    <table className="table table-striped align-middle">
      <thead>
        <tr>
          <th>Order</th>
          <th>Title</th>
          <th>Video Duration</th>
          <th>Free?</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: shimmerRows }).map((_, idx) => (
          <tr key={idx}>
            <td><div className="shimmer shimmer-cell" /></td>
            <td><div className="shimmer shimmer-cell" /></td>
            <td><div className="shimmer shimmer-cell" /></td>
            <td><div className="shimmer shimmer-cell" /></td>
            <td><div className="shimmer shimmer-cell" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LessonsTable = ({ darkMode, setDarkMode }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'edit' or 'view'
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Function to fetch lessons data
  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`https://jacobpersonal.onrender.com/admin/api/courses/${courseId}/lessons`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const data = await response.json();
      setLessons(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and fetch lesson data
  const openLessonModal = (lesson, mode) => {
    setModalMode(mode);
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    const token = sessionStorage.getItem('authToken');
    fetch(`https://jacobpersonal.onrender.com/admin/api/courses/${courseId}/lessons/${lesson.lesson_key}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch lesson');
        return res.json();
      })
      .then((data) => {
        const apiLesson = data.data;
        const lessonData = apiLesson.lesson_data || {};
        const lesson = {
          title: lessonData.title || { en: '', 'zh-CN': '', 'zh-TW': '' },
          content: lessonData.content || { en: '', 'zh-CN': '', 'zh-TW': '' },
          isFree: lessonData.is_free ?? false,
          duration: lessonData.video_duration || '',
          videoKey: lessonData.video_url || '',
          lesson_key: apiLesson.lesson_key || '',
          course_id: apiLesson.course_id || courseId,
          activeLang: 'en',
        };
        console.log('Lesson passed to modal:', lesson);
        setSelectedLesson(lesson);
        setModalLoading(false);
      })
      .catch((err) => {
        setModalError(err.message);
        setModalLoading(false);
      });
  };

  // Add Lesson logic for LessonsTable
  const handleAddLesson = () => {
    setModalMode('edit');
    setSelectedLesson({
      title: { en: '', 'zh-CN': '', 'zh-TW': '' },
      content: { en: '', 'zh-CN': '', 'zh-TW': '' },
      video_duration: '',
      video_url: '',
      is_free: false,
      lesson_key: '',
      course_id: courseId,
      activeLang: 'en',
    });
    setModalOpen(true);
    setModalLoading(false);
    setModalError(null);
  };

  // Handlers for actions
  const handleEdit = (lesson) => {
    openLessonModal(lesson, 'edit');
  };
  const handleView = (lesson) => {
    openLessonModal(lesson, 'view');
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLesson(null);
    setModalError(null);
    fetchLessons(); // Refresh lessons data after modal closes
  };

  // Fetch lessons on component mount
  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  return (
    <div className="container mt-4">
      <style>{`
        .shimmer {
          height: 1.2em;
          width: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
          background-size: 400% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
          border-radius: 4px;
        }
        .shimmer-cell {
          min-width: 80px;
          height: 1.2em;
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .table {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .table th {
          border-bottom: 2px solid #dee2e6;
          background-color: #f8f9fa;
          font-weight: 600;
          padding: 12px 16px;
        }
        .table td {
          border-bottom: 1px solid #dee2e6;
          padding: 12px 16px;
          vertical-align: middle;
        }
        .table tbody tr:last-child td {
          border-bottom: none;
        }
        .table tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lessons</h2>
        <div>
          <button className="btn btn-primary me-2" onClick={handleAddLesson}>
            <i className="fas fa-plus me-1"></i>Add Lesson
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            &larr; Back to Courses
          </button>
        </div>
      </div>
      {modalOpen && (
        <LessonsModal
          show={modalOpen}
          onClose={handleCloseModal}
          course={{ course_id: courseId }}
          lessons={selectedLesson ? [{ ...selectedLesson, activeLang: selectedLesson.activeLang || 'en' }] : []}
          mode={modalMode}
          loading={modalLoading}
          error={modalError}
        />
      )}
      {loading && <ShimmerTable />}
      {error && <div className="alert alert-danger">Error: {error}</div>}
      {!loading && !error && (
        lessons.length ? (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Title</th>
                  <th>Video Duration</th>
                  <th>Free?</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.lesson_key}>
                    <td>{lesson.order_num}</td>
                    <td>{lesson.title}</td>
                    <td>{lesson.video_duration}</td>
                    <td>{lesson.is_free ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-view" title="View" onClick={() => handleView(lesson)}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn-action btn-edit" title="Edit" onClick={() => handleEdit(lesson)}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">No lessons found</div>
        )
      )}
    </div>
  );
};

export default LessonsTable; 