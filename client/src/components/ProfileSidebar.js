import React from 'react';
import { Offcanvas, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserCog, FaSignOutAlt, FaUser, FaHistory } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { useAuth } from '../store/auth';
import '../styles/theme.css';

const ProfileSidebar = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { LogoutUser, user } = useAuth();
  
  // Default profile image if none is set
  const profileImage = user?.profileImage || '/images/default-profile.png';
  
  const handleLogout = () => {
    LogoutUser();
    handleClose();
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={handleClose} 
      placement="end"
      className="profile-sidebar"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        color: 'var(--text-color)',
        borderLeft: '1px solid var(--border-color)'
      }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ color: 'var(--primary-color)' }}>Your Profile</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <Image 
              src={profileImage} 
              roundedCircle 
              width={100} 
              height={100} 
              className="mb-3 profile-image"
              style={{ 
                objectFit: 'cover',
                border: '3px solid var(--primary-color)',
                filter: 'var(--image-filter)'
              }}
              onError={(e) => {
                console.log('Profile image failed to load in sidebar');
                e.target.onerror = null;
                e.target.src = '/images/default-profile.png';
              }}
            />
          </div>
          <h5 style={{ color: 'var(--text-color)' }}>{user?.username || 'User'}</h5>
          <p style={{ color: 'var(--muted-color)' }}>{user?.email || 'email@example.com'}</p>
        </div>
        
        <div className="profile-menu">
          <Button 
            variant="outline-primary" 
            className="w-100 mb-3 d-flex align-items-center"
            onClick={() => handleNavigate('/profile')}
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)'
            }}
          >
            <FaUser className="me-2" /> View Profile
          </Button>
          
          <Button 
            variant="outline-primary" 
            className="w-100 mb-3 d-flex align-items-center"
            onClick={() => handleNavigate('/profile/settings')}
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)'
            }}
          >
            <IoSettingsOutline className="me-2" /> Settings
          </Button>
          
          <Button 
            variant="outline-primary" 
            className="w-100 mb-3 d-flex align-items-center"
            onClick={() => handleNavigate('/profile/preferences')}
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)'
            }}
          >
            <FaUserCog className="me-2" /> Preferences
          </Button>
          
          <Button 
            variant="outline-primary" 
            className="w-100 mb-3 d-flex align-items-center"
            onClick={() => handleNavigate('/profile/history')}
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)'
            }}
          >
            <FaHistory className="me-2" /> History
          </Button>
          
          <hr style={{ borderColor: 'var(--border-color)' }} />
          
          <Button 
            variant="outline-danger" 
            className="w-100 d-flex align-items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProfileSidebar;
