import { useState, useEffect } from 'react';

const STORAGE_KEY = 'rehava_active_tab';

export function usePersistentTab(defaultTab = 'overview', validTabs = []) {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (validTabs.length === 0 || validTabs.includes(saved))) {
        return saved;
      }
    } catch {
      return defaultTab;
    }
    return defaultTab;
  });

  useEffect(() => {
    try {
      if (activeTab) {
        localStorage.setItem(STORAGE_KEY, activeTab);
      }
    } catch {}
  }, [activeTab]);

  const clearTab = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return [activeTab, setActiveTab, clearTab];
}