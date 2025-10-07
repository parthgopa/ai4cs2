import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import { FaDownload, FaFileExcel, FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './ExportModal.css';

const ExportModal = ({ 
  show, 
  onHide, 
  activities, 
  totalCount,
  onApplyFilters 
}) => {
  const [exportFilters, setExportFilters] = useState({
    startDate: '',
    endDate: '',
    feature: '',
    includeSuccessOnly: false,
    includeFailedOnly: false
  });

  const [selectedColumns, setSelectedColumns] = useState({
    timestamp: true,
    feature: true,
    action: true,
    status: true,
    inputData: true,
    inputDetails: true,
    outputContent: true,
    outputLength: true,
    metadata: false
  });

  const [exportFormat, setExportFormat] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColumnChange = (e) => {
    const { name, checked } = e.target;
    setSelectedColumns(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const getFilteredActivities = () => {
    let filteredActivities = [];
    
    // Flatten activities from all dates
    Object.keys(activities).forEach(date => {
      filteredActivities = [...filteredActivities, ...activities[date]];
    });

    // Apply filters
    if (exportFilters.startDate) {
      const startDate = new Date(exportFilters.startDate);
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.timestamp) >= startDate
      );
    }

    if (exportFilters.endDate) {
      const endDate = new Date(exportFilters.endDate);
      endDate.setHours(23, 59, 59, 999); // Include full end date
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.timestamp) <= endDate
      );
    }

    if (exportFilters.feature) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.feature === exportFilters.feature
      );
    }

    if (exportFilters.includeSuccessOnly) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.outputData?.success === true
      );
    }

    if (exportFilters.includeFailedOnly) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.outputData?.success === false
      );
    }

    return filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatDataForExport = (activities) => {
    return activities.map((activity, index) => {
      const row = {};

      if (selectedColumns.timestamp) {
        row['Date & Time'] = new Date(activity.timestamp).toLocaleString();
        row['Date'] = new Date(activity.timestamp).toLocaleDateString();
        row['Time'] = new Date(activity.timestamp).toLocaleTimeString();
      }

      if (selectedColumns.feature) {
        row['Feature Used'] = activity.feature || 'Unknown';
      }

      if (selectedColumns.action) {
        row['Action Performed'] = activity.action || 'N/A';
      }

      if (selectedColumns.status) {
        row['Status'] = activity.outputData?.success === true ? 'Success' : 
                       activity.outputData?.success === false ? 'Failed' : 'Unknown';
      }

      if (selectedColumns.inputData && activity.inputData) {
        // Add key input fields
        if (activity.inputData.companyName) {
          row['Company Name'] = activity.inputData.companyName;
        }
        if (activity.inputData.companyType) {
          row['Company Type'] = activity.inputData.companyType;
        }
        if (activity.inputData.subject) {
          row['Subject'] = activity.inputData.subject;
        }
        if (activity.inputData.language) {
          row['Language'] = activity.inputData.language;
        }
        if (activity.inputData.tone) {
          row['Tone'] = activity.inputData.tone;
        }
        if (activity.inputData.quarterlyOptions) {
          row['Quarters Selected'] = Array.isArray(activity.inputData.quarterlyOptions) 
            ? activity.inputData.quarterlyOptions.join(', ') 
            : activity.inputData.quarterlyOptions;
        }
        if (activity.inputData.selectedRegulations) {
          row['Regulations'] = Array.isArray(activity.inputData.selectedRegulations) 
            ? activity.inputData.selectedRegulations.join(', ') 
            : activity.inputData.selectedRegulations;
        }
      }

      if (selectedColumns.inputDetails && activity.inputData) {
        // Complete input data as formatted text
        const inputDetails = [];
        Object.entries(activity.inputData).forEach(([key, value]) => {
          if (value && value !== '') {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            if (Array.isArray(value)) {
              inputDetails.push(`${formattedKey}: ${value.join(', ')}`);
            } else {
              inputDetails.push(`${formattedKey}: ${value}`);
            }
          }
        });
        row['Complete Input Details'] = inputDetails.join('\n');
      }

      if (selectedColumns.outputContent && activity.outputData) {
        if (activity.outputData.success && activity.outputData.content) {
          // Truncate very long content but keep substantial amount
          const content = activity.outputData.content;
          row['Generated Output Content'] = content.length > 5000 
            ? content.substring(0, 5000) + '\n\n[Content truncated - Full content was ' + content.length + ' characters]'
            : content;
        } else if (activity.outputData.error) {
          row['Generated Output Content'] = `ERROR: ${activity.outputData.error}`;
        } else {
          row['Generated Output Content'] = 'No content available';
        }
      }

      if (selectedColumns.outputLength && activity.outputData) {
        row['Output Length (chars)'] = activity.outputData.contentLength || 0;
        if (activity.outputData.error) {
          row['Error Message'] = activity.outputData.error;
        }
      }

      if (selectedColumns.metadata && activity.metadata) {
        if (activity.metadata.promptLength) {
          row['Prompt Length'] = activity.metadata.promptLength;
        }
        if (activity.metadata.generationTime) {
          row['Generation Time'] = new Date(activity.metadata.generationTime).toLocaleString();
        }
      }

      return row;
    });
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const filteredActivities = getFilteredActivities();
      const exportData = formatDataForExport(filteredActivities);

      if (exportData.length === 0) {
        alert('No data to export with the selected filters.');
        setIsExporting(false);
        return;
      }

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Date & Time
        { wch: 12 }, // Date
        { wch: 12 }, // Time
        { wch: 25 }, // Feature Used
        { wch: 30 }, // Action Performed
        { wch: 10 }, // Status
        { wch: 20 }, // Company Name
        { wch: 15 }, // Company Type
        { wch: 30 }, // Subject
        { wch: 10 }, // Language
        { wch: 12 }, // Tone
        { wch: 25 }, // Quarters Selected
        { wch: 30 }, // Regulations
        { wch: 50 }, // Complete Input Details
        { wch: 80 }, // Generated Output Content
        { wch: 15 }, // Output Length
        { wch: 30 }, // Error Message
        { wch: 15 }, // Prompt Length
        { wch: 20 }  // Generation Time
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Activity History');

      // Create summary sheet
      const summaryData = [
        { 'Metric': 'Total Activities Exported', 'Value': filteredActivities.length },
        { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() },
        { 'Metric': 'Date Range', 'Value': `${exportFilters.startDate || 'All'} to ${exportFilters.endDate || 'All'}` },
        { 'Metric': 'Feature Filter', 'Value': exportFilters.feature || 'All Features' },
        { 'Metric': 'Success Count', 'Value': filteredActivities.filter(a => a.outputData?.success === true).length },
        { 'Metric': 'Failed Count', 'Value': filteredActivities.filter(a => a.outputData?.success === false).length },
        { 'Metric': 'Most Used Feature', 'Value': getMostUsedFeature(filteredActivities) }
      ];

      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

      // Generate filename
      const dateRange = exportFilters.startDate && exportFilters.endDate 
        ? `_${exportFilters.startDate}_to_${exportFilters.endDate}`
        : `_${new Date().toISOString().split('T')[0]}`;
      
      const filename = `AI4CS_Activity_History${dateRange}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      // Show success message
      setTimeout(() => {
        alert(`Successfully exported ${filteredActivities.length} activities to ${filename}`);
        setIsExporting(false);
        onHide();
      }, 500);

    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data. Please try again.');
      setIsExporting(false);
    }
  };

  const getMostUsedFeature = (activities) => {
    const featureCounts = {};
    activities.forEach(activity => {
      const feature = activity.feature || 'Unknown';
      featureCounts[feature] = (featureCounts[feature] || 0) + 1;
    });
    
    let mostUsed = '';
    let maxCount = 0;
    Object.entries(featureCounts).forEach(([feature, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = feature;
      }
    });
    
    return `${mostUsed} (${maxCount} times)`;
  };

  const resetFilters = () => {
    setExportFilters({
      startDate: '',
      endDate: '',
      feature: '',
      includeSuccessOnly: false,
      includeFailedOnly: false
    });
  };

  const getUniqueFeatures = () => {
    const features = new Set();
    Object.keys(activities).forEach(date => {
      activities[date].forEach(activity => {
        if (activity.feature) {
          features.add(activity.feature);
        }
      });
    });
    return Array.from(features).sort();
  };

  const filteredCount = getFilteredActivities().length;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="export-modal-header">
        <Modal.Title>
          <FaFileExcel className="me-2 text-success" />
          Export Activity History
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="export-modal-body">
        {/* Export Summary */}
        <Alert variant="info" className="export-summary">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Total Available:</strong> {totalCount} activities
            </div>
            <div>
              <strong>Will Export:</strong> 
              <Badge bg="primary" className="ms-2">{filteredCount} activities</Badge>
            </div>
          </div>
        </Alert>

        {/* Date Range Filters */}
        <div className="filter-section">
          <h6 className="filter-title">
            <FaCalendarAlt className="me-2" />
            Date Range
          </h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={exportFilters.startDate}
                  onChange={handleFilterChange}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={exportFilters.endDate}
                  onChange={handleFilterChange}
                  className="form-control"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Feature and Status Filters */}
        <div className="filter-section">
          <h6 className="filter-title">
            <FaFilter className="me-2" />
            Content Filters
          </h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Feature</Form.Label>
                <Form.Select
                  name="feature"
                  value={exportFilters.feature}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  <option value="">All Features</option>
                  {getUniqueFeatures().map(feature => (
                    <option key={feature} value={feature}>{feature}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Status Filter</Form.Label>
                <div className="status-checkboxes">
                  <Form.Check
                    type="checkbox"
                    name="includeSuccessOnly"
                    label="Success Only"
                    checked={exportFilters.includeSuccessOnly}
                    onChange={handleFilterChange}
                    className="form-check"
                  />
                  <Form.Check
                    type="checkbox"
                    name="includeFailedOnly"
                    label="Failed Only"
                    checked={exportFilters.includeFailedOnly}
                    onChange={handleFilterChange}
                    className="form-check"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Column Selection */}
        <div className="filter-section">
          <h6 className="filter-title">
            <FaFileExcel className="me-2" />
            Export Columns
          </h6>
          <Row>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                name="timestamp"
                label="Date & Time"
                checked={selectedColumns.timestamp}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="feature"
                label="Feature Used"
                checked={selectedColumns.feature}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="action"
                label="Action Performed"
                checked={selectedColumns.action}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="status"
                label="Status"
                checked={selectedColumns.status}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                name="inputData"
                label="Basic Input Fields"
                checked={selectedColumns.inputData}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="inputDetails"
                label="Complete Input Details"
                checked={selectedColumns.inputDetails}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="outputContent"
                label="Generated Output Content"
                checked={selectedColumns.outputContent}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="outputLength"
                label="Output Length & Errors"
                checked={selectedColumns.outputLength}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
              <Form.Check
                type="checkbox"
                name="metadata"
                label="Metadata (Advanced)"
                checked={selectedColumns.metadata}
                onChange={handleColumnChange}
                className="form-check mb-2"
              />
            </Col>
          </Row>
        </div>

        {filteredCount === 0 && (
          <Alert variant="warning">
            No activities match the selected filters. Please adjust your criteria.
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer className="export-modal-footer">
        <Button 
          variant="outline-secondary" 
          onClick={resetFilters}
          className="me-auto"
        >
          <FaTimes className="me-1" />
          Reset Filters
        </Button>
        
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        
        <Button 
          variant="success" 
          onClick={exportToExcel}
          disabled={isExporting || filteredCount === 0}
        >
          {isExporting ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Exporting...
            </>
          ) : (
            <>
              <FaDownload className="me-1" />
              Export Excel ({filteredCount} items)
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
