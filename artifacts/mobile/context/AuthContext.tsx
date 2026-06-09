import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type UserRole = "citizen" | "volunteer" | "ngo" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: { lat: number; lng: number; address: string; district: string };
  isVerified: boolean;
  createdAt: string;
  notificationPrefs: {
    statusUpdates: boolean;
    newAssignments: boolean;
    campaigns: boolean;
    digest: boolean;
  };
  privacy?: {
    showActivity: boolean;
    dataSharing: boolean;
    locationVisible: boolean;
  };
  // Volunteer-specific
  skills?: string[];
  serviceRadiusKm?: number;
  isVerifiedByNGO?: boolean;
  completedTaskCount?: number;
  totalHoursContributed?: number;
  rating?: number;
  badges?: string[];
  // NGO-specific
  ngoName?: string;
  ngoDescription?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
}

const STORAGE_KEY = "@localaid_user";
const PASSWORDS_KEY = "@localaid_passwords";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPw: string, newPw: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_PRIVACY = { showActivity: true, dataSharing: false, locationVisible: true };

const SEED_USERS: Record<string, { password: string; user: User }> = {
  "citizen@localaid.np": {
    password: "demo123",
    user: {
      id: "citizen-001",
      name: "Priya Sharma",
      email: "citizen@localaid.np",
      role: "citizen",
      isVerified: true,
      phone: "+977 98-0000-1111",
      createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      location: { lat: 27.7172, lng: 85.3240, address: "Thamel, Kathmandu", district: "Kathmandu" },
      notificationPrefs: { statusUpdates: true, newAssignments: false, campaigns: true, digest: false },
      privacy: { showActivity: true, dataSharing: false, locationVisible: true },
    },
  },
  "volunteer@localaid.np": {
    password: "demo123",
    user: {
      id: "volunteer-001",
      name: "Raj Thapa",
      email: "volunteer@localaid.np",
      role: "volunteer",
      isVerified: true,
      phone: "+977 98-0000-2222",
      createdAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
      location: { lat: 27.7172, lng: 85.3240, address: "Patan, Lalitpur", district: "Lalitpur" },
      skills: ["First Aid", "Elder Care", "Food Distribution", "Education"],
      serviceRadiusKm: 10,
      isVerifiedByNGO: true,
      completedTaskCount: 34,
      totalHoursContributed: 127,
      rating: 4.8,
      badges: ["first_task", "ten_tasks", "fifty_hours"],
      notificationPrefs: { statusUpdates: true, newAssignments: true, campaigns: true, digest: true },
      privacy: { showActivity: true, dataSharing: true, locationVisible: true },
    },
  },
  "ngo@localaid.np": {
    password: "demo123",
    user: {
      id: "ngo-001",
      name: "Sunita Rai",
      email: "ngo@localaid.np",
      role: "ngo",
      isVerified: true,
      phone: "+977 01-4000-001",
      createdAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
      ngoName: "Helping Hands Nepal",
      ngoDescription: "Providing community support across Kathmandu Valley since 2018.",
      approvalStatus: "approved",
      location: { lat: 27.7172, lng: 85.3240, address: "Baluwatar, Kathmandu", district: "Kathmandu" },
      notificationPrefs: { statusUpdates: true, newAssignments: true, campaigns: true, digest: true },
      privacy: { showActivity: true, dataSharing: false, locationVisible: true },
    },
  },
  "admin@localaid.np": {
    password: "demo123",
    user: {
      id: "admin-001",
      name: "Bikash Adhikari",
      email: "admin@localaid.np",
      role: "admin",
      isVerified: true,
      phone: "+977 98-0000-9999",
      createdAt: new Date(Date.now() - 180 * 24 * 3600000).toISOString(),
      notificationPrefs: { statusUpdates: true, newAssignments: true, campaigns: true, digest: true },
      privacy: { showActivity: true, dataSharing: false, locationVisible: false },
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed.privacy) parsed.privacy = DEFAULT_PRIVACY;
          setUser(parsed);
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const seed = SEED_USERS[email.toLowerCase()];
    if (!seed) throw new Error("No account found with that email.");

    const storedPasswords = await AsyncStorage.getItem(PASSWORDS_KEY);
    const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};
    const effectivePassword = passwords[email.toLowerCase()] ?? seed.password;
    if (password !== effectivePassword) throw new Error("Incorrect password.");

    const stored = await AsyncStorage.getItem(`@localaid_profile_${seed.user.id}`);
    const profile = stored ? { ...seed.user, ...JSON.parse(stored) } : { ...seed.user };
    if (!profile.privacy) profile.privacy = DEFAULT_PRIVACY;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      isVerified: false,
      createdAt: new Date().toISOString(),
      notificationPrefs: { statusUpdates: true, newAssignments: false, campaigns: true, digest: false },
      privacy: DEFAULT_PRIVACY,
      ...(role === "volunteer" ? { skills: [], serviceRadiusKm: 5, completedTaskCount: 0, totalHoursContributed: 0, rating: 0, badges: [] } : {}),
      ...(role === "ngo" ? { ngoName: "", approvalStatus: "pending" as const } : {}),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    await AsyncStorage.setItem(`@localaid_profile_${user.id}`, JSON.stringify(updates));
    setUser(updated);
  }, [user]);

  const changePassword = useCallback(async (currentPw: string, newPw: string) => {
    if (!user) throw new Error("Not logged in.");
    const storedPasswords = await AsyncStorage.getItem(PASSWORDS_KEY);
    const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};
    const seed = SEED_USERS[user.email.toLowerCase()];
    const effectivePassword = passwords[user.email.toLowerCase()] ?? seed?.password ?? "";
    if (currentPw !== effectivePassword) throw new Error("Current password is incorrect.");
    if (newPw.length < 6) throw new Error("New password must be at least 6 characters.");
    passwords[user.email.toLowerCase()] = newPw;
    await AsyncStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
