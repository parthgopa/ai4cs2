import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const ReplyToNoticeRD = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedNoticeType, setSelectedNoticeType] = useState('');

  // Form data for different notice types
  const [formData, setFormData] = useState({
    // Common fields
    companyName: '',
    cin: '',
    rdNoticeDate: '',
    
    // Registered Office Shift (Rule 28)
    presentStateAddress: '',
    proposedNewStateAddress: '',
    reasonForShift: '',
    boardResolutionDate: '',
    specialResolutionDate: '',
    mgt14FilingDate: '',
    inc23FilingDate: '',
    publicAdvertisementDate: '',
    creditorsNOC: '',
    rdHearingDate: '',
    objectionRaised: '',
    objectionDetails: '',
    
    // Compounding of Offence (Section 441)
    relevantSectionViolated: '',
    natureOfDefault: '',
    dateOfOffence: '',
    dateOfRectification: '',
    isFirstOffence: '',
    statutoryFilingDelay: '',
    proposedCompoundingAmount: '',
    compoundingBoardResolutionDate: '',
    compoundingApplicationFilingDate: '',
    
    // Conversion Public to Private Company (Section 14)
    presentStatus: 'Public',
    proposedStatus: 'Private',
    reasonForConversion: '',
    conversionBoardResolutionDate: '',
    conversionSpecialResolutionDate: '',
    conversionMgt14FilingDate: '',
    membersDirectorsCount: '',
    creditorsConsent: '',
    proofOfAdvertisement: '',
    conversionHearingDate: '',
    conversionObjectionRaised: '',
    authorizedSignatoryName: '',
    authorizedSignatoryDesignation: '',
    
    // Condonation of Delay (Section 460)
    formName: '',
    dueDate: '',
    actualFilingDate: '',
    reasonForDelay: '',
    condonationBoardResolutionDate: '',
    natureOfEvent: '',
    isRecurringDelay: '',
    condonationApplicationFilingDate: '',
    condonationAuthorizedSignatoryName: '',
    condonationAuthorizedSignatoryDesignation: '',
    
    // Change of Company Name (Section 13)
    existingName: '',
    proposedNewName: '',
    reasonForNameChange: '',
    nameChangeBoardResolutionDate: '',
    nameChangeSpecialResolutionDate: '',
    nameChangeMgt14FilingDate: '',
    srnNameApproval: '',
    nameChangeObjectionsRaised: '',
    nameChangeAuthorizedSignatoryName: '',
    nameChangeAuthorizedSignatoryDesignation: ''
  });

  const noticeTypes = [
    { id: 'registered-office-shift', title: 'Registered Office Shift (Rule 28)' },
    { id: 'compounding-offence', title: 'Compounding of Offence (Section 441)' },
    { id: 'conversion-public-private', title: 'Conversion Public to Private Company (Section 14)' },
    { id: 'condonation-delay', title: 'Condonation of Delay (Section 460)' },
    { id: 'change-company-name', title: 'Change of Company Name (Section 13)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNoticeTypeChange = (e) => {
    setSelectedNoticeType(e.target.value);
    setResponse(''); // Clear previous response when changing notice type
  };

  const generatePrompt = () => {
    const basePrompt = `You are a legal drafting assistant specialized in Indian Company Law.

Prepare a formal reply letter addressed to the Regional Director (RD), Ministry of Corporate Affairs, in response to a notice received under the Companies Act, 2013.

The tone must be professional, respectful, and legally accurate. The draft should:

Be formatted like an official correspondence

Include relevant references to Sections, Rules, or Regulations under the Companies Act, 2013 or corresponding MCA Rules

Address the issue(s) mentioned in the RD notice

Provide factual and procedural details in an organized manner

Mention resolutions passed, filings made, and clarify objections, if any

Be written from the company's perspective and conclude with a suitable prayer/request.

The company name and CIN , address,etc must be in bold format in the letter.

Then inputs as below::`;

    let specificInputs = '';

    switch (selectedNoticeType) {
      case 'registered-office-shift':
        specificInputs = `
Company Name: ${formData.companyName}
CIN: ${formData.cin}
Present State & Address: ${formData.presentStateAddress}
Proposed New State & Address: ${formData.proposedNewStateAddress}
Reason for Shift: ${formData.reasonForShift}
Date of Board Resolution: ${formData.boardResolutionDate}
Date of Special Resolution: ${formData.specialResolutionDate}
Date of MGT-14 Filing: ${formData.mgt14FilingDate}
Date of INC-23 Filing: ${formData.inc23FilingDate}
Date of Public Advertisement (in 2 newspapers): ${formData.publicAdvertisementDate}
Copy of Creditors' NOC: ${formData.creditorsNOC}
Date of RD Hearing (if any): ${formData.rdHearingDate}
RD Notice Date: ${formData.rdNoticeDate}
Objection Raised: ${formData.objectionRaised}${formData.objectionDetails ? ` - ${formData.objectionDetails}` : ''}`;
        break;

      case 'compounding-offence':
        specificInputs = `
Company Name: ${formData.companyName}
CIN: ${formData.cin}
Relevant Section Violated: ${formData.relevantSectionViolated}
Nature of Default: ${formData.natureOfDefault}
Date of Offence: ${formData.dateOfOffence}
Date of Rectification (if done): ${formData.dateOfRectification}
Is it First Offence?: ${formData.isFirstOffence}
Details of Statutory Filing Delay: ${formData.statutoryFilingDelay}
Proposed Amount for Compounding (if any): ${formData.proposedCompoundingAmount}
Date of Board Resolution (if any): ${formData.compoundingBoardResolutionDate}
Date of Filing Compounding Application: ${formData.compoundingApplicationFilingDate}
RD Notice Date: ${formData.rdNoticeDate}`;
        break;

      case 'conversion-public-private':
        specificInputs = `
Company Name: ${formData.companyName}
CIN: ${formData.cin}
Present Status: ${formData.presentStatus}
Proposed Status: ${formData.proposedStatus}
Reason for Conversion: ${formData.reasonForConversion}
Date of Board Resolution: ${formData.conversionBoardResolutionDate}
Date of Special Resolution: ${formData.conversionSpecialResolutionDate}
Date of MGT-14 Filing: ${formData.conversionMgt14FilingDate}
No. of Members & Directors at time of application: ${formData.membersDirectorsCount}
Consent/NOC from Creditors: ${formData.creditorsConsent}
Proof of Advertisement: ${formData.proofOfAdvertisement}
RD Notice Date: ${formData.rdNoticeDate}
Hearing Date (if any): ${formData.conversionHearingDate}
Objection Raised (if any): ${formData.conversionObjectionRaised}
Authorized Signatory Name & Designation: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}`;
        break;

      case 'condonation-delay':
        specificInputs = `
Company Name: ${formData.companyName}
CIN: ${formData.cin}
Form Name: ${formData.formName}
Due Date of Filing: ${formData.dueDate}
Actual Date of Filing: ${formData.actualFilingDate}
Reason for Delay: ${formData.reasonForDelay}
Date of Board Resolution: ${formData.condonationBoardResolutionDate}
Nature of Event: ${formData.natureOfEvent}
Is it recurring delay?: ${formData.isRecurringDelay}
Condonation Application Filing Date: ${formData.condonationApplicationFilingDate}
RD Notice Date: ${formData.rdNoticeDate}
Authorized Signatory Name & Designation: ${formData.condonationAuthorizedSignatoryName} - ${formData.condonationAuthorizedSignatoryDesignation}`;
        break;

      case 'change-company-name':
        specificInputs = `
Company Name: ${formData.companyName}
CIN: ${formData.cin}
Existing Name: ${formData.existingName}
Proposed New Name: ${formData.proposedNewName}
Reason for Name Change: ${formData.reasonForNameChange}
Date of Board Resolution: ${formData.nameChangeBoardResolutionDate}
Date of Special Resolution: ${formData.nameChangeSpecialResolutionDate}
Date of MGT-14 Filing: ${formData.nameChangeMgt14FilingDate}
SRN of Name Approval (RUN or SPICe+): ${formData.srnNameApproval}
Date of RD Notice: ${formData.rdNoticeDate}
Objections raised (if any): ${formData.nameChangeObjectionsRaised}
Authorized Signatory Name & Designation: ${formData.nameChangeAuthorizedSignatoryName} - ${formData.nameChangeAuthorizedSignatoryDesignation}`;
        break;

      default:
        return '';
    }

    return basePrompt + specificInputs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNoticeType) {
      alert('Please select a notice type first.');
      return;
    }

    setLoading(true);
    setResponse('');

    const prompt = generatePrompt();

    try {
      await APIService({
        question: prompt,
        onResponse: (data) => {
          setLoading(false);
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            setResponse(data.candidates[0].content.parts[0].text);
          } else {
            setResponse('Sorry, we couldn\'t generate a response. Please try again.');
          }
        }
      });
    } catch (error) {
      setLoading(false);
      setResponse('An error occurred while processing your request. Please try again.');
    }
  };

  const renderCommonFields = () => (
    <>
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

      <Form.Group className="form-group">
        <Form.Label className="form-label">CIN</Form.Label>
        <Form.Control
          type="text"
          name="cin"
          value={formData.cin}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label className="form-label">RD Notice Date</Form.Label>
        <Form.Control
          type="date"
          name="rdNoticeDate"
          value={formData.rdNoticeDate}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </Form.Group>
    </>
  );

  const renderFormFields = () => {
    if (!selectedNoticeType) return null;

    return (
      <>
        {renderCommonFields()}
        {selectedNoticeType === 'registered-office-shift' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Present State & Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="presentStateAddress"
                value={formData.presentStateAddress}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Proposed New State & Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="proposedNewStateAddress"
                value={formData.proposedNewStateAddress}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Shift</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForShift"
                value={formData.reasonForShift}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Board Resolution</Form.Label>
                  <Form.Control
                    type="date"
                    name="boardResolutionDate"
                    value={formData.boardResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Special Resolution</Form.Label>
                  <Form.Control
                    type="date"
                    name="specialResolutionDate"
                    value={formData.specialResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of MGT-14 Filing</Form.Label>
                  <Form.Control
                    type="date"
                    name="mgt14FilingDate"
                    value={formData.mgt14FilingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of INC-23 Filing</Form.Label>
                  <Form.Control
                    type="date"
                    name="inc23FilingDate"
                    value={formData.inc23FilingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date of Public Advertisement</Form.Label>
              <Form.Control
                type="date"
                name="publicAdvertisementDate"
                value={formData.publicAdvertisementDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Copy of Creditors' NOC</Form.Label>
                  <Form.Select
                    name="creditorsNOC"
                    value={formData.creditorsNOC}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of RD Hearing (if any)</Form.Label>
                  <Form.Control
                    type="date"
                    name="rdHearingDate"
                    value={formData.rdHearingDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Objection Raised</Form.Label>
              <Form.Select
                name="objectionRaised"
                value={formData.objectionRaised}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
            {formData.objectionRaised === 'Yes' && (
              <Form.Group className="form-group">
                <Form.Label className="form-label">Objection Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="objectionDetails"
                  value={formData.objectionDetails}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </Form.Group>
            )}
          </>
        )}
        
        {selectedNoticeType === 'compounding-offence' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Relevant Section Violated</Form.Label>
              <Form.Control
                type="text"
                name="relevantSectionViolated"
                value={formData.relevantSectionViolated}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Nature of Default</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="natureOfDefault"
                value={formData.natureOfDefault}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Offence</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfOffence"
                    value={formData.dateOfOffence}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Rectification (if done)</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfRectification"
                    value={formData.dateOfRectification}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Is it First Offence?</Form.Label>
              <Form.Select
                name="isFirstOffence"
                value={formData.isFirstOffence}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Details of Statutory Filing Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="statutoryFilingDelay"
                value={formData.statutoryFilingDelay}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Form name, Due Date, Actual Date"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Proposed Amount for Compounding (if any)</Form.Label>
              <Form.Control
                type="text"
                name="proposedCompoundingAmount"
                value={formData.proposedCompoundingAmount}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Board Resolution (if any)</Form.Label>
                  <Form.Control
                    type="date"
                    name="compoundingBoardResolutionDate"
                    value={formData.compoundingBoardResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Filing Compounding Application</Form.Label>
                  <Form.Control
                    type="date"
                    name="compoundingApplicationFilingDate"
                    value={formData.compoundingApplicationFilingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
        
        {selectedNoticeType === 'conversion-public-private' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Present Status</Form.Label>
                  <Form.Control
                    type="text"
                    name="presentStatus"
                    value={formData.presentStatus}
                    onChange={handleInputChange}
                    className="form-control"
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Proposed Status</Form.Label>
                  <Form.Control
                    type="text"
                    name="proposedStatus"
                    value={formData.proposedStatus}
                    onChange={handleInputChange}
                    className="form-control"
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Conversion</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForConversion"
                value={formData.reasonForConversion}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Board Resolution</Form.Label>
                  <Form.Control
                    type="date"
                    name="conversionBoardResolutionDate"
                    value={formData.conversionBoardResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Special Resolution</Form.Label>
                  <Form.Control
                    type="date"
                    name="conversionSpecialResolutionDate"
                    value={formData.conversionSpecialResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date of MGT-14 Filing</Form.Label>
              <Form.Control
                type="date"
                name="conversionMgt14FilingDate"
                value={formData.conversionMgt14FilingDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">No. of Members & Directors at time of application</Form.Label>
              <Form.Control
                type="text"
                name="membersDirectorsCount"
                value={formData.membersDirectorsCount}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Consent/NOC from Creditors</Form.Label>
                  <Form.Select
                    name="creditorsConsent"
                    value={formData.creditorsConsent}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Proof of Advertisement</Form.Label>
                  <Form.Control
                    type="text"
                    name="proofOfAdvertisement"
                    value={formData.proofOfAdvertisement}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Hearing Date (if any)</Form.Label>
              <Form.Control
                type="date"
                name="conversionHearingDate"
                value={formData.conversionHearingDate}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Objection Raised (if any)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="conversionObjectionRaised"
                value={formData.conversionObjectionRaised}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Authorized Signatory Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="authorizedSignatoryName"
                    value={formData.authorizedSignatoryName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Authorized Signatory Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="authorizedSignatoryDesignation"
                    value={formData.authorizedSignatoryDesignation}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
        
        {selectedNoticeType === 'condonation-delay' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Form Name (e.g., MGT-14, AOC-4)</Form.Label>
              <Form.Control
                type="text"
                name="formName"
                value={formData.formName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Due Date of Filing</Form.Label>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Actual Date of Filing</Form.Label>
                  <Form.Control
                    type="date"
                    name="actualFilingDate"
                    value={formData.actualFilingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Delay</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForDelay"
                value={formData.reasonForDelay}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date of Board Resolution</Form.Label>
              <Form.Control
                type="date"
                name="condonationBoardResolutionDate"
                value={formData.condonationBoardResolutionDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Nature of Event</Form.Label>
              <Form.Control
                type="text"
                name="natureOfEvent"
                value={formData.natureOfEvent}
                onChange={handleInputChange}
                className="form-control"
                placeholder="e.g., approval of financials, appointment of director"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Is it recurring delay?</Form.Label>
                  <Form.Select
                    name="isRecurringDelay"
                    value={formData.isRecurringDelay}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Condonation Application Filing Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="condonationApplicationFilingDate"
                    value={formData.condonationApplicationFilingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Authorized Signatory Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="condonationAuthorizedSignatoryName"
                    value={formData.condonationAuthorizedSignatoryName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Authorized Signatory Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="condonationAuthorizedSignatoryDesignation"
                    value={formData.condonationAuthorizedSignatoryDesignation}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
        
        {selectedNoticeType === 'change-company-name' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Existing Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="existingName"
                    value={formData.existingName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Proposed New Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="proposedNewName"
                    value={formData.proposedNewName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Name Change</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForNameChange"
                value={formData.reasonForNameChange}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Board Resolution</Form.Label>
                  <Form.Control
                    type="date"
                    name="nameChangeBoardResolutionDate"
                    value={formData.nameChangeBoardResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Special Resolution</Form.Label>
                  <Form.Control
                    type="date"
                    name="nameChangeSpecialResolutionDate"
                    value={formData.nameChangeSpecialResolutionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Date of MGT-14 Filing</Form.Label>
              <Form.Control
                type="date"
                name="nameChangeMgt14FilingDate"
                value={formData.nameChangeMgt14FilingDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">SRN of Name Approval (RUN or SPICe+)</Form.Label>
              <Form.Control
                type="text"
                name="srnNameApproval"
                value={formData.srnNameApproval}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Objections raised (if any)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="nameChangeObjectionsRaised"
                value={formData.nameChangeObjectionsRaised}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Authorized Signatory Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nameChangeAuthorizedSignatoryName"
                    value={formData.nameChangeAuthorizedSignatoryName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Authorized Signatory Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="nameChangeAuthorizedSignatoryDesignation"
                    value={formData.nameChangeAuthorizedSignatoryDesignation}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="input-card">
            <h2 className="card-title">Reply to Notice - RD Generator</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Select Notice Type</Form.Label>
                <Form.Select
                  value={selectedNoticeType}
                  onChange={handleNoticeTypeChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a notice type...</option>
                  {noticeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {renderFormFields()}

              {selectedNoticeType && (
                <button type="submit" className="features-button" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className="spinner me-2" />
                      Generating Reply...
                    </>
                  ) : (
                    <>
                      <FaSearch className="me-2" />
                      Generate Reply to Notice
                    </>
                  )}
                </button>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

      {response && (
        <Row className="justify-content-center">
          <Col md={10}>
            <h1 className="card-title" style={{ marginBottom: '6px' }}>{formData.companyName} -</h1>
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Reply to Notice</h2>
            <Card className="output-card">
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response);
                    alert('Copied to clipboard!');
                  }}
                >
                  <FaCopy className="me-1" />
                  <span className="d-none d-sm-inline">Copy to Clipboard</span>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    const { generatePDF } = PDFGenerator({
                      content: response,
                      fileName: `${formData.companyName}-reply-to-notice.pdf`,
                      title: `Reply to Notice`
                    });
                    generatePDF();
                  }}
                  className="me-2"
                >
                  <FaFilePdf className="me-1" />
                  <span className="d-none d-sm-inline">Download PDF</span>
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => {
                    const { generateWord } = WordGenerator({
                      content: response,
                      fileName: `${formData.companyName}-reply-to-notice.docx`,
                      title: `Reply to Notice`
                    });
                    generateWord();
                  }}
                >
                  <FaFileWord className="me-1" />
                  <span className="d-none d-sm-inline">Download Word</span>
                </Button>
              </div>
              <div className="markdown-content">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </Card>
            <AIDisclaimer variant="light" />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ReplyToNoticeRD;