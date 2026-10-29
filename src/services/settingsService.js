import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { initialSettings } from '../data/initialData';

const LOCAL_STORAGE_SETTINGS_KEY = 'healthinsight_settings';

function getLocalSettings() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) return { ...initialSettings, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Could not read settings from localStorage', e);
  }
  return { ...initialSettings };
}

function saveLocalSettings(settings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not save settings to localStorage', e);
  }
}

export async function getWebsiteSettings() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'settings', 'website');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...initialSettings, ...snap.data() };
      }
    } catch (e) {
      console.warn('Firestore settings fetch failed, using fallback:', e);
    }
  }
  return getLocalSettings();
}

export async function updateWebsiteSettings(newSettings) {
  const merged = {
    ...newSettings,
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'settings', 'website');
      await setDoc(docRef, merged, { merge: true });
      return merged;
    } catch (err) {
      console.warn('Firestore settings update failed, saving locally:', err);
      saveLocalSettings(merged);
      return merged;
    }
  } else {
    saveLocalSettings(merged);
    return merged;
  }
}
