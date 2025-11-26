import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { FaCamera, FaSave, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth';
import '../styles/theme.css';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    companyName: '',
    designation: '',
    companyType: 'Private Limited Company',
    cin: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        designation: user.designation || '',
        companyType: user.companyType || 'Private Limited Company',
        cin: user.cin || '',
        address: user.address || '',
      });
      
      // Set profile image if exists
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 1MB for base64)
      if (file.size > 1024 * 1024) {
        toast.error('Image size should be less than 1MB');
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String); // Store the base64 string directly
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to update your profile');
        setLoading(false);
        return;
      }

      // Create data object to send as JSON
      const dataToSend = {
        ...formData
      };
      
      // Add base64 image if selected
      if (profileImage) {
        console.log('Sending profile image, length:', profileImage.length);
        dataToSend.profileImage = profileImage;
      } else {
        console.log('No new profile image selected');
        // If user already has a profile image and hasn't selected a new one, keep the existing one
        if (imagePreview && imagePreview !== '/images/default-profile.png') {
          console.log('Using existing profile image');
          dataToSend.profileImage = imagePreview;
        }
      }

      console.log('Sending profile data to server');
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully');
        // Force refresh user data
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Profile Settings</h2>
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <Image 
                    src={imagePreview || '/images/default-profile.png'} 
                    roundedCircle 
                    width={150} 
                    height={150} 
                    className="mb-3"
                    style={{ 
                      objectFit: 'cover',
                      border: '3px solid var(--primary-color)',
                      filter: 'var(--image-filter)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-profile.png';
                    }}
                  />
                  <div 
                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                    style={{ cursor: 'pointer' }}
                  >
                    <label htmlFor="profile-image" style={{ cursor: 'pointer', margin: 0 }}>
                      <FaCamera color="white" />
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Email cannot be changed
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label className="form-label">Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g., Company Secretary, Director"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="form-group">
                <Form.Label className="form-label">Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Your company name"
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
                    <Form.Label className="form-label">CIN/LLPIN</Form.Label>
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

              <Form.Group className="form-group">
                <Form.Label className="form-label">Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Company address"
                />
              </Form.Group>

              <Button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Save Changes
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

export default ProfileSettings;
