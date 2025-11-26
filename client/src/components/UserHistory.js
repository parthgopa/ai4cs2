import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, Modal, Badge, Alert } from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaEye, 
  FaCopy, 
  FaTrash, 
  FaSearch, 
  FaTimes,
  FaDownload,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaFileAlt,
  FaInfoCircle
} from 'react-icons/fa';
import { useActivityTracker } from '../store/activityTracker';
import ReactMarkdown from 'react-markdown';
import LoadingSpinner from '../Common/LoadingSpinner';
import ActivityCard from '../Common/ActivityCard';
import ExportModal from '../Common/ExportModal';

const UserHistory = () => {
  const { getActivityHistory, clearAllHistory, deleteActivity } = useActivityTracker();
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    feature: '',
    searchTerm: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [stats, setStats] = useState({
    totalActivities: 0,
    featuresUsed: 0,
    activeDays: 0,
    mostUsedFeature: '',
    featureStats: [],
    dailyStats: [],
    period: 30
  });

  useEffect(() => {
    loadActivities();
    loadActivityStats();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      console.log('Loading activities with filters:', filters);
      const response = await getActivityHistory(filters);
      console.log('Activity response:', response);
      
      // Add a 2.5 second delay for better UX with new loading spinner
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      if (response && response.data && response.data.activities) {
        console.log('Activities found:', response.data.activities.length);
        // Group activities by date
        const groupedActivities = groupActivitiesByDate(response.data.activities);
        console.log('Grouped activities:', groupedActivities);
        setActivities(groupedActivities);
        setTotalCount(response.data.totalCount || response.data.activities.length);
        setHasMore(response.data.hasMore || false);
        calculateStats(response.data.activities);
      } else {
        console.log('No activities data in response');
        setActivities({});
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities({});
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityHistory = loadActivities;

  const groupActivitiesByDate = (activitiesArray) => {
    const grouped = {};
    activitiesArray.forEach(activity => {
      const date = new Date(activity.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    return grouped;
  };

  const loadActivityStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Merge with safe defaults so UI never breaks on missing fields
        setStats(prev => ({
          ...prev,
          ...data.data,
          featureStats: Array.isArray(data.data?.featureStats) ? data.data.featureStats : (prev.featureStats || []),
          dailyStats: Array.isArray(data.data?.dailyStats) ? data.data.dailyStats : (prev.dailyStats || []),
          period: typeof data.data?.period === 'number' ? data.data.period : (prev.period ?? 30),
          totalActivities: typeof data.data?.totalActivities === 'number' ? data.data.totalActivities : (prev.totalActivities || 0),
          featuresUsed: typeof data.data?.featuresUsed === 'number' ? data.data.featuresUsed : (prev.featuresUsed || 0),
          activeDays: typeof data.data?.activeDays === 'number' ? data.data.activeDays : (prev.activeDays || 0),
          mostUsedFeature: data.data?.mostUsedFeature || prev.mostUsedFeature || ''
        }));
      }
    } catch (error) {
      console.error('Error loading activity stats:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      feature: '',
      limit: 50
    });
    loadActivities();
  };

  const applyFilters = () => {
    loadActivities();
  };

  const handleClearAllHistory = async () => {
    const success = await clearAllHistory();
    if (success) {
      setActivities({});
      setTotalCount(0);
      setShowClearModal(false);
      loadActivityStats();
    }
  };

  const viewActivity = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getActivityIcon = (feature) => {
    const icons = {
      'Compliance Calendar': '📅',
      'Secretarial Audit': '🔍',
      'Regulatory Updation': '📰',
      'CSR Policy': '📋',
      'Board Meeting Assistant': '🏢',
      'General Meeting Assistant': '👥',
      'Document Management Policy': '📄',
      'Insider Trading Policy': '📊',
      'Meeting Minutes Policy': '📝',
      'Related Party Transaction Policy': '🤝',
      'Statutory Register Maintenance Policy': '📚',
      'Reply to Notice RD': '📨',
      'Reply to Notice ROC': '📧',
      'Reply to Notice NCLT': '⚖️',
      'Email Drafter': '✉️',
      'Research Assistant': '🔬',
      'Resolution Assistant': '📜',
      'Agreement Drafting': '📑'
    };
    return icons[feature] || '📄';
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const calculateStats = (activitiesArray) => {
    if (!Array.isArray(activitiesArray)) {
      setStats(prev => ({ ...prev }));
      return;
    }

    const featureCounts = {};
    const daySet = new Set();

    activitiesArray.forEach(activity => {
      const feature = activity.feature || 'Unknown';
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      daySet.add(new Date(activity.timestamp).toDateString());
    });

    const features = Object.keys(featureCounts);
    const dates = Array.from(daySet);

    const featureStats = features
      .map(name => ({ name, count: featureCounts[name] }))
      .sort((a, b) => b.count - a.count);

    const mostUsed = featureStats.length > 0 ? featureStats[0].name : '';

    setStats(prev => ({
      ...prev,
      totalActivities: activitiesArray.length,
      featuresUsed: features.length,
      activeDays: dates.length,
      mostUsedFeature: mostUsed,
      featureStats,
      dailyStats: dates
    }));
  };

  return (
    <>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="page-title">📊 User Activity History</h1>
                {stats && (
                  <p style={{ color: 'var(--muted-color)' }}>
                    {stats.totalActivities} activities in the last {stats.period} days
                  </p>
                )}
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="me-1" />
                  Filters
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={handleExportClick}
                  disabled={Object.keys(activities).length === 0}
                >
                  <FaDownload className="me-1" />
                  Export Excel
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowClearModal(true)}
                  disabled={Object.keys(activities).length === 0}
                >
                  <FaTrash className="me-1" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                    <Card.Body>
                      <h5 style={{ color: 'var(--primary-color)' }}>{stats.totalActivities}</h5>
                      <small style={{ color: 'var(--text-color)' }}>Total Activities</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                    <Card.Body>
                      <h5 style={{ color: 'var(--primary-color)' }}>{stats.featureStats.length}</h5>
                      <small style={{ color: 'var(--text-color)' }}>Features Used</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                    <Card.Body>
                      <h5 style={{ color: 'var(--primary-color)' }}>{stats.dailyStats.length}</h5>
                      <small style={{ color: 'var(--text-color)' }}>Active Days</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                    <Card.Body>
                      <h5 style={{ color: 'var(--primary-color)' }}>
                        {stats.featureStats[0]?.count || 0}
                      </h5>
                      <small style={{ color: 'var(--text-color)' }}>Most Used Feature</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Filters */}
            {showFilters && (
              <Card className="mb-4" style={{ backgroundColor: 'var(--accent-color)' }}>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="form-label">Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={filters.startDate}
                          onChange={handleFilterChange}
                          className="form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="form-label">End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={filters.endDate}
                          onChange={handleFilterChange}
                          className="form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="form-label">Feature</Form.Label>
                        <Form.Select
                          name="feature"
                          value={filters.feature}
                          onChange={handleFilterChange}
                          className="form-select"
                        >
                          <option value="">All Features</option>
                          <option value="Compliance Calendar">Compliance Calendar</option>
                          <option value="Secretarial Audit">Secretarial Audit</option>
                          <option value="Regulatory Updation">Regulatory Updation</option>
                          <option value="CSR Policy">CSR Policy</option>
                          <option value="Document Management Policy">Document Management Policy</option>
                          <option value="Insider Trading Policy">Insider Trading Policy</option>
                          <option value="Meeting Minutes Policy">Meeting Minutes Policy</option>
                          <option value="Related Party Transaction Policy">Related Party Transaction Policy</option>
                          <option value="Statutory Register Maintenance Policy">Statutory Register Maintenance Policy</option>
                          <option value="Board Meeting Assistant">Board Meeting Assistant</option>
                          <option value="General Meeting Assistant">General Meeting Assistant</option>
                          <option value="Reply to Notice RD">Reply to Notice RD</option>
                          <option value="Reply to Notice ROC">Reply to Notice ROC</option>
                          <option value="Reply to Notice NCLT">Reply to Notice NCLT</option>
                          <option value="Email Drafter">Email Drafter</option>
                          <option value="Research Assistant">Research Assistant</option>
                          <option value="Resolution Assistant">Resolution Assistant</option>
                          <option value="Agreement Drafting">Agreement Drafting</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end gap-2">
                      <Button
                        variant="primary"
                        onClick={applyFilters}
                        className="flex-fill"
                      >
                        <FaSearch className="me-1" />
                        Apply
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={resetFilters}
                        className="flex-fill"
                      >
                        <FaTimes className="me-1" />
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Activity List */}
            {loading ? (
              <LoadingSpinner 
                size={80}
                message="📊 Loading Your Work History"
                subMessage="Fetching your detailed activity records and analyzing usage patterns..."
                showDots={true}
              />
            ) : Object.keys(activities).length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaSearch className="mb-2" size={24} />
                <p className="mb-0">No activities found. Start using our features to see your history here!</p>
              </Alert>
            ) : (
              <div className="activity-timeline">
                {Object.keys(activities)
                  .sort((a, b) => new Date(b) - new Date(a))
                  .map(date => (
                    <div key={date} className="mb-4">
                      <div className="date-header sticky-top bg-white py-2 mb-3">
                        <h5 className="mb-0 text-primary">
                          <FaCalendarAlt className="me-2" />
                          {date}
                        </h5>
                        <hr className="mt-2" />
                      </div>
                      {activities[date]
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map((activity, index) => (
                          <ActivityCard
                            key={activity._id}
                            activity={activity}
                            onViewDetails={viewActivity}
                            onCopyContent={copyToClipboard}
                            formatTimestamp={formatTimestamp}
                            getActivityIcon={getActivityIcon}
                          />
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center mt-4">
              <p style={{ color: 'var(--muted-color)' }}>
                Showing {Object.values(activities).flat().length} of {totalCount} activities
              </p>
              {hasMore && (
                <Button
                  variant="outline-primary"
                  onClick={() => setFilters(prev => ({ ...prev, limit: prev.limit + 50 }))}
                >
                  Load More
                </Button>
              )}
            </div>
          </Col>
        </Row>

      {/* Activity Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="me-2">{selectedActivity && getActivityIcon(selectedActivity.feature)}</span>
            {selectedActivity?.feature} - Activity Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedActivity && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-primary text-white">
                      <strong>📝 Input Information</strong>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-2">
                        <strong>Action:</strong> <Badge bg="success">{selectedActivity.action}</Badge>
                      </div>
                      <div className="mb-2">
                        <strong>Timestamp:</strong> {new Date(selectedActivity.timestamp).toLocaleString()}
                      </div>
                      {selectedActivity.inputData && Object.keys(selectedActivity.inputData).length > 0 && (
                        <div>
                          <strong>Input Details:</strong>
                          <div className="bg-light p-3 rounded mt-2">
                            {Object.entries(selectedActivity.inputData).map(([key, value]) => (
                              <div key={key} className="mb-1">
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-success text-white">
                      <strong>✅ Output Information</strong>
                    </Card.Header>
                    <Card.Body>
                      {selectedActivity.outputData && selectedActivity.outputData.success ? (
                        <div>
                          <div className="mb-2">
                            <Badge bg="success">Generation Successful</Badge>
                          </div>
                          <div className="mb-2">
                            <strong>Content Length:</strong> {selectedActivity.outputData.contentLength || 0} characters
                          </div>
                          {selectedActivity.outputData.content && (
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong>Generated Content:</strong>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => copyToClipboard(selectedActivity.outputData.content)}
                                >
                                  <FaCopy className="me-1" /> Copy
                                </Button>
                              </div>
                              <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <ReactMarkdown>{selectedActivity.outputData.content}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Badge bg="danger">Generation Failed</Badge>
                          {selectedActivity.outputData?.error && (
                            <div className="mt-2">
                              <strong>Error:</strong> {selectedActivity.outputData.error}
                            </div>
                          )}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <Card>
                  <Card.Header>
                    <strong>📊 Additional Metadata</strong>
                  </Card.Header>
                  <Card.Body>
                    <div className="bg-light p-3 rounded">
                      {Object.entries(selectedActivity.metadata).map(([key, value]) => (
                        <div key={key} className="mb-1">
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedActivity?.outputData?.content && (
            <Button
              variant="primary"
              onClick={() => copyToClipboard(selectedActivity.outputData.content)}
            >
              <FaCopy className="me-1" /> Copy Full Content
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}>
          <Modal.Title>Confirm Clear All History</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}>
          <Alert variant="warning">
            <strong>Warning!</strong> This action will permanently delete all your activity history.
            This cannot be undone.
          </Alert>
          <p>Are you sure you want to clear all activity history?</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'var(--card-bg)' }}>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearAllHistory}>
            Clear All History
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Export Modal */}
      <ExportModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        activities={activities}
        totalCount={totalCount}
        onApplyFilters={loadActivities}
      />
      </Container>
    </>
  );
};

export default UserHistory;
