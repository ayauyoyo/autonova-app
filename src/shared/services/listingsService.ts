import { db } from '../../config/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import type { Listing } from '../data/types';

const COL = 'listings';

export function subscribeToListings(callback: (listings: Listing[]) => void): () => void {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const listings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
    callback(listings);
  });
}

export async function addListingFS(data: Omit<Listing, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateListingFS(id: string, patch: Partial<Listing>): Promise<void> {
  await updateDoc(doc(db, COL, id), patch as Record<string, unknown>);
}

export async function deleteListingFS(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}