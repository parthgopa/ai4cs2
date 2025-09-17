import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaSave, FaSpinner, FaBuilding, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth';
import '../styles/theme.css';
import '../styles/Profile.css';

const ProfilePreferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    defaultCompanyName: '',
    defaultCompanyType: 'Private Limited Company',
    defaultCIN: '',
    autoFillForms: true,
    defaultQuarters: [],
    darkModePreference: 'system', // system, light, dark
  });

  useEffect(() => {
    if (user) {
      // Load preferences from user data if available
      setPreferences({
        defaultCompanyName: user.companyName || '',
        defaultCompanyType: user.companyType || 'Private Limited Company',
        defaultCIN: user.cin || '',
        autoFillForms: user.preferences?.autoFillForms !== undefined ? user.preferences.autoFillForms : true,
        defaultQuarters: user.preferences?.defaultQuarters || [],
        darkModePreference: user.preferences?.darkModePreference || 'system',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: checked
    });
  };

  const handleQuarterlyCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setPreferences({
        ...preferences,
        defaultQuarters: [...preferences.defaultQuarters, value],
      });
    } else {
      setPreferences({
        ...preferences,
        defaultQuarters: preferences.defaultQuarters.filter(item => item !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to update your preferences');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/update-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          preferences: {
            autoFillForms: preferences.autoFillForms,
            defaultQuarters: preferences.defaultQuarters,
            darkModePreference: preferences.darkModePreference
          },
          companyName: preferences.defaultCompanyName,
          companyType: preferences.defaultCompanyType,
          cin: preferences.defaultCIN
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Preferences updated successfully');
        // Reload the page after successful update to reflect changes across the app
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Small delay to show the success message
      } else {
        toast.error(data.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('An error occurred while updating your preferences');
    } finally {
      setLoading(false);
    }
  };

  // Get current year for quarterly options
  const date = new Date();
  const year = date.getFullYear();
  const nextYear = year + 1;

  const quarterlyOptions = [
    { value: `Q1 (April to June) -${year}`, label: `Q1 (April to June) -${year}` },
    { value: `Q2 (July to September) -${year}`, label: `Q2 (July to September) -${year}` },
    { value: `Q3 (October to December) -${year}`, label: `Q3 (October to December) -${year}` },
    { value: `Q4 (January to March) -${nextYear}`, label: `Q4 (January to March) -${nextYear}` },
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Your Preferences</h2>
            <p className="text-center mb-4" style={{ color: 'var(--muted-color)' }}>
              Customize your experience and set default values for forms
            </p>
            
            <Form onSubmit={handleSubmit}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                <FaBuilding className="me-2" /> Company Defaults
              </h4>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Default Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="defaultCompanyName"
                      value={preferences.defaultCompanyName}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Your company name"
                    />
                    <Form.Text style={{ color: 'var(--muted-color)' }}>
                      This will be auto-filled in all forms
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Default Company Type</Form.Label>
                    <Form.Select
                      name="defaultCompanyType"
                      value={preferences.defaultCompanyType}
                      onChange={handleInputChange}
                      className="form-select"
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
                    <Form.Label className="form-label">Default CIN/LLPIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="defaultCIN"
                      value={preferences.defaultCIN}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Company Identification Number"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />
              
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                <FaFileAlt className="me-2" /> Form Preferences
              </h4>
              
              <Form.Group className="form-group">
                <Form.Check
                  type="checkbox"
                  id="autoFillForms"
                  label="Auto-fill forms with my company information"
                  name="autoFillForms"
                  checked={preferences.autoFillForms}
                  onChange={handleCheckboxChange}
                  className="form-check mb-3"
                />
                <Form.Text style={{ color: 'var(--muted-color)' }}>
                  When enabled, your company details will be automatically filled in all forms
                </Form.Text>
              </Form.Group>
              
              <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />
              
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
                <FaCalendarAlt className="me-2" /> Compliance Calendar Defaults
              </h4>
              
              <Form.Group className="form-group">
                <Form.Label className="form-label">Default Quarters for Compliance Calendar</Form.Label>
                <div>
                  {quarterlyOptions.map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      id={`quarterly-preference-${option.value}`}
                      label={option.label}
                      value={option.value}
                      checked={preferences.defaultQuarters.includes(option.value)}
                      onChange={handleQuarterlyCheckboxChange}
                      className="form-check"
                    />
                  ))}
                </div>
                <Form.Text style={{ color: 'var(--muted-color)' }}>
                  These quarters will be pre-selected in the Compliance Calendar tool
                </Form.Text>
              </Form.Group>
              
              <Button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePreferences;
