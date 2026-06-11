import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";

function cleanFirestoreData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(cleanFirestoreData)
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, entryValue]) => {
        if (entryValue !== undefined) {
          acc[key] = cleanFirestoreData(entryValue);
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  return value;
}

function cleanPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return cleanFirestoreData(payload) as Record<string, unknown>;
}

async function getCollection(collectionName: string): Promise<any[]> {
  const collectionRef = collection(firestore, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((docSnapshot: any) => ({ id: docSnapshot.id, ...(docSnapshot.data() as any) }));
}

async function createDocument(collectionName: string, payload: Record<string, unknown>): Promise<any> {
  const data = cleanPayload(payload);
  const collectionRef = collection(firestore, collectionName);

  if (typeof payload.id === "string") {
    const documentRef = doc(collectionRef, payload.id);
    await setDoc(documentRef, data, { merge: true });
    return { id: payload.id, ...data };
  }

  const documentRef = doc(collectionRef);
  await setDoc(documentRef, data);
  return { id: documentRef.id, ...data };
}

async function updateDocument(collectionName: string, id: string, payload: Record<string, unknown>): Promise<any> {
  const data = cleanPayload(payload);
  const documentRef = doc(firestore, collectionName, id);
  await updateDoc(documentRef, data);
  const snapshot = await getDoc(documentRef);
  return { id: snapshot.id, ...(snapshot.data() as any) };
}

export async function getRequests(): Promise<any[]> {
  return getCollection("requests");
}

export async function getCampaigns(): Promise<any[]> {
  return getCollection("campaigns");
}

export async function getVolunteers(): Promise<any[]> {
  return getCollection("volunteers");
}

export async function getNotifications(): Promise<any[]> {
  return getCollection("notifications");
}

export async function createRequest(payload: unknown): Promise<any> {
  return createDocument("requests", payload as Record<string, unknown>);
}

export async function updateRequest(id: string, payload: unknown): Promise<any> {
  return updateDocument("requests", id, payload as Record<string, unknown>);
}

export async function createCampaign(payload: unknown): Promise<any> {
  return createDocument("campaigns", payload as Record<string, unknown>);
}

export async function updateNotification(id: string, payload: unknown): Promise<any> {
  return updateDocument("notifications", id, payload as Record<string, unknown>);
}
