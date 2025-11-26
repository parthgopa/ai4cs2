import { useAuth } from './auth';

// Activity tracking hook
export const useActivityTracker = () => {

  const trackActivity = async (activityData) => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (!storedToken || !storedUserId) {
      console.warn('No authentication token or userId found - cannot track activity');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          ...activityData,
          userId: storedUserId,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Activity tracking failed:', response.status, result.message);
        throw new Error(`HTTP error! status: ${response.status}, message: ${result.message}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to track activity:', error);
      // Don't throw error to avoid breaking user experience
    }
  };

  const getActivityHistory = async (filters = {}) => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (!storedToken || !storedUserId) {
      console.warn('User not authenticated or userId not found');
      console.log('Token:', storedToken ? 'Present' : 'Missing');
      console.log('UserId:', storedUserId ? storedUserId : 'Missing');
      return { data: { activities: [], totalCount: 0, hasMore: false } };
    }

    try {
      const queryParams = new URLSearchParams();
      
      // Add userId to query params
      queryParams.append('userId', storedUserId);
      
      // Add filters to query params
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.feature) queryParams.append('feature', filters.feature);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.offset) queryParams.append('offset', filters.offset);

      console.log('Fetching activity history with params:', queryParams.toString());

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/history?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching activity history:', error);
      return { data: { activities: [], totalCount: 0, hasMore: false } };
    }
  };

  const deleteActivity = async (activityId) => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      console.warn('User not authenticated');
      return false;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  };

  const clearAllHistory = async () => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      console.warn('User not authenticated');
      return false;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error clearing activity history:', error);
      return false;
    }
  };

  return {
    trackActivity,
    getActivityHistory,
    deleteActivity,
    clearAllHistory
  };
};

// Activity types constants
export const ACTIVITY_TYPES = {
  COMPLIANCE_CALENDAR: 'compliance_calendar',
  POLICY_GENERATION: 'policy_generation',
  DOCUMENT_GENERATION: 'document_generation',
  MEETING_ASSISTANCE: 'meeting_assistance',
  NOTICE_REPLY: 'notice_reply',
  FORM_SUBMISSION: 'form_submission',
  PROFILE_UPDATE: 'profile_update',
  SETTINGS_CHANGE: 'settings_change'
};

// Feature names constants
export const FEATURES = {
  // Compliance Tools
  COMPLIANCE_CALENDAR: 'Compliance Calendar',
  SECRETARIAL_AUDIT: 'Secretarial Audit Toolkit',
  REGULATORY_UPDATION: 'Regulatory Compass',
  STATUTORY_REGISTERS: 'Statutory Register and Records',
  PROCEDURE_PRACTICE: 'Procedure and Practice',
  FORMS: 'Forms',
  
  // Legal Tools
  LEGAL_OPINION: 'Legal Opinion',
  LEGAL_RESEARCH: 'Legal Research',
  RESEARCH_ASSISTANT: 'Research Assistant',
  SCENARIO_SOLVER: 'Scenario Solver',
  CASE_DIGEST: 'Case Digest',
  JUDGMENT_SIMULATOR: 'Judgment Simulator',
  MINI_LAW_LIBRARY: 'Mini-Law Library',
  
  // Policy Drafting Tools
  CSR_POLICY: 'CSR Policy',
  DOCUMENT_MANAGEMENT_POLICY: 'Document Management Policy',
  INSIDER_TRADING_POLICY: 'Insider Trading Policy',
  MEETING_MINUTES_POLICY: 'Meeting Minutes Policy',
  RELATED_PARTY_TRANSACTION_POLICY: 'Related Party Transaction Policy',
  STATUTORY_REGISTER_POLICY: 'Statutory Register Maintenance Policy',
  POLICY_DRAFTING: 'Policy Drafting',
  
  // Agreement Tools
  AGREEMENT_DRAFTING: 'Agreement Drafting',
  CAPITAL_RAISING_AGREEMENT: 'Capital Raising Advisory Agreement',
  
  // Notice Reply Tools
  REPLY_TO_NOTICE_RD: 'Reply to Notice - RD',
  REPLY_TO_NOTICE_ROC: 'Reply to Notice - ROC',
  REPLY_TO_NOTICE_NCLT: 'Reply to Notice - NCLT',
  
  // Meeting Tools
  BOARD_MEETING_ASSISTANT: 'Board Meeting Assistant',
  GENERAL_MEETING_ASSISTANT: 'General Meeting Assistant',
  RESOLUTION_ASSISTANT: 'Resolution Assistant',
  RESOLUTIONS_DRAFTING: 'Resolutions Drafting Page',
  
  // Petition Tools
  PETITION_PREPARATOR: 'Petition Preparator',
  
  // Utility Tools
  EMAIL_DRAFTER: 'Email Drafter',
  CHATBOT: 'Chatbot',
  
  // User Management
  PROFILE: 'Profile',
  PROFILE_SETTINGS: 'Profile Settings',
  PROFILE_PREFERENCES: 'Profile Preferences',
  USER_HISTORY: 'User History',
  
  // Authentication
  LOGIN: 'Login',
  REGISTER: 'Register',
  OTP_VERIFICATION: 'OTP Verification',
  LOGOUT: 'Logout',
  
  // Other Pages
  ABOUT: 'About',
  CONTACT: 'Contact',
  HOMEPAGE: 'Home Page',
  TOOLS: 'Tools Page'
};
