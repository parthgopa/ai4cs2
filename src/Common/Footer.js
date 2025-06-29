import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <Container>
        <Row className="py-2">
          <Col md={4}>
            <h5 className="footer-heading">AI4CS</h5>
            <p className="footer-text">
              Leveraging AI for Company Secretaries to streamline work processes
              and enhance productivity.
            </p>
          </Col>
          <Col md={4}>
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              {/* <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li> */}
            </ul>
          </Col>
          <Col md={4}>
            <h5 className="footer-heading">Contact Us</h5>
            <address className="footer-contact">
              {/* <p><i className="bi bi-geo-alt"></i> 123 Business Street, New Delhi, India</p> */}
              <p><i className="bi bi-telephone"></i> +91 98765 XXXXX</p>
              <p><i className="bi bi-envelope"></i> info@xyz.com</p>
            </address>
          </Col>
        </Row>
        <Row className="border-top py-3">
          <Col className="text-center">
            <p className="mb-0 footer-copyright">
              &copy; {currentYear} AI4CS. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
