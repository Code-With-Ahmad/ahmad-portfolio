import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

// ---- content/about & content/site (singleton docs) ----

export function subscribeAbout(callback) {
  return onSnapshot(doc(db, 'content', 'about'), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

export async function updateAbout(data) {
  await setDoc(doc(db, 'content', 'about'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export function subscribeSite(callback) {
  return onSnapshot(doc(db, 'content', 'site'), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

export async function updateSite(data) {
  await setDoc(doc(db, 'content', 'site'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ---- generic ordered-collection helpers (skills, experience, projects) ----

function makeCollectionApi(collectionName, { orderByFields = ['order'] } = {}) {
  const colRef = collection(db, collectionName);

  function subscribeAll(callback) {
    const q = query(colRef, ...orderByFields.map((f) => orderBy(f)));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }

  async function getAll() {
    const q = query(colRef, ...orderByFields.map((f) => orderBy(f)));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async function add(data) {
    return addDoc(colRef, data);
  }

  async function update(id, data) {
    await updateDoc(doc(db, collectionName, id), data);
  }

  async function remove(id) {
    await deleteDoc(doc(db, collectionName, id));
  }

  async function reorder(items) {
    const batch = writeBatch(db);
    items.forEach((item, index) => {
      batch.update(doc(db, collectionName, item.id), { order: index });
    });
    await batch.commit();
  }

  return { subscribeAll, getAll, add, update, remove, reorder };
}

// Ordered by `order` alone (not `category` + `order`) so this never needs a
// Firestore composite index. Grouping by category happens client-side
// (see groupByCategory in Skills.jsx / SkillsEditor.jsx); relative order
// within each category is still correct since `order` values are assigned
// per-category when a skill is added or reordered.
export const skillsApi = makeCollectionApi('skills', { orderByFields: ['order'] });
export const experienceApi = makeCollectionApi('experience', { orderByFields: ['order'] });
export const projectsApi = makeCollectionApi('projects', { orderByFields: ['order'] });

export async function getProjectBySlug(slug) {
  const q = query(collection(db, 'projects'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function getDocById(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
