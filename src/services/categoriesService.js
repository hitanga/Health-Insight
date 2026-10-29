import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { initialCategories } from '../data/initialData';

const LOCAL_STORAGE_CATEGORIES_KEY = 'healthinsight_categories';

function getLocalCategories() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read categories from localStorage', e);
  }
  return [...initialCategories];
}

function saveLocalCategories(cats) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
  } catch (e) {
    console.warn('Could not save categories to localStorage', e);
  }
}

export async function getCategories() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Firestore categories fetch failed, using fallback:', e);
    }
  }
  return getLocalCategories();
}

export async function saveCategory(category) {
  const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
  const catData = {
    name: category.name,
    slug: slug,
    description: category.description || '',
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  const id = category.id || slug;

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'categories', id), {
      ...catData,
      createdAt: category.createdAt || (isFirebaseConfigured ? serverTimestamp() : new Date().toISOString())
    }, { merge: true });
    return { id, ...catData };
  } else {
    const list = getLocalCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...catData };
    } else {
      list.push({ id, ...catData, articleCount: 0 });
    }
    saveLocalCategories(list);
    return { id, ...catData };
  }
}

export async function deleteCategory(id) {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'categories', id));
    return true;
  } else {
    const list = getLocalCategories().filter(c => c.id !== id);
    saveLocalCategories(list);
    return true;
  }
}
