import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
// Import icons
import { FaCalendarAlt, FaBalanceScale, FaGavel, FaChartLine, FaClipboardList, FaBuilding } from 'react-icons/fa';
import { MdUpdate, MdAssessment, MdDescription, MdMeetingRoom, MdOutlineAppRegistration, MdPeople } from 'react-icons/md';
// Import ComplianceCalendar component
import ComplianceCalendar from './ComplianceCalendar';
// Note: We'll need to import an actual image file once it's available
// import heroImage from '../../assets/images/hero-image.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  
  // List of functionalities with icons
  const functionalities = [
    {
      id: 'compliance-calendar',
      title: 'Compliance Calendar',
      icon: <FaCalendarAlt />
    },
    {
      id: 'legal-research',
      title: 'Legal Research',
      icon: <FaBalanceScale />
    },
    {
      id: 'legal-opinion',
      title: 'Legal Opinion',
      icon: <FaGavel />
    },
    {
      id: 'strategic-advice',
      title: 'Strategic Advice',
      icon: <FaChartLine />
    },
    {
      id: 'procedure-practice',
      title: 'Procedure and Practice',
      icon: <FaClipboardList />
    },
    {
      id: 'corporate-governance',
      title: 'Corporate Governance',
      icon: <FaBuilding />
    },
    {
      id: 'regulatory-updation',
      title: 'Regulatory Updation',
      icon: <MdUpdate />
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      icon: <MdAssessment />
    },
    {
      id: 'resolutions',
      title: 'Resolutions',
      icon: <MdDescription />
    },
    {
      id: 'board-meeting-management',
      title: 'Board Meeting Management',
      icon: <MdMeetingRoom />
    },
    {
      id: 'application-petition-appeal',
      title: 'Application, Petition and Appeal',
      icon: <MdOutlineAppRegistration />
    },
    {
      id: 'shareholder-communication',
      title: 'Shareholder Communication',
      icon: <MdPeople />
    }
  ];
  
  const handleFunctionalityClick = (id) => {
    console.log(`Functionality clicked: ${id}`);
    
    // Navigate based on the functionality ID
    switch(id) {
      case 'compliance-calendar':
        navigate('/compliance-calendar');
        break;
      case 'legal-research':
        navigate('/legal-research');
        break;
      case 'legal-opinion':
        navigate('/legal-opinion');
        break;
      case 'strategic-advice':
        navigate('/strategic-advice');
        break;
      case 'procedure-practice':
        navigate('/procedure-practice');
        break;
      case 'corporate-governance':
        navigate('/corporate-governance');
        break;
      case 'regulatory-updation':
        navigate('/regulatory-updation');
        break;
      case 'risk-assessment':
        navigate('/risk-assessment');
        break;
      case 'resolutions':
        navigate('/resolutions');
        break;
      case 'board-meeting-management':
        navigate('/board-meeting-management');
        break;
      case 'application-petition-appeal':
        navigate('/application-petition-appeal');
        break;
      case 'shareholder-communication':
        navigate('/shareholder-communication');
        break;
      default:
        console.log(`Unknown functionality: ${id}`);
        // Optionally navigate to a 404 or error page
        // navigate('/not-found');
    }
  };
  

  return (
    <main className="home-page">
      {/* Hero Section with Image */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} className="text-center">
              <div className="hero-image-container">
                {/* Replace the src with the actual image path once available */}
                <img 
                  src="/homelogo.jpg" 
                  alt="AI for Company Secretary" 
                  className="hero-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x400?text=AI+for+Company+Secretary";
                  }}
                />
              </div>
              <div className="hero-text">
                <h3>Empowering Company Secretary</h3>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Functionalities Section */}
      <section className="functionalities-section">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col md={10}>
              <h2 className="section-title">AI Tools for Company Secretaries</h2>
            </Col>
          </Row>
          
          <Row className="justify-content-center">
            <Col md={10}>
              <Card className="content-card">
                <Card.Body>
                  <ListGroup variant="flush" className="functionalities-list">
                    {functionalities.map((item) => (
                      <ListGroup.Item 
                        key={item.id} 
                        action 
                        onClick={() => handleFunctionalityClick(item.id)}
                        className="functionality-item"
                      >
                        <div className="functionality-content">
                          <h2 className="functionality-title">
                            <span className="functionality-icon">{item.icon}</span>
                            {item.title}
                          </h2>
                        </div>
                        <div className="functionality-arrow">→</div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>


    </main>
  );
};

export default HomePage;
