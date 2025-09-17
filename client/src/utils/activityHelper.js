import { useActivityTracker, ACTIVITY_TYPES, FEATURES } from '../store/activityTracker';

// Helper function to add activity tracking to any component
export const withActivityTracking = (Component, featureName, activityType = ACTIVITY_TYPES.FORM_SUBMISSION) => {
  return function TrackedComponent(props) {
    const { trackActivity } = useActivityTracker();
    
    const trackFormSubmission = async (inputData, outputData = null, action = 'Form Submitted') => {
      try {
        await trackActivity({
          activityType,
          feature: featureName,
          action,
          inputData,
          outputData,
          metadata: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        });
      } catch (error) {
        console.error('Failed to track activity:', error);
      }
    };

    const trackError = async (inputData, error, action = 'Error Occurred') => {
      try {
        await trackActivity({
          activityType,
          feature: featureName,
          action,
          inputData,
          outputData: {
            success: false,
            error: error.message || error
          }
        });
      } catch (trackingError) {
        console.error('Failed to track error:', trackingError);
      }
    };

    return (
      <Component 
        {...props} 
        trackFormSubmission={trackFormSubmission}
        trackError={trackError}
      />
    );
  };
};

// Quick tracking functions for common actions
export const trackPolicyGeneration = async (trackActivity, feature, companyName, success, content = null, error = null) => {
  try {
    await trackActivity({
      activityType: ACTIVITY_TYPES.POLICY_GENERATION,
      feature,
      action: success ? `${feature} Generated Successfully` : `${feature} Generation Failed`,
      inputData: { companyName },
      outputData: {
        success,
        contentLength: content ? content.length : 0,
        error: error ? error.message : null
      }
    });
  } catch (trackingError) {
    console.error('Failed to track policy generation:', trackingError);
  }
};

export const trackDocumentGeneration = async (trackActivity, feature, inputData, success, content = null, error = null) => {
  try {
    await trackActivity({
      activityType: ACTIVITY_TYPES.DOCUMENT_GENERATION,
      feature,
      action: success ? `${feature} Generated Successfully` : `${feature} Generation Failed`,
      inputData,
      outputData: {
        success,
        contentLength: content ? content.length : 0,
        error: error ? error.message : null
      }
    });
  } catch (trackingError) {
    console.error('Failed to track document generation:', trackingError);
  }
};

export const trackMeetingAssistance = async (trackActivity, feature, inputData, success, content = null, error = null) => {
  try {
    await trackActivity({
      activityType: ACTIVITY_TYPES.MEETING_ASSISTANCE,
      feature,
      action: success ? `${feature} Generated Successfully` : `${feature} Generation Failed`,
      inputData,
      outputData: {
        success,
        contentLength: content ? content.length : 0,
        error: error ? error.message : null
      }
    });
  } catch (trackingError) {
    console.error('Failed to track meeting assistance:', trackingError);
  }
};

export const trackNoticeReply = async (trackActivity, feature, inputData, success, content = null, error = null) => {
  try {
    await trackActivity({
      activityType: ACTIVITY_TYPES.NOTICE_REPLY,
      feature,
      action: success ? `${feature} Generated Successfully` : `${feature} Generation Failed`,
      inputData,
      outputData: {
        success,
        contentLength: content ? content.length : 0,
        error: error ? error.message : null
      }
    });
  } catch (trackingError) {
    console.error('Failed to track notice reply:', trackingError);
  }
};
