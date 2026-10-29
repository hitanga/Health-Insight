import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { initialPosts } from '../data/initialData';

const LOCAL_STORAGE_POSTS_KEY = 'healthinsight_posts';

function getLocalPosts() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read posts from localStorage', e);
  }
  return [...initialPosts];
}

function saveLocalPosts(posts) {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Could not save posts to localStorage', e);
  }
}

// Convert Firestore document or local document to clean object
function formatPostDoc(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : data.publishedAt,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    deletedAt: data.deletedAt?.toDate ? data.deletedAt.toDate().toISOString() : data.deletedAt
  };
}

/**
 * Fetch all published, non-deleted posts for the public blog
 */
export async function getPublishedPosts() {
  if (isFirebaseConfigured && db) {
    try {
      const postsCol = collection(db, 'posts');
      // Public query: published only, not deleted
      const q = query(
        postsCol,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(formatPostDoc)
        .filter(p => !p.deletedAt); // in case soft-deleted

      if (results.length > 0) {
        return results;
      }
    } catch (error) {
      console.warn('Firestore query failed, falling back to local dataset:', error);
    }
  }

  // Fallback to local storage / initial seed
  return getLocalPosts().filter(p => p.status === 'published' && !p.deletedAt);
}

/**
 * Fetch featured posts for homepage
 * Returns { mainFeatured, compactFeatured: [] }
 */
export async function getFeaturedPosts() {
  const published = await getPublishedPosts();

  // Find explicit featured posts
  const explicitlyFeatured = published.filter(p => p.isFeatured);
  let mainFeatured = explicitlyFeatured.find(p => p.featuredOrder === 1) || explicitlyFeatured[0] || published[0] || null;
  
  let compactFeatured = explicitlyFeatured.filter(p => p.id !== mainFeatured?.id).slice(0, 3);
  if (compactFeatured.length < 3) {
    const remaining = published.filter(p => p.id !== mainFeatured?.id && !compactFeatured.some(c => c.id === p.id));
    compactFeatured = [...compactFeatured, ...remaining].slice(0, 3);
  }

  return {
    mainFeatured,
    compactFeatured
  };
}

/**
 * Fetch post by slug for single article view
 */
export async function getPostBySlug(slug) {
  if (!slug) return null;

  if (isFirebaseConfigured && db) {
    try {
      const postsCol = collection(db, 'posts');
      const q = query(
        postsCol,
        where('slug', '==', slug),
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const post = formatPostDoc(snapshot.docs[0]);
        if (!post.deletedAt) return post;
      }
    } catch (error) {
      console.warn('Firestore query by slug failed, checking local data:', error);
    }
  }

  const posts = getLocalPosts();
  return posts.find(p => p.slug === slug && p.status === 'published' && !p.deletedAt) || null;
}

/**
 * Fetch all posts for Admin dashboard (including drafts, excluding permanently deleted)
 */
export async function getAllPostsAdmin() {
  if (isFirebaseConfigured && db) {
    try {
      const postsCol = collection(db, 'posts');
      const q = query(postsCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(formatPostDoc).filter(p => !p.deletedAt);
      if (list.length > 0) return list;
    } catch (error) {
      console.warn('Firestore admin posts query failed, using local fallback:', error);
    }
  }

  return getLocalPosts().filter(p => !p.deletedAt);
}

/**
 * Fetch a single post by ID (for Admin edit)
 */
export async function getPostById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const postRef = doc(db, 'posts', id);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        return formatPostDoc(docSnap);
      }
    } catch (error) {
      console.warn('Firestore getPostById failed:', error);
    }
  }

  const posts = getLocalPosts();
  return posts.find(p => p.id === id) || null;
}

/**
 * Create a new post
 */
export async function createPost(postData) {
  const newPost = {
    ...postData,
    readingTime: postData.readingTime || Math.max(1, Math.ceil((postData.body || '').split(/\s+/).length / 200)),
    publishedAt: postData.status === 'published' 
      ? (isFirebaseConfigured ? Timestamp.now() : new Date().toISOString()) 
      : null,
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    deletedAt: null
  };

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'posts'), newPost);
    return { id: docRef.id, ...newPost };
  } else {
    const posts = getLocalPosts();
    const id = `local-post-${Date.now()}`;
    const created = { id, ...newPost, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    posts.unshift(created);
    saveLocalPosts(posts);
    return created;
  }
}

/**
 * Update existing post
 */
export async function updatePost(id, updates) {
  const updatePayload = {
    ...updates,
    readingTime: updates.readingTime || Math.max(1, Math.ceil((updates.body || '').split(/\s+/).length / 200)),
    updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
  };

  // If status changed to published and publishedAt is missing, set it
  if (updates.status === 'published' && !updates.publishedAt) {
    updatePayload.publishedAt = isFirebaseConfigured ? Timestamp.now() : new Date().toISOString();
  }

  if (isFirebaseConfigured && db) {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, updatePayload);
    return { id, ...updatePayload };
  } else {
    const posts = getLocalPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatePayload, updatedAt: new Date().toISOString() };
      saveLocalPosts(posts);
      return posts[index];
    }
    throw new Error('Post not found in local store');
  }
}

/**
 * Soft delete or remove post
 */
export async function deletePost(id, soft = true) {
  if (isFirebaseConfigured && db) {
    const postRef = doc(db, 'posts', id);
    if (soft) {
      await updateDoc(postRef, {
        status: 'deleted',
        deletedAt: serverTimestamp()
      });
    } else {
      await deleteDoc(postRef);
    }
    return true;
  } else {
    const posts = getLocalPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      if (soft) {
        posts[index].deletedAt = new Date().toISOString();
        posts[index].status = 'deleted';
      } else {
        posts.splice(index, 1);
      }
      saveLocalPosts(posts);
      return true;
    }
    return false;
  }
}

/**
 * Helper to generate URL-safe slugs
 */
export function generateSlug(title) {
  return (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
