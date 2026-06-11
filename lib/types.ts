export type RequestStatus = "submitted" | "accepted" | "in_progress" | "completed" | "cancelled";
export type RequestCategory =
  | "elderly_care"
  | "emergency"
  | "blood_donation"
  | "welfare"
  | "food"
  | "medical"
  | "shelter"
  | "education"
  | "other";
export type CampaignStatus = "draft" | "published" | "ongoing" | "completed" | "cancelled";

export interface Request {
  id: string;
  citizenId: string;
  citizenName: string;
  title: string;
  description: string;
  category: RequestCategory;
  urgency: 1 | 2 | 3 | 4 | 5;
  status: RequestStatus;
  location: { address: string; district: string };
  photos: string[];
  assignedVolunteerId?: string;
  assignedNgoId?: string;
  timeline: Array<{ status: string; timestamp: string; note: string }>;
  citizenRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  tags: string[];
  eventDate: string;
  location: { address: string; district: string };
  maxVolunteers: number;
  registeredCount: number;
  status: CampaignStatus;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  completedTaskCount: number;
  totalHoursContributed: number;
  rating: number;
  isVerifiedByNGO: boolean;
  badges: string[];
  district: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
