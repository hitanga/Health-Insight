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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { initialPosts } from '../data/initialData';

const LOCAL_STORAGE_POSTS_KEY = 'healthinsight_posts';

/**
 * Retrieve local cached posts, seeding initialPosts if empty
 */
export function getLocalPosts() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read posts from localStorage', e);
  }
  // Initialize local storage with seed data if not present
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(initialPosts));
  } catch (e) {
    console.warn('Could not seed posts to localStorage', e);
  }
  return [...initialPosts];
}

/**
 * Save posts array to local cache
 */
export function saveLocalPosts(posts) {
  try {
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Could not save posts to localStorage', e);
  }
}

/**
 * Format Firestore doc snapshot into a standardized object with string dates
 */
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
 * Fetch all published, non-deleted posts for the public blog.
 * Merges Firestore with local cache so newly created posts ALWAYS appear immediately!
 */
export async function getPublishedPosts() {
  let firestorePosts = [];
  let firestoreFetched = false;

  if (isFirebaseConfigured && db) {
    try {
      const postsCol = collection(db, 'posts');
      // Fetch without composite index query to avoid Firestore index errors
      const snapshot = await getDocs(postsCol);
      firestorePosts = snapshot.docs
        .map(formatPostDoc)
        .filter(p => p.status === 'published' && !p.deletedAt);
      firestoreFetched = true;
    } catch (error) {
      console.warn('Firestore published posts query notice (using local/cached dataset):', error);
    }
  }

  // Get local cache posts
  const localPublished = getLocalPosts().filter(p => p.status === 'published' && !p.deletedAt);

  // Merge posts: Firestore docs take priority, but any newly created local posts not yet in Firestore are preserved
  const postMap = new Map();

  // First seed local posts
  for (const post of localPublished) {
    const key = post.id || post.slug;
    postMap.set(key, post);
    if (post.slug) postMap.set(`slug_${post.slug}`, post);
  }

  // If Firestore succeeded, overlay Firestore posts
  if (firestoreFetched && firestorePosts.length > 0) {
    for (const post of firestorePosts) {
      const key = post.id;
      postMap.set(key, post);
      if (post.slug) postMap.set(`slug_${post.slug}`, post);
    }
  }

  // Deduplicate distinct objects
  const combined = Array.from(new Set(postMap.values()));

  // Sort descending by publishedAt or createdAt
  combined.sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return combined;
}

/**
 * Fetch featured posts for homepage
 * Returns { mainFeatured, compactFeatured: [] }
 */
export async function getFeaturedPosts() {
  const published = await getPublishedPosts();

  if (published.length === 0) {
    return { mainFeatured: null, compactFeatured: [] };
  }

  // Find explicit featured posts
  const explicitlyFeatured = published.filter(p => p.isFeatured);
  let mainFeatured = explicitlyFeatured.find(p => p.featuredOrder === 1) || explicitlyFeatured[0] || published[0];

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
      const q = query(postsCol, where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const post = formatPostDoc(snapshot.docs[0]);
        if (!post.deletedAt && post.status === 'published') {
          return post;
        }
      }
    } catch (error) {
      console.warn('Firestore query by slug notice, checking local data:', error);
    }
  }

  const posts = getLocalPosts();
  return posts.find(p => p.slug === slug && p.status === 'published' && !p.deletedAt) || null;
}

/**
 * Fetch all posts for Admin dashboard (including drafts, excluding permanently deleted)
 */
export async function getAllPostsAdmin() {
  let firestorePosts = [];
  let firestoreFetched = false;

  if (isFirebaseConfigured && db) {
    try {
      const postsCol = collection(db, 'posts');
      const snapshot = await getDocs(postsCol);
      firestorePosts = snapshot.docs
        .map(formatPostDoc)
        .filter(p => !p.deletedAt);
      firestoreFetched = true;
    } catch (error) {
      console.warn('Firestore admin posts query notice, using local cache:', error);
    }
  }

  const localPosts = getLocalPosts().filter(p => !p.deletedAt);
  const postMap = new Map();

  for (const p of localPosts) {
    postMap.set(p.id, p);
    if (p.slug) postMap.set(`slug_${p.slug}`, p);
  }

  if (firestoreFetched && firestorePosts.length > 0) {
    for (const p of firestorePosts) {
      postMap.set(p.id, p);
      if (p.slug) postMap.set(`slug_${p.slug}`, p);
    }
  }

  const combined = Array.from(new Set(postMap.values()));
  combined.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.publishedAt || 0).getTime();
    const timeB = new Date(b.createdAt || b.publishedAt || 0).getTime();
    return timeB - timeA;
  });

  return combined;
}

/**
 * Fetch a single post by ID (for Admin edit)
 */
