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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SEED_USERS: Record<string, { password: string; user: User }> = {
  "citizen@localaid.np": {
    password: "demo123",
    user: {
      id: "citizen-001",
      name: "Priya Sharma",
      email: "citizen@localaid.np",
      role: "citizen",
      isVerified: true,
      createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      location: { lat: 27.7172, lng: 85.3240, address: "Thamel, Kathmandu", district: "Kathmandu" },
      notificationPrefs: { statusUpdates: true, newAssignments: false, campaigns: true, digest: false },
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
      createdAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
      skills: ["First Aid", "Elder Care", "Food Distribution", "Education"],
      serviceRadiusKm: 10,
      isVerifiedByNGO: true,
      completedTaskCount: 34,
      totalHoursContributed: 127,
      rating: 4.8,
      badges: ["first_task", "ten_tasks", "fifty_hours"],
      notificationPrefs: { statusUpdates: true, newAssignments: true, campaigns: true, digest: true },
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
      createdAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
      ngoName: "Helping Hands Nepal",
      ngoDescription: "Providing community support across Kathmandu Valley since 2018.",
      approvalStatus: "approved",
      notificationPrefs: { statusUpdates: true, newAssignments: true, campaigns: true, digest: true },
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
      createdAt: new Date(Date.now() - 180 * 24 * 3600000).toISOString(),
      notificationPrefs: { statusUpdates: true, newAssignments: true, campaigns: true, digest: true },
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
          setUser(JSON.parse(raw));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const seed = SEED_USERS[email.toLowerCase()];
    if (!seed) throw new Error("No account found with that email.");
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed.user));
    setUser(seed.user);
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
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
