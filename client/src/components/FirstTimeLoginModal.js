import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ProgressBar } from 'react-bootstrap';
import { FaUser, FaBuilding, FaIdCard, FaMapMarkerAlt, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth';
import '../styles/theme.css';

const FirstTimeLoginModal = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    designation: '',
    companyName: '',
    companyType: 'Private Limited Company',
    cin: '',
    address: '',
  });

  useEffect(() => {
    // Check if this is first login
    if (user && user.loginCount === 1) {
      setShow(true);
      // Pre-fill any existing data
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
      }));
    }
  }, [user]);

  const handleClose = () => {
    // Only allow closing if not the first login
    if (user && user.loginCount > 1) {
      setShow(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication error');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile setup completed successfully!');
        setShow(false);
        // Force refresh to update user data
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to save profile data');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An error occurred while saving your profile');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const progress = (step / 3) * 100;

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
      style={{
        color: 'var(--text-color)'
      }}
    >
      <Modal.Header closeButton={user && user.loginCount > 1} style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <Modal.Title style={{ color: 'var(--primary-color)' }}>Welcome to AI4CS!</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'var(--card-bg)' }}>
        <ProgressBar 
          now={progress} 
          variant="primary" 
          className="mb-4" 
          style={{ height: '8px' }}
        />
        
        {step === 1 && (
          <div className="step-content">
            <h4 style={{ color: 'var(--primary-color)' }} className="mb-3">
              <FaUser className="me-2" /> Personal Information
            </h4>
            <p style={{ color: 'var(--muted-color)' }} className="mb-4">
              Let's get to know you better. This information will help us personalize your experience.
            </p>
            
            <Form.Group className="form-group">
              <Form.Label className="form-label">Your Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            
            <Form.Group className="form-group">
              <Form.Label className="form-label">Your Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., Company Secretary, Director"
                required
              />
            </Form.Group>
          </div>
        )}
        
        {step === 2 && (
          <div className="step-content">
            <h4 style={{ color: 'var(--primary-color)' }} className="mb-3">
              <FaBuilding className="me-2" /> Company Information
            </h4>
            <p style={{ color: 'var(--muted-color)' }} className="mb-4">
              Tell us about your company. This will help us customize compliance tools for your specific needs.
            </p>
            
            <Form.Group className="form-group">
              <Form.Label className="form-label">Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Company Type</Form.Label>
                  <Form.Select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="Private Limited Company">Private Limited Company</option>
                    <option value="Unlisted Public Limited">Unlisted Public Limited</option>
                    <option value="Listed Public Limited">Listed Public Limited</option>
                    <option value="LLP">LLP</option>
                    <option value="Partnership Firm">Partnership Firm</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">
                    <FaIdCard className="me-1" /> CIN/LLPIN
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Company Identification Number"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}
        
        {step === 3 && (
          <div className="step-content">
            <h4 style={{ color: 'var(--primary-color)' }} className="mb-3">
              <FaMapMarkerAlt className="me-2" /> Additional Information
            </h4>
            <p style={{ color: 'var(--muted-color)' }} className="mb-4">
              Almost done! Just a few more details to complete your profile.
            </p>
            
            <Form.Group className="form-group">
              <Form.Label className="form-label">Company Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Registered office address"
              />
            </Form.Group>
            
            <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'var(--accent-color)' }}>
              <h5 style={{ color: 'var(--text-color)' }}>How Your Information Will Be Used</h5>
              <ul style={{ color: 'var(--text-color)' }}>
                <li>Auto-fill company details in forms</li>
                <li>Customize compliance calendars for your company type</li>
                <li>Personalize legal document templates</li>
                <li>Provide relevant regulatory updates</li>
              </ul>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        {step > 1 && (
          <Button variant="outline-secondary" onClick={prevStep} disabled={loading}>
            Back
          </Button>
        )}
        <div className="ms-auto">
          {step < 3 ? (
            <Button 
              variant="primary" 
              onClick={nextStep}
              disabled={step === 1 && (!formData.username || !formData.designation) || 
                        step === 2 && !formData.companyName}
            >
              Continue
            </Button>
          ) : (
            <Button 
              variant="success" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <FaSave className="me-2" />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FirstTimeLoginModal;