export async function getPostById(id) {
  if (isFirebaseConfigured && db && !id.startsWith('post-') && !id.startsWith('local-')) {
    try {
      const postRef = doc(db, 'posts', id);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        return formatPostDoc(docSnap);
      }
    } catch (error) {
      console.warn('Firestore getPostById notice:', error);
    }
  }

  const posts = getLocalPosts();
  return posts.find(p => p.id === id) || null;
}

/**
 * Create a new post.
 * Always persists to local cache immediately AND synchronizes to Firestore cloud database.
 */
export async function createPost(postData) {
  const nowIso = new Date().toISOString();
  const calculatedReadingTime = postData.readingTime || Math.max(1, Math.ceil((postData.body || '').split(/\s+/).length / 200));

  const basePost = {
    ...postData,
    readingTime: calculatedReadingTime,
    publishedAt: postData.status === 'published' ? (postData.publishedAt || nowIso) : null,
    createdAt: nowIso,
    updatedAt: nowIso,
    deletedAt: null
  };

  let firestoreDocId = null;
  let firestoreError = null;

  // Attempt Firestore write with a 6-second timeout race to prevent indefinite hang if blocked by browser shields
  if (isFirebaseConfigured && db) {
    try {
      const firestorePayload = {
        ...basePost,
        publishedAt: postData.status === 'published' ? Timestamp.now() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const firestoreWritePromise = addDoc(collection(db, 'posts'), firestorePayload);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout: Firestore connection blocked or slow')), 6000)
      );

      const docRef = await Promise.race([firestoreWritePromise, timeoutPromise]);
      firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc write failed or blocked:', err);
      firestoreError = err;
    }
  }

  // Final document ID
  const finalId = firestoreDocId || `post-${Date.now()}`;
  const finalPost = {
    id: finalId,
    ...basePost,
    _syncStatus: firestoreDocId ? 'synced' : 'pending_cloud',
    _firestoreError: firestoreError ? (firestoreError.message || String(firestoreError)) : null
  };

  // Persist immediately to local cache so frontend displays it right away
  const localList = getLocalPosts();
  const existingIdx = localList.findIndex(p => p.id === finalId || (p.slug && p.slug === finalPost.slug));
  if (existingIdx !== -1) {
    localList[existingIdx] = finalPost;
  } else {
    localList.unshift(finalPost);
  }
  saveLocalPosts(localList);

  return {
    ...finalPost,
    firestoreDocId,
    firestoreError
  };
}

/**
 * Update existing post in both Firestore and local storage
 */
export async function updatePost(id, updates) {
  const nowIso = new Date().toISOString();
  const updatePayload = {
    ...updates,
    readingTime: updates.readingTime || Math.max(1, Math.ceil((updates.body || '').split(/\s+/).length / 200)),
    updatedAt: nowIso
  };

  if (updates.status === 'published' && !updates.publishedAt) {
    updatePayload.publishedAt = nowIso;
  }

  let firestoreError = null;

  // If this post was created in Firestore (not a temporary local id)
  if (isFirebaseConfigured && db && !id.startsWith('post-') && !id.startsWith('local-')) {
    try {
      const postRef = doc(db, 'posts', id);
      const firestorePayload = {
        ...updatePayload,
        updatedAt: serverTimestamp(),
        publishedAt: updatePayload.publishedAt ? Timestamp.fromDate(new Date(updatePayload.publishedAt)) : null
      };

      const updatePromise = updateDoc(postRef, firestorePayload);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout: Firestore write blocked')), 6000)
      );

      await Promise.race([updatePromise, timeoutPromise]);
    } catch (err) {
      console.warn('Firestore updateDoc failed or blocked:', err);
      firestoreError = err;
    }
  }

  // Update local cache
  const localList = getLocalPosts();
  const index = localList.findIndex(p => p.id === id);
  if (index !== -1) {
    localList[index] = { ...localList[index], ...updatePayload };
    saveLocalPosts(localList);
  }

  return { id, ...updatePayload, firestoreError };
}

/**
 * Delete or soft-delete a post
 */
export async function deletePost(id, soft = true) {
  let firestoreError = null;

  if (isFirebaseConfigured && db && !id.startsWith('post-') && !id.startsWith('local-')) {
    try {
      const postRef = doc(db, 'posts', id);
      if (soft) {
        await updateDoc(postRef, {
          status: 'deleted',
          deletedAt: serverTimestamp()
        });
      } else {
        await deleteDoc(postRef);
      }
    } catch (err) {
      console.warn('Firestore delete failed or blocked:', err);
      firestoreError = err;
    }
  }

  // Remove or soft delete from local storage
  const list = getLocalPosts();
  const index = list.findIndex(p => p.id === id);
  if (index !== -1) {
    if (soft) {
      list[index].deletedAt = new Date().toISOString();
      list[index].status = 'deleted';
    } else {
      list.splice(index, 1);
    }
    saveLocalPosts(list);
    return true;
  }

  return !firestoreError;
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
