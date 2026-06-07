import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Request, RequestCategory } from "@/context/DataContext";
import { Badge, Card, UrgencyBar } from "./UI";

const CATEGORY_ICONS: Record<RequestCategory, { icon: string; lib: "Feather" | "MaterialCommunityIcons" }> = {
  elderly_care: { icon: "heart", lib: "Feather" },
  emergency: { icon: "alert-triangle", lib: "Feather" },
  blood_donation: { icon: "droplet", lib: "Feather" },
  welfare: { icon: "home", lib: "Feather" },
  food: { icon: "coffee", lib: "Feather" },
  medical: { icon: "activity", lib: "Feather" },
  shelter: { icon: "home", lib: "Feather" },
  education: { icon: "book", lib: "Feather" },
  other: { icon: "help-circle", lib: "Feather" },
};

const CATEGORY_LABELS: Record<RequestCategory, string> = {
  elderly_care: "Elderly Care",
  emergency: "Emergency",
  blood_donation: "Blood Donation",
  welfare: "Welfare",
  food: "Food",
  medical: "Medical",
  shelter: "Shelter",
  education: "Education",
  other: "Other",
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" | "info" | "accent" }> = {
  submitted: { label: "Submitted", variant: "info" },
  accepted: { label: "Accepted", variant: "accent" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

interface RequestCardProps {
  request: Request;
  showAssign?: boolean;
  onAssign?: () => void;
  compact?: boolean;
}

export default function RequestCard({ request, compact = false }: RequestCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { label, variant } = STATUS_CONFIG[request.status] ?? { label: request.status, variant: "default" as const };
  const { icon } = CATEGORY_ICONS[request.category] ?? CATEGORY_ICONS.other;

  return (
    <Card onPress={() => router.push(`/request/${request.id}` as any)} style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
          <View style={{ backgroundColor: colors.primary + "15", borderRadius: 10, padding: 8 }}>
            <Feather name={icon as any} size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>
              {request.title}
            </Text>
            <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
              {CATEGORY_LABELS[request.category]} · {timeAgo(request.createdAt)}
            </Text>
          </View>
        </View>
        <Badge label={label} variant={variant} />
      </View>

      {!compact && (
        <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 10, fontFamily: "Inter_400Regular" }} numberOfLines={2}>
          {request.description}
        </Text>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Feather name="map-pin" size={11} color={colors.mutedForeground} />
          <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{request.location.district}</Text>
        </View>
        <UrgencyBar urgency={request.urgency} />
      </View>
    </Card>
  );
}
