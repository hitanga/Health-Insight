import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWebsiteSettings, updateWebsiteSettings } from '../services/settingsService';
import { initialSettings } from '../data/initialData';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getWebsiteSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateSettings = async (newValues) => {
    const updated = await updateWebsiteSettings(newValues);
    setSettings(updated);
    return updated;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
