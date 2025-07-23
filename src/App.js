import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './CoursePortal.css';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import CourseCreation from './components/CourseCreation';
import CoursesList from './components/CoursesList';
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

function MainApp() {
  const [activeSection, setActiveSection] = useState('courses');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section !== 'courses') setEditingCourse(null);
    setSidebarOpen(false);
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
        />
        <div className="content-area">
          {activeSection === 'courses' && <CourseCreation editingCourse={editingCourse} />}
          {activeSection === 'courses-list' && <CoursesList onEdit={handleEditCourse} />}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{textAlign:'center',marginTop:'3rem'}}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/*" element={<MainApp />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
