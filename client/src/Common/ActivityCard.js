import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { 
  FaEye, 
  FaCopy, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEdit, 
  FaFileAlt, 
  FaInfoCircle,
  FaTrash
} from 'react-icons/fa';
import './ActivityCard.css';

const ActivityCard = ({ 
  activity, 
  onViewDetails, 
  onCopyContent,
  onDelete,
  formatTimestamp,
  getActivityIcon 
}) => {
  if (!activity) return null;

  const renderInputDetails = () => {
    if (!activity.inputData || Object.keys(activity.inputData).length === 0) {
      return null;
    }

    return (
      <div className="activity-input-section">
        <div className="section-header">
          <FaEdit className="section-icon" />
          <span className="section-title">Input Details</span>
        </div>
        <div className="input-details-grid">
          <Row>
            {activity.inputData.companyName && (
              <Col md={6} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Company Name</span>
                  <span className="input-value">{activity.inputData.companyName}</span>
                </div>
              </Col>
            )}
            {activity.inputData.companyType && (
              <Col md={6} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Company Type</span>
                  <span className="input-value">{activity.inputData.companyType}</span>
                </div>
              </Col>
            )}
            {activity.inputData.quarterlyOptions && (
              <Col md={12} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Selected Quarters</span>
                  <div className="badge-container">
                    {activity.inputData.quarterlyOptions.map((quarter, idx) => (
                      <Badge key={idx} bg="outline-primary" className="input-badge">
                        {quarter}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Col>
            )}
            {activity.inputData.selectedRegulations && (
              <Col md={12} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Selected Regulations</span>
                  <div className="badge-container">
                    {activity.inputData.selectedRegulations.map((reg, idx) => (
                      <Badge key={idx} bg="outline-info" className="input-badge">
                        {reg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Col>
            )}
            {activity.inputData.subject && (
              <Col md={12} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Subject</span>
                  <span className="input-value">{activity.inputData.subject}</span>
                </div>
              </Col>
            )}
            {activity.inputData.language && (
              <Col md={6} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Language</span>
                  <Badge bg="secondary" className="input-badge">{activity.inputData.language}</Badge>
                </div>
              </Col>
            )}
            {activity.inputData.tone && (
              <Col md={6} className="mb-2">
                <div className="input-item">
                  <span className="input-label">Tone</span>
                  <Badge bg="secondary" className="input-badge">{activity.inputData.tone}</Badge>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    );
  };

  const renderOutputDetails = () => {
    if (!activity.outputData) return null;

    return (
      <div className="activity-output-section">
        <div className="section-header">
          <FaFileAlt className={`section-icon ${activity.outputData.success ? 'text-success' : 'text-danger'}`} />
          <span className={`section-title ${activity.outputData.success ? 'text-success' : 'text-danger'}`}>
            {activity.outputData.success ? 'Output Generated' : 'Generation Failed'}
          </span>
        </div>
        <div className={`output-container ${activity.outputData.success ? 'success' : 'error'}`}>
          {activity.outputData.success ? (
            <div>
              <Row>
                <Col md={6}>
                  <div className="output-stat">
                    <span className="stat-label">Content Length</span>
                    <span className="stat-value">{activity.outputData.contentLength || 0} characters</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="output-stat">
                    <span className="stat-label">Status</span>
                    <Badge bg="success">Successfully Generated</Badge>
                  </div>
                </Col>
              </Row>
              {activity.outputData.content && (
                <div className="content-preview-section">
                  <span className="preview-label">Content Preview</span>
                  <div className="content-preview">
                    {activity.outputData.content.substring(0, 150)}
                    {activity.outputData.content.length > 150 && '...'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="error-details">
              <span className="error-label">Error Details</span>
              <span className="error-message">{activity.outputData.error || 'Unknown error occurred'}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMetadata = () => {
    if (!activity.metadata || Object.keys(activity.metadata).length === 0) {
      return null;
    }

    return (
      <div className="activity-metadata-section">
        <div className="section-header">
          <FaInfoCircle className="section-icon text-info" />
          <span className="section-title text-info">Additional Details</span>
        </div>
        <div className="metadata-container">
          <Row>
            {activity.metadata.promptLength && (
              <Col md={6} className="mb-1">
                <div className="metadata-item">
                  <span className="metadata-label">Prompt Length:</span>
                  <span className="metadata-value">{activity.metadata.promptLength} chars</span>
                </div>
              </Col>
            )}
            {activity.metadata.generationTime && (
              <Col md={6} className="mb-1">
                <div className="metadata-item">
                  <span className="metadata-label">Generated:</span>
                  <span className="metadata-value">
                    {new Date(activity.metadata.generationTime).toLocaleTimeString()}
                  </span>
                </div>
              </Col>
            )}
            {activity.metadata.selectedQuarters && (
              <Col md={6} className="mb-1">
                <div className="metadata-item">
                  <span className="metadata-label">Quarters Selected:</span>
                  <span className="metadata-value">{activity.metadata.selectedQuarters}</span>
                </div>
              </Col>
            )}
            {activity.metadata.regulationsCount && (
              <Col md={6} className="mb-1">
                <div className="metadata-item">
                  <span className="metadata-label">Regulations:</span>
                  <span className="metadata-value">{activity.metadata.regulationsCount}</span>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    );
  };

  return (
    <Card className="activity-card">
      <Card.Body className="activity-card-body">
        <div className="activity-header">
          <div className="activity-info">
            <div className="feature-section">
              <div className="feature-icon-container">
                {getActivityIcon(activity.feature)}
              </div>
              <div className="feature-details">
                <Badge 
                  bg={activity.outputData?.success ? 'success' : activity.outputData?.success === false ? 'danger' : 'primary'} 
                  className="feature-badge"
                >
                  {activity.feature}
                </Badge>
                <div className="activity-meta">
                  <span className="activity-time">
                    <FaClock className="time-icon" />
                    {formatTimestamp(activity.timestamp)}
                  </span>
                  {activity.outputData?.success && (
                    <Badge bg="success" className="status-badge">
                      <FaCheckCircle className="status-icon" />
                      Success
                    </Badge>
                  )}
                  {activity.outputData?.success === false && (
                    <Badge bg="danger" className="status-badge">
                      <FaTimesCircle className="status-icon" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <h6 className="activity-action">{activity.action}</h6>
          </div>
          
          <div className="activity-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onViewDetails(activity)}
              className="action-button"
              title="View details"
            >
              <FaEye className="button-icon" />
            </Button>
            {activity.outputData?.success && activity.outputData?.content && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => onCopyContent(activity.outputData.content)}
                className="action-button"
                title="Copy output"
              >
                <FaCopy className="button-icon" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(activity._id || activity.id)}
                className="action-button"
                title="Delete this activity"
              >
                <FaTrash className="button-icon" />
              </Button>
            )}
          </div>
        </div>

        <div className="activity-content">
          {renderInputDetails()}
          {renderOutputDetails()}
          {renderMetadata()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ActivityCard;
