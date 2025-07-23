import React from 'react';

function Sidebar({ activeSection, onSectionChange }) {
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <div className="logo-text">Jacob Loveis</div>
      </div>
      <nav className="sidebar-menu">
        <button
          className={`menu-item${activeSection === 'courses' ? ' active' : ''}`}
          id="menu-publish"
          onClick={() => onSectionChange('courses')}
        >
          <i className="fas fa-book-open"></i> Publish Courses
        </button>
        <button
          className={`menu-item${activeSection === 'courses-list' ? ' active' : ''}`}
          id="menu-list"
          onClick={() => onSectionChange('courses-list')}
        >
          <i className="fas fa-list"></i> Courses List
        </button>
      </nav>
    </div>
  );
}

export default Sidebar; 