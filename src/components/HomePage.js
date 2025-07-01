import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
// Import icons
import { FaCalendarAlt, FaBalanceScale, FaGavel, FaChartLine, FaClipboardList, FaBuilding } from 'react-icons/fa';
import { MdUpdate, MdAssessment, MdDescription, MdMeetingRoom, MdOutlineAppRegistration, MdPeople } from 'react-icons/md';
// Import Chatbot component
import Chatbot from './Chatbot';
// Import ComingSoonModal component
import ComingSoonModal from './ComingSoonModal';

const HomePage = () => {
  const navigate = useNavigate();
  
  // State for chatbot visibility
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // State for ComingSoonModal
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  
  // Function to toggle chatbot visibility
  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);
  
  // Function to open modal with feature title
  const openComingSoonModal = (featureTitle) => {
    setSelectedFeature(featureTitle);
    setShowModal(true);
  };
  
  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // List of functionalities with icons
  const functionalities = [
    {
      id: 'compliance-calendar',
      title: 'Compliance Calendar',
      icon: <FaCalendarAlt />
    },
    {
      id: 'corporate-governance',
      title: 'Corporate Governance',
      icon: <FaBuilding />
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
  
  const handleFunctionalityClick = (id, title) => {
    
    // Navigate to specific pages for implemented features, show modal for others
    if (id === 'compliance-calendar') {
      navigate('/compliance-calendar');
    } else if (id === 'corporate-governance') {
      navigate('/corporate-governance');
    } else {
      openComingSoonModal(title);
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
                        onClick={() => handleFunctionalityClick(item.id, item.title)}
                        className={`functionality-item ${(item.id !== 'compliance-calendar' && item.id !== 'corporate-governance') ? 'disabled-feature' : ''}`}
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

      {/* Chatbot Toggle Button */}
      <Button 
        className="chatbot-toggle"
        onClick={toggleChatbot}
        aria-label="Toggle AI Assistant"
      >
        <img 
          src="/images/chatbot.jpg" 
          alt="AI Assistant"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/35x35?text=AI";
          }}
        />
      </Button>

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
      
      {/* Coming Soon Modal */}
      <ComingSoonModal 
        show={showModal} 
        handleClose={closeModal} 
        featureTitle={selectedFeature} 
      />
    </main>
  );
};

export default HomePage;
