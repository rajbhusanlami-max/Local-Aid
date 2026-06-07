import { useAuth } from "@/context/AuthContext";
import CitizenRequests from "@/screens/CitizenRequests";
import NgoRequestTriage from "@/screens/NgoRequestTriage";
import AdminAllRequests from "@/screens/AdminAllRequests";
import { LoadingScreen } from "@/components/UI";

export default function RequestsTab() {
  const { user } = useAuth();
  if (!user) return <LoadingScreen />;
  switch (user.role) {
    case "ngo": return <NgoRequestTriage />;
    case "admin": return <AdminAllRequests />;
    default: return <CitizenRequests />;
  }
}
