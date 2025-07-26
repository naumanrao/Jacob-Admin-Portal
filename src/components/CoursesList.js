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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
    <div className="page-section active" id="courses-list-section" style={{padding: '32px 0 40px 0'}}>
      <style>{`
        .courses-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: ${darkMode ? '#1a2332' : '#fff'};
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-bottom: 32px;
        }
        .courses-table th, .courses-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid ${darkMode ? '#233554' : '#f0f0f0'};
        }
        .courses-table th {
          background: ${darkMode ? '#233554' : '#f8f9fa'};
          position: sticky;
          top: 0;
          z-index: 2;
          font-weight: 600;
          font-size: 1rem;
        }
        .courses-table tbody tr:nth-child(even) {
          background: ${darkMode ? '#202b3a' : '#f9f9fb'};
        }
        .courses-table tbody tr:hover {
          background: ${darkMode ? '#2a3a54' : '#e6f0fa'};
          transition: background 0.2s;
        }
        .courses-table td {
          vertical-align: middle;
          font-size: 0.97rem;
        }
        .courses-table .course-title-cell {
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .courses-table .action-btn {
          margin-right: 8px;
          min-width: 70px;
        }
        /* Modern search bar */
        .search-bar-container {
          display: flex;
          align-items: center;
          background: ${darkMode ? '#233554' : '#fff'};
          border: 1px solid ${darkMode ? '#2a3a54' : '#e0e0e0'};
          border-radius: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 2px 18px 2px 12px;
          min-width: 220px;
          max-width: 320px;
          width: 100%;
          margin-right: 18px;
          height: 44px;
        }
        .search-bar-container input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          width: 100%;
          padding: 8px 0 8px 8px;
          color: ${darkMode ? '#e3eafc' : '#222'};
        }
        .search-bar-icon {
          color: #888;
          font-size: 1.1rem;
        }
        .items-per-page-select {
          border-radius: 20px;
          border: 1px solid ${darkMode ? '#2a3a54' : '#e0e0e0'};
          background: ${darkMode ? '#233554' : '#fff'};
          padding: 7px 36px 7px 20px;
          font-size: 1rem;
          margin-left: 16px;
          margin-right: 18px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="${darkMode ? '%23b0b8c1' : '%23666'}" height="18" viewBox="0 0 20 20" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 18px 18px;
          height: 44px;
          color: ${darkMode ? '#e3eafc' : '#222'};
        }
        .items-per-page-select:focus {
          border-color: ${darkMode ? '#3b82f6' : '#1976d2'};
          outline: none;
        }
        .table-controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 28px;
          margin-top: 18px;
        }
        .courses-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 32px;
          margin-bottom: 10px;
        }
        .pagination-btn, .pagination-page-btn {
          border: none;
          outline: none;
          background: none;
          border-radius: 999px;
          padding: 8px 18px;
          font-size: 1rem;
          color: ${darkMode ? '#fff' : '#333'};
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          margin: 0 2px;
        }
        .pagination-btn[disabled], .pagination-page-btn[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-page-btn.active {
          background: ${darkMode ? '#3b82f6' : '#1976d2'};
          color: #fff;
          font-weight: 600;
        }
        .pagination-page-btn:not(.active):hover {
          background: ${darkMode ? '#233554' : '#e3eafc'};
        }
        .pagination-ellipsis {
          padding: 0 8px;
          color: #888;
          font-size: 1.1rem;
        }
        @media (max-width: 700px) {
          .courses-table th, .courses-table td {
            padding: 8px 6px;
            font-size: 0.93rem;
          }
          .courses-table .course-title-cell {
            max-width: 120px;
          }
          .table-controls-row {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
            margin-top: 10px;
          }
          .courses-pagination {
            margin-top: 18px;
            gap: 6px;
          }
        }
      `}</style>
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
      {/* Search and Pagination Controls */}
      <div className="form-container">
        <div className="table-controls-row">
          <div className="search-bar-container">
            <span className="search-bar-icon">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="items-per-page-select"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <div className="text-muted" style={{fontSize: '0.98rem'}}>
            <span style={{ color: darkMode ? '#b0b8c1' : '#555' }}>
              Showing {filteredCourses.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length} courses
            </span>
          </div>
        </div>
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
                  {currentCourses.length === 0 && !error && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        {searchTerm ? 'No courses found matching your search' : 'No courses found'}
                      </td>
                    </tr>
                  )}
                  {currentCourses.map((course) => (
                    <tr key={course.course_id}>
                      <td className="course-title-cell" title={course.title || 'Untitled Course'}>{course.title || 'Untitled Course'}</td>
                      <td>${course.price || 0}</td>
                      <td>{course.number_of_lessons || 0}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary action-btn" onClick={() => { if (onEdit) onEdit(course); navigate('/courses'); }}>Edit</button>
                        <button className="btn btn-sm btn-outline-info action-btn" onClick={() => navigate(`/courses/${course.course_id}/lessons`)}>
                          Lessons
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="courses-pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              {/* Page numbers with ellipsis if many pages */}
              {(() => {
                const pageButtons = [];
                const maxPagesToShow = 5;
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, currentPage + 2);
                if (currentPage <= 3) {
                  endPage = Math.min(totalPages, maxPagesToShow);
                } else if (currentPage >= totalPages - 2) {
                  startPage = Math.max(1, totalPages - maxPagesToShow + 1);
                }
                if (startPage > 1) {
                  pageButtons.push(
                    <button key={1} className={`pagination-page-btn${currentPage === 1 ? ' active' : ''}`} onClick={() => handlePageChange(1)}>1</button>
                  );
                  if (startPage > 2) {
                    pageButtons.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
                  }
                }
                for (let page = startPage; page <= endPage; page++) {
                  pageButtons.push(
                    <button
                      key={page}
                      className={`pagination-page-btn${currentPage === page ? ' active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                }
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageButtons.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
                  }
                  pageButtons.push(
                    <button key={totalPages} className={`pagination-page-btn${currentPage === totalPages ? ' active' : ''}`} onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                  );
                }
                return pageButtons;
              })()}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoursesList; 