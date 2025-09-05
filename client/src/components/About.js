import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaHeart, FaCode, FaUserTie } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  const features = [
    'Track deadlines with the smart Compliance Calendar',
    'Ace your audits using the Secretarial Audit Toolkit',
    'Stay compliant with real-time updates via Regulatory Compass',
    'Digitize records using Statutory Register & Records',
    'Access instant insights with AI Legal Opinions',
    'Conduct lightning-fast research with Legal Research',
    'Follow best practices with step-by-step Procedure Guidance',
    'Draft policies and agreements in minutes',
    'Solve tricky scenarios with the Scenario Solver',
    'Reply to notices from RD, ROC, NCLT – stress-free',
    'Prepare petitions with the built-in Petition Preparator',
    'Run meetings smoothly with the Board & General Meeting Assistants'
  ];

  return (
    <main className="about-page">
      <Container>
        {/* Hero Section */}
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="about-hero">
              <h1 className="about-hero-title">
                <span className="hero-highlight">Smart.</span>{' '}
                <span className="hero-highlight">Simple.</span>{' '}
                <span className="hero-highlight">AI-Powered.</span>
                <br />
                <span className="hero-subtitle">Just for Company Secretaries.</span>
              </h1>
              
              <div className="about-intro">
                <p className="intro-text">
                  Welcome to <strong>AI4CS.in</strong> — where artificial intelligence meets corporate compliance.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Origin Story */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={9}>
            <Card className="about-card origin-card">
              <Card.Body>
                <div className="card-icon">
                  <FaUserTie />
                </div>
                <h2 className="section-title">Built by Company Secretaries, for Company Secretaries</h2>
                <p className="section-text">
                  This powerful web-based platform is the brainchild of <strong>CS Rajiv Shah</strong>, 
                  a rare blend of legal and tech expertise, with over <em>25 years of experience</em> across 
                  secretarial practice and AI-driven software development.
                </p>
                <div className="goal-section">
                  <h3 className="goal-title">The goal?</h3>
                  <p className="goal-text">
                    To empower Company Secretaries with tools that <strong>simplify their day-to-day work</strong>, 
                    boost efficiency, and help them stay <em>miles ahead</em> in a fast-changing regulatory world.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={9}>
            <Card className="about-card features-card">
              <Card.Body>
                <h2 className="section-title">What Can You Do with AI4CS?</h2>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <FaCheckCircle className="feature-icon" />
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="features-summary">
                  <p className="summary-text">
                    From <strong>compliance to communication</strong>, <strong>drafting to decision-making</strong> – 
                    AI4CS is your <em>always-on digital partner</em>.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Thanks Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={10} xl={9}>
            <Card className="about-card thanks-card">
              <Card.Body>
                <div className="card-icon">
                  <FaHeart />
                </div>
                <h2 className="section-title">Special Thanks</h2>
                <div className="thanks-content">
                  <div className="thanks-item">
                    <FaCode className="thanks-icon" />
                    <div className="thanks-text">
                      <p>
                        A big shoutout to <strong>Mr. Parth Gopani</strong> – the tech wizard who brought 
                        this platform to life through his <em>coding brilliance</em>.
                      </p>
                    </div>
                  </div>
                  <div className="thanks-item">
                    <FaUserTie className="thanks-icon" />
                    <div className="thanks-text">
                      <p>
                        And heartfelt thanks to <strong>Mr. Rajesh Seth</strong> for his sharp eye in 
                        technical testing and making sure everything runs like <em>clockwork</em>.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Closing Statement */}
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="about-closing">
              <p className="closing-text">
                <strong>AI4CS.in</strong> – Let AI do the heavy lifting, while you focus on what matters most.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default About;
