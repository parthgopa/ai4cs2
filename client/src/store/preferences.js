import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [preferences, setPreferences] = useState({
    defaultCompanyName: '',
    defaultCompanyType: 'Private Limited Company',
    defaultCIN: '',
    autoFillForms: true,
    defaultQuarters: [],
    darkModePreference: 'system',
  });

  // Load preferences from user data when user changes
  useEffect(() => {
    if (user && isLoggedIn) {
      setPreferences({
        defaultCompanyName: user.companyName || '',
        defaultCompanyType: user.companyType || 'Private Limited Company',
        defaultCIN: user.cin || '',
        autoFillForms: user.preferences?.autoFillForms !== undefined ? user.preferences.autoFillForms : true,
        defaultQuarters: user.preferences?.defaultQuarters || [],
        darkModePreference: user.preferences?.darkModePreference || 'system',
      });
    } else {
      // Reset preferences when user logs out
      setPreferences({
        defaultCompanyName: '',
        defaultCompanyType: 'Private Limited Company',
        defaultCIN: '',
        autoFillForms: true,
        defaultQuarters: [],
        darkModePreference: 'system',
      });
    }
  }, [user, isLoggedIn]);

  // Function to update preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  // Function to get autofill data for forms
  const getAutofillData = () => {
    if (!preferences.autoFillForms) return {};
    
    return {
      companyName: preferences.defaultCompanyName,
      companyType: preferences.defaultCompanyType,
      cin: preferences.defaultCIN,
    };
  };

  const value = {
    preferences,
    updatePreferences,
    getAutofillData,
    isAutoFillEnabled: preferences.autoFillForms,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
