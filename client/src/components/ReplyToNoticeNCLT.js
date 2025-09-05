import React, { useState } from 'react';
import { Card, Form, Container, Row, Col, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import APIService from '../Common/API';
import { FaCopy, FaFilePdf, FaSpinner, FaFileWord, FaSearch } from 'react-icons/fa';
import PDFGenerator from './PDFGenerator';
import WordGenerator from './WordGenerator';
import AIDisclaimer from './AIDisclaimer';

const ReplyToNoticeNCLT = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [selectedNoticeType, setSelectedNoticeType] = useState('');

  // Form data for different NCLT notice types
  const [formData, setFormData] = useState({
    // Common fields
    companyName: '',
    cin: '',
    ncltNoticeDate: '',
    petitionNumber: '',
    authorizedSignatoryName: '',
    authorizedSignatoryDesignation: '',
    
    // Oppression & Mismanagement (Sec 241/242)
    petitionerNames: '',
    respondentNames: '',
    natureOfAllegation: '',
    chronologyOfEvents: '',
    reliefsClaimed: '',
    filingPetitionDate: '',
    interimReliefStatus: '',
    internalResolutionAttempts: '',
    additionalClarifications: '',
    
    // Insolvency Proceedings (IBC – Sec 7/9/10)
    applicationType: '',
    applicantName: '',
    dateOfDefault: '',
    amountOfDefault: '',
    documentsSubmitted: '',
    filingDate: '',
    cirpStatus: '',
    irpDetails: '',
    settlementProposal: '',
    additionalRemarks: '',
    
    // Restoration of Company (Sec 252)
    dateOfStrikeOff: '',
    reasonForStrikeOff: '',
    operationalStatus: '',
    financialsBusinessProof: '',
    objectionRaised: '',
    reliefsSeught: '',
    additionalNotes: '',
    
    // Merger / Demerger Scheme (Sec 230–232)
    transferorCompanyNames: '',
    transfereeCompanyNames: '',
    transferorCINs: '',
    transfereeCINs: '',
    applicationTypeScheme: '',
    boardResolutionDate: '',
    appointedDateOfScheme: '',
    schemeHighlights: '',
    stakeholderMeetingDate: '',
    meetingOutcome: '',
    objectionStatus: '',
    
    // Class Action Petition (Sec 245)
    petitionersStake: '',
    respondentsDetails: '',
    grievanceNature: '',
    evidenceProvided: '',
    affectedMembersCount: '',
    petitionDate: '',
    regulatoryComplaint: '',
    
    // Director Disqualification Removal (Sec 164/167)
    directorName: '',
    din: '',
    affectedCompanyName: '',
    reasonForDisqualification: '',
    periodOfDisqualification: '',
    notificationDate: '',
    companiesAffected: '',
    legalGroundsForRelief: '',
    additionalJustifications: ''
  });

  const noticeTypes = [
    { id: 'oppression-mismanagement', title: 'Oppression & Mismanagement (Sec 241/242)' },
    { id: 'insolvency-proceedings', title: 'Insolvency Proceedings (IBC – Sec 7/9/10)' },
    { id: 'restoration-company', title: 'Restoration of Company (Sec 252)' },
    { id: 'merger-demerger', title: 'Merger / Demerger Scheme (Sec 230–232)' },
    { id: 'class-action', title: 'Class Action Petition (Sec 245)' },
    { id: 'director-disqualification', title: 'Director Disqualification Removal (Sec 164/167)' }
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
    let prompt = '';

    switch (selectedNoticeType) {
      case 'oppression-mismanagement':
        prompt = `Draft a formal and legally structured reply to NCLT under Section 241/242 for a matter concerning ${formData.natureOfAllegation} involving company "${formData.companyName}" (CIN: ${formData.cin}). The petitioners are [${formData.petitionerNames}] and the respondents are [${formData.respondentNames}]. The case facts are as follows: [${formData.chronologyOfEvents}]. Include legal arguments and respectfully request relief based on these facts. Consider below inputs also:

Company Name: ${formData.companyName}
CIN: ${formData.cin}
Petitioner Name(s): ${formData.petitionerNames}
Respondent Name(s): ${formData.respondentNames}
Nature of Allegation: ${formData.natureOfAllegation}
Chronology of Events / Facts of the Case: ${formData.chronologyOfEvents}
Reliefs Claimed: ${formData.reliefsClaimed}
Date of NCLT Notice: ${formData.ncltNoticeDate}
Date of Filing Petition: ${formData.filingPetitionDate}
Petition Number: ${formData.petitionNumber}
Interim Relief Status: ${formData.interimReliefStatus}
Internal Resolution Attempts: ${formData.internalResolutionAttempts}
Authorized Signatory Name and Designation: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}
Additional Clarifications: ${formData.additionalClarifications}`;
        break;

      case 'insolvency-proceedings':
        prompt = `Prepare a reply to NCLT in response to insolvency petition under Section ${formData.applicationType} of the IBC, involving "${formData.companyName}" (CIN: ${formData.cin}). Include default details, response to claim, documents submitted, settlement efforts, and compliance with IBC procedure. Maintain legal tone and refer to applicable precedents or defenses. Consider below inputs also:

Company Name: ${formData.companyName}
CIN: ${formData.cin}
Application Type: ${formData.applicationType}
Name of Applicant: ${formData.applicantName}
Date of Default: ${formData.dateOfDefault}
Amount of Default: ${formData.amountOfDefault}
Documents Submitted: ${formData.documentsSubmitted}
Filing Date: ${formData.filingDate}
Petition Number: ${formData.petitionNumber}
CIRP Status (if any): ${formData.cirpStatus}
IRP Details (if appointed): ${formData.irpDetails}
Date of NCLT Notice: ${formData.ncltNoticeDate}
Settlement Proposal (if any): ${formData.settlementProposal}
Authorized Signatory: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}
Additional Remarks: ${formData.additionalRemarks}`;
        break;

      case 'restoration-company':
        prompt = `Draft a reply in response to NCLT notice under Section 252 of the Companies Act, 2013 for restoration of the struck-off company "${formData.companyName}" (CIN: ${formData.cin}). Provide reasons, factual background, and documentary justification. Conclude with a prayer for restoration and compliance continuity. Consider below inputs also:

Company Name: ${formData.companyName}
CIN: ${formData.cin}
Date of Strike Off: ${formData.dateOfStrikeOff}
Reason for Strike Off: ${formData.reasonForStrikeOff}
Operational Status at time of strike-off: ${formData.operationalStatus}
Financials / Business Activity Proof: ${formData.financialsBusinessProof}
Petition Filing Date: ${formData.filingDate}
Petition Number: ${formData.petitionNumber}
NCLT Notice Date: ${formData.ncltNoticeDate}
Objections Raised (if any): ${formData.objectionRaised}
Authorized Signatory: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}
Reliefs Sought: ${formData.reliefsSeught}
Additional Notes: ${formData.additionalNotes}`;
        break;

      case 'merger-demerger':
        prompt = `Prepare a formal response to NCLT notice under Sections 230–232 for a scheme of ${formData.applicationTypeScheme} involving Transferor: [${formData.transferorCompanyNames}] with CINs [${formData.transferorCINs}] and Transferee: [${formData.transfereeCompanyNames}] with CINs [${formData.transfereeCINs}]. Include procedural compliance, resolutions passed, stakeholder outcomes, and request for final approval from NCLT. Also consider below additional inputs:

Name(s) of Companies (Transferor): ${formData.transferorCompanyNames}
Name(s) of Companies (Transferee): ${formData.transfereeCompanyNames}
Transferor CINs: ${formData.transferorCINs}
Transferee CINs: ${formData.transfereeCINs}
Application Type: ${formData.applicationTypeScheme}
Date of Board Resolution: ${formData.boardResolutionDate}
Date of NCLT Filing: ${formData.filingDate}
Petition Number: ${formData.petitionNumber}
Appointed Date of Scheme: ${formData.appointedDateOfScheme}
Scheme Highlights: ${formData.schemeHighlights}
Stakeholder Meeting Date: ${formData.stakeholderMeetingDate}
Meeting Outcome: ${formData.meetingOutcome}
Notice Date: ${formData.ncltNoticeDate}
Objection Status: ${formData.objectionStatus}
Authorized Signatory: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}
Additional Notes: ${formData.additionalNotes}`;
        break;

      case 'class-action':
        prompt = `Generate a legally correct reply to NCLT under Section 245 (Class Action) concerning grievances by shareholders/members against "${formData.companyName}" (CIN: ${formData.cin}). Include factual rebuttals, legal defenses, status of interim relief, and prayer for appropriate disposal. Also consider below additional inputs:

Company Name: ${formData.companyName}
CIN: ${formData.cin}
Petitioner(s) (Name & Stake): ${formData.petitionersStake}
Respondents (Company / Director / Auditor): ${formData.respondentsDetails}
Grievance Nature: ${formData.grievanceNature}
Evidence Provided: ${formData.evidenceProvided}
No. of Affected Members: ${formData.affectedMembersCount}
Petition Date: ${formData.petitionDate}
Notice Date: ${formData.ncltNoticeDate}
Interim Relief Status: ${formData.interimReliefStatus}
Regulatory Complaint (if any): ${formData.regulatoryComplaint}
Authorized Signatory: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}
Additional Notes: ${formData.additionalNotes}`;
        break;

      case 'director-disqualification':
        prompt = `Prepare a professional and legally reasoned draft reply to NCLT under Section 164/167 for removal of disqualification of director "${formData.directorName}" (DIN: ${formData.din}) from "${formData.affectedCompanyName}". Provide facts, compliance status, and invoke grounds like natural justice, error rectification, or post-compliance. Also consider below additional inputs:

Director Name: ${formData.directorName}
DIN: ${formData.din}
Affected Company Name: ${formData.affectedCompanyName}
CIN: ${formData.cin}
Reason for Disqualification: ${formData.reasonForDisqualification}
Period of Disqualification: ${formData.periodOfDisqualification}
Notification Date: ${formData.notificationDate}
Companies Affected: ${formData.companiesAffected}
Petition Filing Date: ${formData.filingDate}
Petition Number: ${formData.petitionNumber}
NCLT Notice Date: ${formData.ncltNoticeDate}
Legal Grounds for Relief: ${formData.legalGroundsForRelief}
Authorized Signatory: ${formData.authorizedSignatoryName} - ${formData.authorizedSignatoryDesignation}
Additional Justifications: ${formData.additionalJustifications}`;
        break;

      default:
        return '';
    }

    return prompt;
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

      <Row>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">NCLT Notice Date</Form.Label>
            <Form.Control
              type="date"
              name="ncltNoticeDate"
              value={formData.ncltNoticeDate}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="form-group">
            <Form.Label className="form-label">Petition Number</Form.Label>
            <Form.Control
              type="text"
              name="petitionNumber"
              value={formData.petitionNumber}
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
  );

  const renderFormFields = () => {
    if (!selectedNoticeType) return null;

    return (
      <>
        {renderCommonFields()}
        
        {selectedNoticeType === 'oppression-mismanagement' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Petitioner Name(s)</Form.Label>
                  <Form.Control
                    type="text"
                    name="petitionerNames"
                    value={formData.petitionerNames}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Respondent Name(s)</Form.Label>
                  <Form.Control
                    type="text"
                    name="respondentNames"
                    value={formData.respondentNames}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Nature of Allegation</Form.Label>
              <Form.Select
                name="natureOfAllegation"
                value={formData.natureOfAllegation}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Oppression">Oppression</option>
                <option value="Mismanagement">Mismanagement</option>
                <option value="Both">Both</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Chronology of Events / Facts of the Case</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="chronologyOfEvents"
                value={formData.chronologyOfEvents}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reliefs Claimed</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reliefsClaimed"
                value={formData.reliefsClaimed}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Filing Petition</Form.Label>
                  <Form.Control
                    type="date"
                    name="filingPetitionDate"
                    value={formData.filingPetitionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Interim Relief Status</Form.Label>
                  <Form.Select
                    name="interimReliefStatus"
                    value={formData.interimReliefStatus}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Granted">Granted</option>
                    <option value="Not Granted">Not Granted</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Internal Resolution Attempts</Form.Label>
              <Form.Select
                name="internalResolutionAttempts"
                value={formData.internalResolutionAttempts}
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
              <Form.Label className="form-label">Additional Clarifications</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additionalClarifications"
                value={formData.additionalClarifications}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'insolvency-proceedings' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Application Type</Form.Label>
              <Form.Select
                name="applicationType"
                value={formData.applicationType}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Section 7 (Financial Creditor)">Section 7 (Financial Creditor)</option>
                <option value="Section 9 (Operational Creditor)">Section 9 (Operational Creditor)</option>
                <option value="Section 10 (Corporate Debtor)">Section 10 (Corporate Debtor)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Name of Applicant</Form.Label>
              <Form.Control
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Default</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfDefault"
                    value={formData.dateOfDefault}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Amount of Default</Form.Label>
                  <Form.Control
                    type="text"
                    name="amountOfDefault"
                    value={formData.amountOfDefault}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Documents Submitted</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="documentsSubmitted"
                value={formData.documentsSubmitted}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Invoices, Demand Notices, etc."
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Filing Date</Form.Label>
              <Form.Control
                type="date"
                name="filingDate"
                value={formData.filingDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">CIRP Status (if any)</Form.Label>
                  <Form.Control
                    type="text"
                    name="cirpStatus"
                    value={formData.cirpStatus}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">IRP Details (if appointed)</Form.Label>
                  <Form.Control
                    type="text"
                    name="irpDetails"
                    value={formData.irpDetails}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Settlement Proposal (if any)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="settlementProposal"
                value={formData.settlementProposal}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Additional Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additionalRemarks"
                value={formData.additionalRemarks}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'restoration-company' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Date of Strike Off</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfStrikeOff"
                    value={formData.dateOfStrikeOff}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Filing Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="filingDate"
                    value={formData.filingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Strike Off</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForStrikeOff"
                value={formData.reasonForStrikeOff}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Operational Status at time of strike-off</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="operationalStatus"
                value={formData.operationalStatus}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Financials / Business Activity Proof</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="financialsBusinessProof"
                value={formData.financialsBusinessProof}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Objections Raised (if any)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="objectionRaised"
                value={formData.objectionRaised}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reliefs Sought</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reliefsSeught"
                value={formData.reliefsSeught}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'merger-demerger' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Transferor Company Names</Form.Label>
                  <Form.Control
                    type="text"
                    name="transferorCompanyNames"
                    value={formData.transferorCompanyNames}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Transferee Company Names</Form.Label>
                  <Form.Control
                    type="text"
                    name="transfereeCompanyNames"
                    value={formData.transfereeCompanyNames}
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
                  <Form.Label className="form-label">Transferor CINs</Form.Label>
                  <Form.Control
                    type="text"
                    name="transferorCINs"
                    value={formData.transferorCINs}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Transferee CINs</Form.Label>
                  <Form.Control
                    type="text"
                    name="transfereeCINs"
                    value={formData.transfereeCINs}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Application Type</Form.Label>
              <Form.Select
                name="applicationTypeScheme"
                value={formData.applicationTypeScheme}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Merger">Merger</option>
                <option value="Demerger">Demerger</option>
                <option value="Amalgamation">Amalgamation</option>
              </Form.Select>
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
                  <Form.Label className="form-label">Filing Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="filingDate"
                    value={formData.filingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Appointed Date of Scheme</Form.Label>
              <Form.Control
                type="date"
                name="appointedDateOfScheme"
                value={formData.appointedDateOfScheme}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Scheme Highlights</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="schemeHighlights"
                value={formData.schemeHighlights}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Stakeholder Meeting Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="stakeholderMeetingDate"
                    value={formData.stakeholderMeetingDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Meeting Outcome</Form.Label>
                  <Form.Control
                    type="text"
                    name="meetingOutcome"
                    value={formData.meetingOutcome}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Objection Status</Form.Label>
              <Form.Control
                type="text"
                name="objectionStatus"
                value={formData.objectionStatus}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'class-action' && (
          <>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Petitioner(s) (Name & Stake)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="petitionersStake"
                value={formData.petitionersStake}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Respondents (Company / Director / Auditor)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="respondentsDetails"
                value={formData.respondentsDetails}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Grievance Nature</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="grievanceNature"
                value={formData.grievanceNature}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Evidence Provided</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="evidenceProvided"
                value={formData.evidenceProvided}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">No. of Affected Members</Form.Label>
                  <Form.Control
                    type="number"
                    name="affectedMembersCount"
                    value={formData.affectedMembersCount}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Petition Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="petitionDate"
                    value={formData.petitionDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Interim Relief Status</Form.Label>
              <Form.Select
                name="interimReliefStatus"
                value={formData.interimReliefStatus}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select...</option>
                <option value="Granted">Granted</option>
                <option value="Not Granted">Not Granted</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Regulatory Complaint (if any)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="regulatoryComplaint"
                value={formData.regulatoryComplaint}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
          </>
        )}
        
        {selectedNoticeType === 'director-disqualification' && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Director Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="directorName"
                    value={formData.directorName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">DIN</Form.Label>
                  <Form.Control
                    type="text"
                    name="din"
                    value={formData.din}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Affected Company Name</Form.Label>
              <Form.Control
                type="text"
                name="affectedCompanyName"
                value={formData.affectedCompanyName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Reason for Disqualification</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForDisqualification"
                value={formData.reasonForDisqualification}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Period of Disqualification</Form.Label>
                  <Form.Control
                    type="text"
                    name="periodOfDisqualification"
                    value={formData.periodOfDisqualification}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="form-label">Notification Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="notificationDate"
                    value={formData.notificationDate}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Companies Affected</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="companiesAffected"
                value={formData.companiesAffected}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Filing Date</Form.Label>
              <Form.Control
                type="date"
                name="filingDate"
                value={formData.filingDate}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Legal Grounds for Relief</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="legalGroundsForRelief"
                value={formData.legalGroundsForRelief}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="form-label">Additional Justifications</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additionalJustifications"
                value={formData.additionalJustifications}
                onChange={handleInputChange}
                className="form-control"
              />
            </Form.Group>
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
            <h2 className="card-title">Reply to Notice - NCLT Generator</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="form-group">
                <Form.Label className="form-label">Select NCLT Notice Type</Form.Label>
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
                      Generate Reply to NCLT Notice
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
            <h2 className="card-title" style={{ marginBottom: '12px' }}>Reply to NCLT Notice</h2>
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
                      fileName: `${formData.companyName}-reply-to-nclt-notice.pdf`,
                      title: `Reply to NCLT Notice`
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
                      fileName: `${formData.companyName}-reply-to-nclt-notice.docx`,
                      title: `Reply to NCLT Notice`
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

export default ReplyToNoticeNCLT;
