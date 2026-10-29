import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

const LOCAL_STORAGE_MESSAGES_KEY = 'healthinsight_messages';

function getLocalMessages() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read messages from localStorage', e);
  }
  return [];
}

function saveLocalMessages(msgs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(msgs));
  } catch (e) {
    console.warn('Could not save messages to localStorage', e);
  }
}

export async function submitContactMessage({ name, email, subject, message }) {
  // Basic validation
  if (!name || !email || !message) {
    throw new Error('Please fill in all required fields.');
  }

  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
    read: false,
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'contactMessages'), payload);
    return { id: docRef.id, ...payload };
  } else {
    const messages = getLocalMessages();
    const created = { id: `msg-${Date.now()}`, ...payload };
    messages.unshift(created);
    saveLocalMessages(messages);
    return created;
  }
}

export async function getContactMessages() {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : d.data().createdAt
      }));
    } catch (e) {
      console.warn('Firestore messages fetch failed, checking local:', e);
    }
  }
  return getLocalMessages();
}

export async function markMessageRead(id, read = true) {
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'contactMessages', id), { read });
    return true;
  } else {
    const messages = getLocalMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx].read = read;
      saveLocalMessages(messages);
      return true;
    }
    return false;
  }
}

export async function deleteMessage(id) {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'contactMessages', id));
    return true;
  } else {
    const messages = getLocalMessages().filter(m => m.id !== id);
    saveLocalMessages(messages);
    return true;
  }
}
