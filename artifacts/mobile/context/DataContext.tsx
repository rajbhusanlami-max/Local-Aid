import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Request, Campaign, Volunteer, Notification } from "@/lib/types";
export type { Request, Campaign, Volunteer, Notification } from "@/lib/types";
export type { RequestCategory, RequestStatus, CampaignStatus } from "@/lib/types";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface DataContextType {
  requests: Request[];
  campaigns: Campaign[];
  volunteers: Volunteer[];
  notifications: Notification[];
  addRequest: (req: Omit<Request, "id" | "createdAt" | "updatedAt" | "timeline">) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
  addCampaign: (camp: Omit<Campaign, "id" | "createdAt">) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

const SEED_REQUESTS: Request[] = [
  {
    id: "req-001",
    citizenId: "citizen-001",
    citizenName: "Priya Sharma",
    title: "Need help with grocery shopping",
    description: "I am elderly and need assistance with weekly grocery shopping. I live on the 3rd floor without elevator access.",
    category: "elderly_care",
    urgency: 3,
    status: "in_progress",
    location: { address: "Thamel, Kathmandu", district: "Kathmandu" },
    photos: [],
    assignedVolunteerId: "volunteer-001",
    assignedNgoId: "ngo-001",
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), note: "Request submitted" },
      { status: "accepted", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), note: "Accepted by Helping Hands Nepal" },
      { status: "in_progress", timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), note: "Volunteer on the way" },
    ],
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "req-002",
    citizenId: "other-001",
    citizenName: "Hari Bahadur",
    title: "Blood donation needed urgently — O+",
    description: "Patient at Bir Hospital needs O+ blood transfusion for surgery scheduled tomorrow morning.",
    category: "blood_donation",
    urgency: 5,
    status: "submitted",
    location: { address: "Bir Hospital, Kathmandu", district: "Kathmandu" },
    photos: [],
    assignedVolunteerId: undefined,
    assignedNgoId: "ngo-001",
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 30 * 60000).toISOString(), note: "Request submitted" },
    ],
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "req-003",
    citizenId: "other-002",
    citizenName: "Gita Poudel",
    title: "Food assistance for family of 5",
    description: "Lost job last month, need food support for family including 3 children aged 4-12.",
    category: "food",
    urgency: 4,
    status: "accepted",
    location: { address: "Lalitpur, Patan", district: "Lalitpur" },
    photos: [],
    assignedVolunteerId: "volunteer-001",
    assignedNgoId: "ngo-001",
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), note: "Request submitted" },
      { status: "accepted", timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), note: "Assigned to Raj Thapa" },
    ],
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "req-004",
    citizenId: "other-003",
    citizenName: "Bimala Khadka",
    title: "Math tutoring for grade 10 student",
    description: "My daughter is preparing for SEE exams and needs math tutoring 3 times per week.",
    category: "education",
    urgency: 2,
    status: "completed",
    location: { address: "Bhaktapur", district: "Bhaktapur" },
    photos: [],
    assignedVolunteerId: "volunteer-001",
    assignedNgoId: "ngo-001",
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 10 * 24 * 3600000).toISOString(), note: "Request submitted" },
      { status: "accepted", timestamp: new Date(Date.now() - 9 * 24 * 3600000).toISOString(), note: "Assigned volunteer" },
      { status: "in_progress", timestamp: new Date(Date.now() - 8 * 24 * 3600000).toISOString(), note: "Tutoring started" },
      { status: "completed", timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), note: "Successfully completed" },
    ],
    citizenRating: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: "req-005",
    citizenId: "other-004",
    citizenName: "Mohan Lal",
    title: "Medical escort to hospital",
    description: "Need someone to accompany my elderly mother (70) to TUTH for a follow-up appointment on Friday.",
    category: "medical",
    urgency: 3,
    status: "submitted",
    location: { address: "Maharajgunj, Kathmandu", district: "Kathmandu" },
    photos: [],
    assignedVolunteerId: undefined,
    assignedNgoId: undefined,
    timeline: [
      { status: "submitted", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), note: "Request submitted" },
    ],
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-001",
    ngoId: "ngo-001",
    ngoName: "Helping Hands Nepal",
    title: "Winter Blanket Distribution Drive",
    description: "Distributing warm blankets to homeless and low-income families across Kathmandu Valley before winter.",
    tags: ["welfare", "winter", "distribution"],
    eventDate: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    location: { address: "Basantapur Durbar Square", district: "Kathmandu" },
    maxVolunteers: 50,
    registeredCount: 23,
    status: "published",
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
  {
    id: "camp-002",
    ngoId: "ngo-001",
    ngoName: "Helping Hands Nepal",
    title: "Free Health Camp — Lalitpur",
    description: "Free medical check-ups, blood pressure screening, and health consultations for all community members.",
    tags: ["medical", "health", "community"],
    eventDate: new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
    location: { address: "Patan Dhoka, Lalitpur", district: "Lalitpur" },
    maxVolunteers: 30,
    registeredCount: 12,
    status: "published",
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
  {
    id: "camp-003",
    ngoId: "ngo-002",
    ngoName: "Green Future Nepal",
    title: "Bagmati River Cleanup",
    description: "Join us to clean the banks of Bagmati River. Equipment and refreshments provided.",
    tags: ["environment", "community", "cleanup"],
    eventDate: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
    location: { address: "Sankhamul, Bagmati Bridge", district: "Kathmandu" },
    maxVolunteers: 100,
    registeredCount: 67,
    status: "published",
    createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
];

const SEED_VOLUNTEERS: Volunteer[] = [
  {
    id: "volunteer-001",
    name: "Raj Thapa",
    email: "raj@example.com",
    skills: ["First Aid", "Elder Care", "Food Distribution"],
    completedTaskCount: 34,
    totalHoursContributed: 127,
    rating: 4.8,
    isVerifiedByNGO: true,
    badges: ["first_task", "ten_tasks", "fifty_hours"],
    district: "Kathmandu",
  },
  {
    id: "volunteer-002",
    name: "Anita Gurung",
    email: "anita@example.com",
    skills: ["Education", "Tutoring", "Youth Programs"],
    completedTaskCount: 21,
    totalHoursContributed: 85,
    rating: 4.9,
    isVerifiedByNGO: true,
    badges: ["first_task", "ten_tasks"],
    district: "Lalitpur",
  },
  {
    id: "volunteer-003",
    name: "Sanjay Magar",
    email: "sanjay@example.com",
    skills: ["Medical", "Blood Donation", "Elder Care"],
    completedTaskCount: 45,
    totalHoursContributed: 203,
    rating: 4.7,
    isVerifiedByNGO: true,
    badges: ["first_task", "ten_tasks", "fifty_hours", "hundred_hours"],
    district: "Bhaktapur",
  },
  {
    id: "volunteer-004",
    name: "Deepa Shrestha",
    email: "deepa@example.com",
    skills: ["Food Distribution", "Welfare", "Admin"],
    completedTaskCount: 12,
    totalHoursContributed: 41,
    rating: 4.6,
    isVerifiedByNGO: false,
    badges: ["first_task"],
    district: "Kathmandu",
  },
  {
    id: "volunteer-005",
    name: "Bikash Tamang",
    email: "bikash@example.com",
    skills: ["Construction", "Shelter", "Emergency"],
    completedTaskCount: 7,
    totalHoursContributed: 28,
    rating: 4.5,
    isVerifiedByNGO: false,
    badges: ["first_task"],
    district: "Kathmandu",
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    userId: "citizen-001",
    type: "status_update",
    title: "Request Update",
    message: "Your request 'Need help with grocery shopping' has been accepted.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "notif-002",
    userId: "citizen-001",
    type: "volunteer_matched",
    title: "Volunteer Assigned",
    message: "Raj Thapa will help you with your request. Expected arrival in 1 hour.",
    read: false,
    createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
  },
  {
    id: "notif-003",
    userId: "citizen-001",
    type: "new_campaign",
    title: "New Campaign Nearby",
    message: "Winter Blanket Distribution Drive is happening in Kathmandu next week.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "notif-004",
    userId: "volunteer-001",
    type: "task_assigned",
    title: "New Task Assigned",
    message: "You have been assigned to help Gita Poudel with food assistance.",
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "notif-005",
    userId: "volunteer-001",
    type: "certificate_ready",
    title: "Certificate Ready!",
    message: "Your 30-task milestone certificate is ready to download.",
    read: false,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(SEED_REQUESTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(SEED_VOLUNTEERS);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  useEffect(() => {
    // set up real-time listeners for core collections
    const unsubRequests = onSnapshot(collection(db, "requests"), (snap: any) => {
      const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as Request[];
      setRequests(docs.length ? docs : SEED_REQUESTS);
    }, (err: any) => console.warn("requests snapshot error", err));

    const unsubCampaigns = onSnapshot(collection(db, "campaigns"), (snap: any) => {
      const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as Campaign[];
      setCampaigns(docs.length ? docs : SEED_CAMPAIGNS);
    }, (err: any) => console.warn("campaigns snapshot error", err));

    const unsubVolunteers = onSnapshot(collection(db, "volunteers"), (snap: any) => {
      const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as Volunteer[];
      setVolunteers(docs.length ? docs : SEED_VOLUNTEERS);
    }, (err: any) => console.warn("volunteers snapshot error", err));

    const unsubNotifications = onSnapshot(collection(db, "notifications"), (snap: any) => {
      const docs = snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })) as Notification[];
      setNotifications(docs.length ? docs : SEED_NOTIFICATIONS);
    }, (err: any) => console.warn("notifications snapshot error", err));

    return () => {
      unsubRequests();
      unsubCampaigns();
      unsubVolunteers();
      unsubNotifications();
    };
  }, []);

  const addRequest = useCallback(async (req: Omit<Request, "id" | "createdAt" | "updatedAt" | "timeline">) => {
    const now = new Date().toISOString();
    const newReq: Request = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      timeline: [{ status: "submitted", timestamp: now, note: "Request submitted" }],
    };

    try {
      const persisted = await api.createRequest({ ...newReq, status: "submitted" });
      setRequests((prev) => [persisted, ...prev]);
    } catch (error) {
      console.warn("[DataProvider] addRequest API failed, using local state:", error);
      setRequests((prev) => [newReq, ...prev]);
    }
  }, []);

  const updateRequest = useCallback(async (id: string, updates: Partial<Request>) => {
    const now = new Date().toISOString();
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: now } : r)));
    try {
      await api.updateRequest(id, { ...updates, updatedAt: now });
    } catch (error) {
      console.warn("[DataProvider] updateRequest API failed:", error);
    }
  }, []);

  const addCampaign = useCallback(async (camp: Omit<Campaign, "id" | "createdAt">) => {
    const newCamp: Campaign = { ...camp, id: `camp-${Date.now()}`, createdAt: new Date().toISOString() };
    try {
      const persisted = await api.createCampaign(newCamp);
      setCampaigns((prev) => [persisted, ...prev]);
    } catch (error) {
      console.warn("[DataProvider] addCampaign API failed, using local state:", error);
      setCampaigns((prev) => [newCamp, ...prev]);
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.updateNotification(id, { read: true });
    } catch (error) {
      console.warn("[DataProvider] markNotificationRead API failed:", error);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => {
      const unread = prev.filter((n) => !n.read);
      if (unread.length) {
        void Promise.all(unread.map((n) => api.updateNotification(n.id, { read: true })));
      }
      return prev.map((n) => ({ ...n, read: true }));
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        requests,
        campaigns,
        volunteers,
        notifications,
        addRequest,
        updateRequest,
        addCampaign,
        markNotificationRead,
        markAllRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
