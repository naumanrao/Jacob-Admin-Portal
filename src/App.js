import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import './CoursePortal.css';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import CourseCreation from './components/CourseCreation';
import CoursesList from './components/CoursesList';
import LessonsTable from './components/LessonsTable';
const Login = React.lazy(() => import('./components/Login'));

function useSessionExpiration() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const loginTime = sessionStorage.getItem('loginTime');
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('loginTime');
        alert('Your session has expired. Please log in again.');
        navigate('/login', { replace: true });
      }
    }
  }, [location, navigate]);
}

function RequireAuth() {
  useSessionExpiration();
  const token = sessionStorage.getItem('authToken');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function MainApp({ darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Set initial activeSection based on current route
  const getInitialSection = () => {
    if (location.pathname.startsWith('/courses-list')) return 'courses-list';
    if (location.pathname.startsWith('/courses')) return 'courses';
    return 'courses-list'; // fallback
  };
  const [activeSection, setActiveSection] = useState(getInitialSection());
  // Sync activeSection with the current route
  useEffect(() => {
    if (location.pathname.startsWith('/courses-list')) {
      setActiveSection('courses-list');
    } else if (location.pathname.startsWith('/courses/') && location.pathname.includes('/lessons')) {
      setActiveSection('courses-list');
    } else if (location.pathname.startsWith('/courses')) {
      setActiveSection('courses');
    }
  }, [location.pathname]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section !== 'courses') setEditingCourse(null);
    setSidebarOpen(false);
    if (section === 'courses') navigate('/courses');
    else if (section === 'courses-list') navigate('/courses-list');
  };
  const handleSidebarToggle = () => {
    setSidebarOpen((open) => !open);
  };
  const handleSaveDraft = () => {
    alert('Save as draft clicked');
  };
  const handlePublish = () => {
    alert('Publish clicked');
  };
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setActiveSection('courses');
  };

  // Check if current route is lessons table
  const lessonsMatch = matchPath('/courses/:courseId/lessons', location.pathname);

  return (
    <>
      <div
        className={`sidebar-overlay${sidebarOpen ? ' show' : ''}`}
        id="sidebar-overlay"
        onClick={handleSidebarToggle}
      ></div>
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      <div className="main-content">
        <TopNavbar
          breadcrumbText={activeSection === 'courses' ? (editingCourse ? 'Edit Course' : 'Create Course') : 'Courses List'}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onSidebarToggle={handleSidebarToggle}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <div className="content-area">
          <Routes>
            <Route path="courses/:courseId/lessons" element={<LessonsTable darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="courses" element={<CourseCreation editingCourse={editingCourse} darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="courses-list" element={<CoursesList onEdit={handleEditCourse} darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="*" element={<Navigate to="courses-list" />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  // Only keep global theme state
  const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem('mainDarkMode') === 'true');

  React.useEffect(() => {
    localStorage.setItem('mainDarkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Suspense fallback={<div style={{textAlign:'center',marginTop:'3rem'}}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route element={<RequireAuth />}>
            <Route path="/*" element={
              <MainApp
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            } />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
