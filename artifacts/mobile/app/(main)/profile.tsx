import { useAuth } from "@/context/AuthContext";
import CitizenProfile from "@/screens/CitizenProfile";
import VolunteerProfile from "@/screens/VolunteerProfile";
import NgoProfile from "@/screens/NgoProfile";
import AdminProfile from "@/screens/AdminProfile";
import { LoadingScreen } from "@/components/UI";

export default function ProfileTab() {
  const { user } = useAuth();
  if (!user) return <LoadingScreen />;
  switch (user.role) {
    case "volunteer": return <VolunteerProfile />;
    case "ngo": return <NgoProfile />;
    case "admin": return <AdminProfile />;
    default: return <CitizenProfile />;
  }
}
