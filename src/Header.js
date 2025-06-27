import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { ThemeContext } from './ThemeContext';
import './styles/Header.css';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <Navbar expand="lg" className="header-navbar" bg={theme === 'dark' ? 'dark' : 'light'}>
      <Container>
        <Navbar.Brand href="/" className="brand">
          <div className="brand-container">
            <span className="brand-text">AI4CS</span>
            <span className="brand-tool-text">AI tool for company secretary</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" className="nav-link">Home</Nav.Link>
            {/* <Nav.Link href="/services" className="nav-link">Services</Nav.Link>
            <Nav.Link href="/about" className="nav-link">About</Nav.Link>
            <Nav.Link href="/contact" className="nav-link">Contact</Nav.Link>*/}
            <Button  
              onClick={toggleTheme}
              variant={theme === 'dark' ? 'light' : 'dark'}
              size="sm" 
              className="ms-3 theme-toggle"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
