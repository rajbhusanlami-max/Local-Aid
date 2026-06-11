import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseClient";
import {
  Request,
  Campaign,
  Volunteer,
  Notification,
  User,
} from "./types";

function cleanFirestoreData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(cleanFirestoreData).filter((v) => v !== undefined);
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce((acc, [k, v]) => {
      if (v !== undefined) acc[k] = cleanFirestoreData(v as unknown) as unknown;
      return acc;
    }, {} as Record<string, unknown>);
  }
  return value;
}

function cleanPayload<T extends Record<string, unknown>>(payload: T): Record<string, unknown> {
  return cleanFirestoreData(payload) as Record<string, unknown>;
}

async function getCollection<T = any>(collectionName: string): Promise<T[]> {
  const col = collection(db, collectionName);
  const snap = await getDocs(col);
  return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as T) } as unknown as T));
}

async function getDocument<T = any>(collectionName: string, id: string): Promise<T | null> {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) } as unknown as T;
}

async function createDocument<T extends { id?: string }>(collectionName: string, payload: T): Promise<T> {
  const data = cleanPayload(payload as Record<string, unknown>);
  if (payload.id) {
    const ref = doc(db, collectionName, payload.id);
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { id: snap.id, ...(snap.data() as any) } as T;
  }
  const ref = doc(collection(db, collectionName));
  await setDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...(snap.data() as any) } as T;
}

async function updateDocument<T = any>(collectionName: string, id: string, payload: Partial<T>): Promise<T> {
  const data = cleanPayload(payload as Record<string, unknown>);
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, data);
  const snap = await getDoc(ref);
  return { id: snap.id, ...(snap.data() as any) } as unknown as T;
}

async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
}

// Requests
export async function getRequests(): Promise<Request[]> {
  return getCollection<Request>("requests");
}

export async function getRequest(id: string): Promise<Request | null> {
  return getDocument<Request>("requests", id);
}

export async function createRequest(payload: Request): Promise<Request> {
  return createDocument<Request>("requests", payload);
}

export async function updateRequest(id: string, payload: Partial<Request>): Promise<Request> {
  return updateDocument<Request>("requests", id, payload);
}

export async function deleteRequest(id: string): Promise<void> {
  return deleteDocument("requests", id);
}

// Campaigns
export async function getCampaigns(): Promise<Campaign[]> {
  return getCollection<Campaign>("campaigns");
}

export async function createCampaign(payload: Campaign): Promise<Campaign> {
  return createDocument<Campaign>("campaigns", payload as Campaign);
}

export async function updateCampaign(id: string, payload: Partial<Campaign>): Promise<Campaign> {
  return updateDocument<Campaign>("campaigns", id, payload);
}

export async function deleteCampaign(id: string): Promise<void> {
  return deleteDocument("campaigns", id);
}

// Volunteers
export async function getVolunteers(): Promise<Volunteer[]> {
  return getCollection<Volunteer>("volunteers");
}

export async function createVolunteer(payload: Volunteer): Promise<Volunteer> {
  return createDocument<Volunteer>("volunteers", payload);
}

export async function updateVolunteer(id: string, payload: Partial<Volunteer>): Promise<Volunteer> {
  return updateDocument<Volunteer>("volunteers", id, payload);
}

export async function deleteVolunteer(id: string): Promise<void> {
  return deleteDocument("volunteers", id);
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
  return getCollection<Notification>("notifications");
}

export async function createNotification(payload: Notification): Promise<Notification> {
  return createDocument<Notification>("notifications", payload);
}

export async function updateNotification(id: string, payload: Partial<Notification>): Promise<Notification> {
  return updateDocument<Notification>("notifications", id, payload);
}

export async function deleteNotification(id: string): Promise<void> {
  return deleteDocument("notifications", id);
}

// Users
export async function getUsers(): Promise<User[]> {
  return getCollection<User>("users");
}

export async function getUser(id: string): Promise<User | null> {
  return getDocument<User>("users", id);
}

export async function createUser(payload: User): Promise<User> {
  return createDocument<User>("users", payload);
}

export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  return updateDocument<User>("users", id, payload);
}

export async function deleteUser(id: string): Promise<void> {
  return deleteDocument("users", id);
}
