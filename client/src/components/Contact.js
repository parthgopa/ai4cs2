import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {  FaHandshake } from 'react-icons/fa';
import '../styles/Contact.css';
import { IoCallOutline, IoMailOutline } from 'react-icons/io5';

const Contact = () => {
  return (
    <main className="contact-page">
      <Container>
        {/* Hero Section */}
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="contact-hero">
              <h1 className="contact-hero-title">
                <span className="hero-highlight">Get in Touch</span>
                <br />
                <span className="hero-subtitle">We're here to help you succeed</span>
              </h1>
              
              <div className="contact-intro">
                <p className="intro-text">
                  Have questions about <strong>AI4CS</strong>? Need support with our tools? 
                  We'd love to hear from you and help streamline your company secretarial work.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Contact Cards */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={9}>
            <Row className="g-4">
              {/* Phone Contact */}
              <Col md={6}>
                <Card className="contact-card phone-card">
                  <Card.Body>
                    <div className="contact-icon">
                      <IoCallOutline size={40} className='navbar-buttons'/>
                    </div>
                    <h3 className="contact-method-title">Call Us</h3>
                    <p className="contact-description">
                      Speak directly with our team for immediate assistance and personalized support.
                    </p>
                    <div className="contact-detail">
                      <a href="tel:+919978062293" className="contact-link">
                        +91 9978062293
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Email Contact */}
              <Col md={6}>
                <Card className="contact-card email-card">
                  <Card.Body>
                    <div className="contact-icon">
                      <IoMailOutline size={40} className='navbar-buttons'/>
                    </div>
                    <h3 className="contact-method-title">Email Us</h3>
                    <p className="contact-description">
                      Send us detailed queries and we'll respond with comprehensive solutions.
                    </p>
                    <div className="contact-detail">
                      <a href="mailto:info@ai4cs.in" className="contact-link">
                        info@ai4cs.in
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* What We Help With */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={9}>
            <Card className="contact-card help-card">
              <Card.Body>
                <div className="card-icon">
                  <FaHandshake size={40} className='navbar-buttons'/>
                </div>
                <h2 className="section-title">How Can We Help You?</h2>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="help-category">
                      <h4 className="help-title">Technical Support</h4>
                      <ul className="help-list">
                        <li>Tool functionality questions</li>
                        <li>Account setup assistance</li>
                        <li>Export and formatting issues</li>
                        <li>Browser compatibility support</li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="help-category">
                      <h4 className="help-title">Professional Guidance</h4>
                      <ul className="help-list">
                        <li>Best practices for compliance</li>
                        <li>Feature recommendations</li>
                        <li>Workflow optimization tips</li>
                        <li>Legal document customization</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Office Information
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={9}>
            <Card className="contact-card office-card">
              <Card.Body>
                <div className="card-icon">
                  <FaMapMarkerAlt />
                </div>
                <h2 className="section-title">Our Commitment</h2>
                <div className="office-content">
                  <Row className="g-4">
                    <Col md={4}>
                      <div className="commitment-item">
                        <FaUsers className="commitment-icon" />
                        <h4 className="commitment-title">Expert Team</h4>
                        <p className="commitment-text">
                          Led by <strong>CS Rajiv Shah</strong> with 25+ years of experience in company law and technology.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="commitment-item">
                        <FaHandshake className="commitment-icon" />
                        <h4 className="commitment-title">Professional Support</h4>
                        <p className="commitment-text">
                          Dedicated assistance from professionals who understand your challenges and requirements.
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="commitment-item">
                        <FaClock className="commitment-icon" />
                        <h4 className="commitment-title">Timely Response</h4>
                        <p className="commitment-text">
                          Quick turnaround times because we know compliance deadlines can't wait.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}

        {/* Call to Action */}
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="contact-cta">
              <h3 className="cta-title">Ready to Transform Your Practice?</h3>
              <p className="cta-text">
                Join hundreds of Company Secretaries who trust <strong>AI4CS</strong> for their daily compliance needs.
              </p>
              <div className="cta-buttons">
                <a href="tel:+919978062293" className="cta-button cta-phone">
                  <IoCallOutline size={20} /> Call Now
                </a>
                <a href="mailto:info@ai4cs.in" className="cta-button cta-email">
                  <IoMailOutline size={20} /> Send Email
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Contact;
