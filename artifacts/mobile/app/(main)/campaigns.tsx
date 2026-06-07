import { useAuth } from "@/context/AuthContext";
import CitizenCampaigns from "@/screens/CitizenCampaigns";
import NgoCampaigns from "@/screens/NgoCampaigns";
import { LoadingScreen } from "@/components/UI";

export default function CampaignsTab() {
  const { user } = useAuth();
  if (!user) return <LoadingScreen />;
  if (user.role === "ngo") return <NgoCampaigns />;
  return <CitizenCampaigns />;
}
