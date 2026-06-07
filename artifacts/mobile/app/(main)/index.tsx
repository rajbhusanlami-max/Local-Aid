import { useAuth } from "@/context/AuthContext";
import CitizenHome from "@/screens/CitizenHome";
import VolunteerHome from "@/screens/VolunteerHome";
import NgoHome from "@/screens/NgoHome";
import AdminHome from "@/screens/AdminHome";
import { LoadingScreen } from "@/components/UI";

export default function HomeTab() {
  const { user } = useAuth();
  if (!user) return <LoadingScreen />;
  switch (user.role) {
    case "volunteer": return <VolunteerHome />;
    case "ngo": return <NgoHome />;
    case "admin": return <AdminHome />;
    default: return <CitizenHome />;
  }
}
