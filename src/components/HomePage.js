import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Function to navigate to tools page
  const navigateToTools = () => {
    navigate('/tools');
  };
  

  

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container fluid className="px-2">
          <Row className="justify-content-center">
            <Col xs={12} sm={11} md={10} lg={8} xl={7} className="text-center">
              <div className="hero-content">
                <h1 className="hero-title">Unlock AI-Powered Efficiency in Your Practice</h1>
                <div className="hero-description">
                  <p>At AI4CS.in, we're committed to revolutionizing the field of company secretarial services with cutting-edge Artificial Intelligence solutions. Our innovative platform is designed to empower company secretaries like you, streamlining workflows, automating routine tasks, and providing actionable insights to inform strategic decision-making.</p>
                  <p>By leveraging our AI-powered tools, you'll enjoy enhanced productivity, improved accuracy, and reduced compliance risks. Our platform helps you stay ahead of regulatory changes, ensuring seamless execution of corporate actions and expert-level service delivery.</p>
                  
                  <div className="benefits-section">
                    <h3>Transform Your Practice with AI4CS.in</h3>
                    <ul>
                      <li><span className="benefit-highlight">Streamline workflows</span> and reduce administrative burdens</li>
                      <li><span className="benefit-highlight">Automate tedious tasks</span> and focus on high-value services</li>
                      <li><span className="benefit-highlight">Gain valuable insights</span> and make informed decisions</li>
                      <li><span className="benefit-highlight">Enhance compliance</span> and reduce risks</li>
                      <li><span className="benefit-highlight">Stay ahead of the curve</span> with cutting-edge AI solutions</li>
                    </ul>
                  </div>
                  
                  <p>Experience the transformative power of AI and elevate your practice to new heights. Join the future of company secretarial services with AI4CS.in and discover a more efficient, accurate, and compliant way to work.</p>
                </div>
                <button 
                  className="global-button"
                  onClick={navigateToTools}
                >
                  Explore Tools
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default HomePage;
