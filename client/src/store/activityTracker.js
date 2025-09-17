import { useAuth } from './auth';

// Activity tracking hook
export const useActivityTracker = () => {
  const { user, token } = useAuth();

  const trackActivity = async (activityData) => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.warn('No authentication token found');
      return;
    }

    console.log('Tracking activity:', activityData);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          ...activityData,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      console.log('Activity tracking response:', result);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${result.message}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to track activity:', error);
      // Don't throw error to avoid breaking user experience
    }
  };

  const getActivityHistory = async (filters = {}) => {
    if (!user || !token) {
      console.warn('User not authenticated');
      return [];
    }

    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.feature) queryParams.append('feature', filters.feature);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.offset) queryParams.append('offset', filters.offset);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/history?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching activity history:', error);
      return [];
    }
  };

  const deleteActivity = async (activityId) => {
    if (!user || !token) {
      console.warn('User not authenticated');
      return false;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting activity:', error);
      return false;
    }
  };

  const clearAllHistory = async () => {
    if (!user || !token) {
      console.warn('User not authenticated');
      return false;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/activity/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
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
  COMPLIANCE_CALENDAR: 'Compliance Calendar',
  CSR_POLICY: 'CSR Policy',
  DOCUMENT_MANAGEMENT_POLICY: 'Document Management Policy',
  INSIDER_TRADING_POLICY: 'Insider Trading Policy',
  MEETING_MINUTES_POLICY: 'Meeting Minutes Policy',
  RELATED_PARTY_TRANSACTION_POLICY: 'Related Party Transaction Policy',
  STATUTORY_REGISTER_POLICY: 'Statutory Register Maintenance Policy',
  BOARD_MEETING_ASSISTANT: 'Board Meeting Assistant',
  GENERAL_MEETING_ASSISTANT: 'General Meeting Assistant',
  REPLY_TO_NOTICE_RD: 'Reply to Notice RD',
  REPLY_TO_NOTICE_ROC: 'Reply to Notice ROC',
  REPLY_TO_NOTICE_NCLT: 'Reply to Notice NCLT',
  CAPITAL_RAISING_AGREEMENT: 'Capital Raising Advisory Agreement'
};
