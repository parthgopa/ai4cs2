import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { ThemeContext } from './ThemeContext';
import { IoHomeOutline, IoInformationCircleOutline, IoCallOutline, IoPersonAddOutline, IoLogInOutline } from 'react-icons/io5';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import Chatbot from '../components/Chatbot';
import ProfileSidebar from '../components/ProfileSidebar';
import FirstTimeLoginModal from '../components/FirstTimeLoginModal';
import { useAuth } from '../store/auth';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);
  const toggleProfileSidebar = () => setShowProfileSidebar(!showProfileSidebar);

  const { isLoggedIn, user } = useAuth();

  return (
    <Navbar expand="lg" sticky="top" variant={theme === 'dark' ? 'dark' : 'light'} className="header-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          {/*Add a image logo*/}
          <div className="logo-container">
            <img src="/logo.jpg" alt="Logo" className="logo" />
          </div>
        </Navbar.Brand>

        {/* Chatbot Toggle Button - Center */}
        <div className="chatbot-header-toggle d-flex justify-content-center flex-grow-1">
          <Button 
            className="chatbot-toggle-header d-none d-lg-flex"
            onClick={toggleChatbot}
            aria-label="Toggle AI Assistant"
            variant="outline-primary"
          >
            <img src="/images/chatbot.jpg" alt="AI Assistant" className="chatbot-image" />
            <div className="ms-2" style={{ fontWeight: 'bold',fontSize: '18px',alignItems: 'center',display: 'flex' }}>AI Assistant</div>
          </Button>

          {/* Mobile Chatbot Image Toggle */}
          <Button 
            className="chatbot-toggle-image d-lg-none"
            onClick={toggleChatbot}
            aria-label="Toggle AI Assistant"
          >
            <img 
              src="/images/chatbot.jpg" 
              alt="AI Assistant"
              className="chatbot-image-mobile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </Button>
        </div>

        <div className="d-flex align-items-right">
          <Button 
            onClick={toggleTheme} 
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
            size="sm" 
            className="theme-toggle-btn d-none d-lg-flex align-items-center me-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <BsFillSunFill size={16} className="me-1" /> 
                <span className="theme-text">Light</span>
              </>
            ) : (
              <>
                <BsFillMoonFill size={16} className="me-1" /> 
                <span className="theme-text">Dark</span>
              </>
            )}
          </Button>
          <Navbar.Toggle 
            aria-controls="main-offcanvas" 
            onClick={() => setShowMenu(true)}
            className="custom-toggler d-lg-none"
          >
            <div className="toggle-icon">
              <span className="toggle-bar"></span>
              <span className="toggle-bar"></span>
              <span className="toggle-bar"></span>
            </div>
          </Navbar.Toggle>
        </div>
        <Navbar.Offcanvas
          id="main-offcanvas"
          aria-labelledby="main-offcanvas-label"
          placement="end"
          className="header-offcanvas"
          show={showMenu}
          onHide={() => setShowMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="main-offcanvas-label" className="offcanvas-title">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="align-items-lg-center ms-lg-auto">
              <Nav.Link as={Link} to="/" className="nav-link" onClick={() => setShowMenu(false)}> <IoHomeOutline size={20} className='navbar-buttons'/> Home</Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link" onClick={() => setShowMenu(false)}> <IoInformationCircleOutline size={20} className='navbar-buttons'/> About</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link" onClick={() => setShowMenu(false)}> <IoCallOutline size={20} className='navbar-buttons'/> Contact Us</Nav.Link>
              {isLoggedIn ? (
                <Nav.Link className="nav-link" onClick={() => {
                  setShowMenu(false);
                  toggleProfileSidebar();
                }}>
                  <div className="d-flex align-items-center">
                    {user && user.profileImage ? (
                      <>
                        <div className="position-relative">
                          <Image 
                            src={user.profileImage} 
                            roundedCircle 
                            width={24} 
                            height={24} 
                            className="me-2"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              console.log('Profile image failed to load in header');
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              // Show fallback icon
                              const fallbackIcon = document.getElementById('profile-fallback-icon');
                              if (fallbackIcon) {
                                fallbackIcon.style.display = 'inline';
                              }
                            }}
                          />
                          <FaUserCircle 
                            id="profile-fallback-icon" 
                            size={20} 
                            className="me-2" 
                            style={{ display: 'none', position: 'absolute', left: 0, top: 0 }} 
                          />
                        </div>
                      </>
                    ) : (
                      <FaUserCircle size={20} className="me-2" />
                    )}
                    Profile
                  </div>
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={Link} to="/register" className="nav-link" onClick={() => setShowMenu(false)}> <IoPersonAddOutline size={20} /> Register</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="nav-link" onClick={() => setShowMenu(false)}> <IoLogInOutline size={20} /> Login</Nav.Link>
                </>
              )}
              
              <Button
                variant="outline-secondary"
                className="theme-toggle ms-lg-3 my-2 d-lg-none d-flex align-items-center"
                onClick={() => {
                  toggleTheme();
                  setShowMenu(false);
                }}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
              >
                {theme === 'dark' ? <><BsFillSunFill size={18} className='theme-buttons'/>  Light</> : <><BsFillMoonFill size={18} className='theme-buttons'/>  Dark</>}
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />

      {/* Profile Sidebar */}
      {isLoggedIn && <ProfileSidebar show={showProfileSidebar} handleClose={() => setShowProfileSidebar(false)} />}
      
      {/* First Time Login Modal */}
      {isLoggedIn && <FirstTimeLoginModal />}
    </Navbar>
  );
};

export default Header;