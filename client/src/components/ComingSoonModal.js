import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/ComingSoonModal.css';

const ComingSoonModal = ({ show, handleClose, featureTitle }) => {
  // Random Unsplash image related to development/coming soon
  const unsplashImageUrl = "https://media.istockphoto.com/id/1395336482/photo/white-paper-torn-with-text-coming-soon.jpg?s=612x612&w=0&k=20&c=lwMG5eYZo9lhYyWl3AMMtU95xYn2fuHJogmOweMzt0Y=";
  
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered
      className="coming-soon-modal"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{featureTitle || 'Feature'} Coming Soon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="coming-soon-image-container">
          <img 
            src={unsplashImageUrl} 
            alt="Coming Soon" 
            className="coming-soon-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x400?text=Coming+Soon";
            }}
          />
        </div>
        <div className="coming-soon-message">
          <h3>We're working on it!</h3>
          <p>
            The {featureTitle || 'feature'} you're looking for is currently under development. 
          </p>
          <p>
            Thank you for your patience and interest in our platform.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ComingSoonModal;
