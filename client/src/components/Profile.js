import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserEdit, FaCog, FaBuilding, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../store/auth';
import '../styles/theme.css';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  
  // Default profile image if none is set
  const profileImage = user?.profileImage || '/images/default-profile.png';

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <Image 
                  src={profileImage} 
                  roundedCircle 
                  width={150} 
                  height={150} 
                  className="mb-3 profile-image"
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
              </div>
              <h2 className="card-title mb-1">{user?.username || 'User'}</h2>
              <p style={{ color: 'var(--muted-color)' }}>{user?.designation || 'Company Secretary'}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-4">
                <Button 
                  as={Link} 
                  to="/profile/settings" 
                  variant="outline-primary"
                  className="d-flex align-items-center"
                >
                  <FaUserEdit className="me-2" /> Edit Profile
                </Button>
                <Button 
                  as={Link} 
                  to="/profile/preferences" 
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                >
                  <FaCog className="me-2" /> Preferences
                </Button>
              </div>
            </div>
            
            <Row>
              <Col md={6}>
                <Card className="mb-4" style={{ backgroundColor: 'var(--accent-color)', border: 'none' }}>
                  <Card.Body>
                    <h5 style={{ color: 'var(--primary-color)' }}>Personal Information</h5>
                    <hr style={{ borderColor: 'var(--border-color)' }} />
                    
                    <div className="mb-3 d-flex align-items-center">
                      <FaEnvelope className="me-2" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--muted-color)', fontSize: '0.9rem' }}>Email</div>
                        <div>{user?.email || 'Not provided'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3 d-flex align-items-center">
                      <FaPhone className="me-2" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--muted-color)', fontSize: '0.9rem' }}>Phone</div>
                        <div>{user?.phone || 'Not provided'}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="mb-4" style={{ backgroundColor: 'var(--accent-color)', border: 'none' }}>
                  <Card.Body>
                    <h5 style={{ color: 'var(--primary-color)' }}>Company Information</h5>
                    <hr style={{ borderColor: 'var(--border-color)' }} />
                    
                    <div className="mb-3 d-flex align-items-center">
                      <FaBuilding className="me-2" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--muted-color)', fontSize: '0.9rem' }}>Company</div>
                        <div>{user?.companyName || 'Not provided'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3 d-flex align-items-center">
                      <FaIdCard className="me-2" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--muted-color)', fontSize: '0.9rem' }}>CIN/LLPIN</div>
                        <div>{user?.cin || 'Not provided'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3 d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2" style={{ color: 'var(--primary-color)' }} />
                      <div>
                        <div style={{ color: 'var(--muted-color)', fontSize: '0.9rem' }}>Address</div>
                        <div>{user?.address || 'Not provided'}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <div className="mt-2 p-3 rounded" style={{ backgroundColor: 'var(--accent-color)' }}>
              <h5 style={{ color: 'var(--text-color)' }}>Account Information</h5>
              <ul className="list-unstyled" style={{ color: 'var(--text-color)' }}>
                <li className="mb-2">• <strong>Account Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</li>
                <li className="mb-2">• <strong>Last Login:</strong> {user?.lastLoginDate ? new Date(user.lastLoginDate).toLocaleString() : 'Unknown'}</li>
                <li className="mb-2">• <strong>Login Count:</strong> {user?.loginCount || 0}</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
