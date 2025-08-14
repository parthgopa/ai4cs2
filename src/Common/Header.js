import React, { useContext, useState } from 'react';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { ThemeContext } from './ThemeContext';
import { IoHomeOutline, IoInformationCircleOutline, IoCallOutline } from 'react-icons/io5';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Navbar expand="lg" sticky="top" variant={theme === 'dark' ? 'dark' : 'light'} className="header-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          {/*Add a image logo*/}
          <div className="logo-container">
            <img src="/logo.jpg" alt="Logo" className="logo" />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="main-offcanvas" 
          onClick={() => setShowMenu(true)}
          className="custom-toggler ms-auto ms-lg-4"
        >
          <div className="toggle-icon">
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </div>
        </Navbar.Toggle>
        <Button 
          onClick={toggleTheme} 
          variant={theme === 'dark' ? 'outline-light' : 'outline-dark'} 
          size="sm" 
          className="theme-toggle-btn d-none d-lg-flex ms-3"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <BsFillSunFill size={18} /> : <BsFillMoonFill size={18} />}
        </Button>
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
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Link as={Link} to="/" className="nav-link" onClick={() => setShowMenu(false)}> <IoHomeOutline size={20} className='navbar-buttons'/> Home</Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link" onClick={() => setShowMenu(false)}> <IoInformationCircleOutline size={20} className='navbar-buttons'/> About</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link" onClick={() => setShowMenu(false)}> <IoCallOutline size={20} className='navbar-buttons'/> Contact Us</Nav.Link>
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
    </Navbar>
  );
};

export default Header;