import React, { useEffect, useState } from 'react';
import LessonsModal from './LessonsModal';
import { useNavigate } from 'react-router-dom';

const API_CONFIG = {
  COURSES_LIST_URL: 'https://jacobpersonal.onrender.com/admin/api/courses',
};

function CoursesList({ onEdit, darkMode, setDarkMode }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) throw new Error('Not authenticated');
        const response = await fetch(API_CONFIG.COURSES_LIST_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.message || 'Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Dummy handlers for now
  const handleAddLesson = () => alert('Add Lesson clicked');
  const handleSaveLessons = () => alert('Save Lessons clicked');
  const handleEditLesson = (lesson) => alert('Edit Lesson: ' + lesson.title);
  const handleViewLesson = (lesson) => alert('View Lesson: ' + lesson.title);

  // ShimmerTable for loading state
  function ShimmerTable() {
    return (
      <div style={{ padding: 16 }}>
        <style>{`
          .shimmer {
            height: 1.2em;
            width: 100%;
            background: linear-gradient(90deg, ${darkMode ? '#233554' : '#f0f0f0'} 25%, ${darkMode ? '#1a2332' : '#e0e0e0'} 37%, ${darkMode ? '#233554' : '#f0f0f0'} 63%);
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
        `}</style>
        <table className="courses-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Price</th>
              <th>No. of Lessons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4,5].map(i => (
              <tr key={i}>
                <td><div className="shimmer shimmer-cell" /></td>
                <td><div className="shimmer shimmer-cell" /></td>
                <td><div className="shimmer shimmer-cell" /></td>
                <td><div className="shimmer shimmer-cell" style={{ width: 100 }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page-section active" id="courses-list-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Courses Management</h1>
          <p className="text-muted">Manage your course catalog</p>
        </div>
        <button className="btn btn-primary" onClick={() => { if (onEdit) onEdit(null); navigate('/courses'); }}>
          <i className="fas fa-plus me-2"></i>Create New Course
        </button>
      </div>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number" style={{color: 'var(--primary-color)'}} id="total-courses">{courses.length}</div>
          <div className="stat-label">Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: 'var(--success-color)'}} id="published-courses">0</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: 'var(--warning-color)'}} id="draft-courses">0</div>
          <div className="stat-label">Drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{color: '#9C27B0'}} id="total-students">0</div>
          <div className="stat-label">Total Students</div>
        </div>
      </div>
      {/* Courses Table */}
      <div className="form-container">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            {loading && (
              <div className="loading-spinner"></div>
            )}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
          </div>
          <div className="table-responsive">
            {loading ? (
              <ShimmerTable />
            ) : (
              <table className="courses-table" id="courses-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Price</th>
                    <th>No. of Lessons</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="courses-tbody">
                  {courses.length === 0 && !error && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">No courses found</td>
                    </tr>
                  )}
                  {courses.map((course) => (
                    <tr key={course.course_id}>
                      <td>{course.title || 'Untitled Course'}</td>
                      <td>${course.price || 0}</td>
                      <td>{course.number_of_lessons || 0}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => { if (onEdit) onEdit(course); navigate('/courses'); }}>Edit</button>
                        <button className="btn btn-sm btn-outline-info ms-2" onClick={() => navigate(`/courses/${course.course_id}/lessons`)}>
                          Lessons
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursesList; 