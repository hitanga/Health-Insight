import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

const LOCAL_STORAGE_SUBSCRIBERS_KEY = 'healthinsight_subscribers';

function getLocalSubscribers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIBERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read subscribers from localStorage', e);
  }
  return [];
}

function saveLocalSubscribers(subs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIBERS_KEY, JSON.stringify(subs));
  } catch (e) {
    console.warn('Could not save subscribers to localStorage', e);
  }
}

export async function subscribeNewsletter(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && db) {
    // Check if already subscribed
    const q = query(collection(db, 'newsletterSubscribers'), where('email', '==', cleanEmail));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { success: true, message: 'You are already subscribed to our newsletter!' };
    }

    await addDoc(collection(db, 'newsletterSubscribers'), {
      email: cleanEmail,
      subscribedAt: serverTimestamp(),
      source: 'footer'
    });
    return { success: true, message: 'Thank you for subscribing to HealthInsight!' };
  } else {
    const subs = getLocalSubscribers();
    if (subs.some(s => s.email === cleanEmail)) {
      return { success: true, message: 'You are already subscribed to our newsletter!' };
    }
    subs.push({
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      source: 'footer'
    });
    saveLocalSubscribers(subs);
    return { success: true, message: 'Thank you for subscribing to HealthInsight!' };
  }
}

export async function getNewsletterSubscribers() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'newsletterSubscribers'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Firestore subscribers fetch failed:', e);
    }
  }
  return getLocalSubscribers();
}
