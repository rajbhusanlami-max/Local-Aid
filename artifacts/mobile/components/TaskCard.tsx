import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Request } from "@/context/DataContext";
import { Badge, Button, Card, UrgencyBar } from "./UI";

const CATEGORY_LABELS: Record<string, string> = {
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

const CATEGORY_ICONS: Record<string, string> = {
  elderly_care: "heart",
  emergency: "alert-triangle",
  blood_donation: "droplet",
  welfare: "home",
  food: "coffee",
  medical: "activity",
  shelter: "home",
  education: "book",
  other: "help-circle",
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

interface TaskCardProps {
  task: Request;
  onAccept?: () => void;
  onUpdateStatus?: () => void;
  isAssigned?: boolean;
}

export default function TaskCard({ task, onAccept, onUpdateStatus, isAssigned = false }: TaskCardProps) {
  const colors = useColors();
  const router = useRouter();

  const handleAccept = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAccept?.();
  };

  const icon = CATEGORY_ICONS[task.category] ?? "help-circle";

  const distanceLabel = ["1.2 km", "2.4 km", "0.8 km", "3.1 km", "1.7 km"][task.urgency - 1];

  return (
    <Card onPress={() => router.push(`/task/${task.id}` as any)} style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <View style={{ backgroundColor: colors.primary + "15", borderRadius: 12, padding: 10 }}>
          <Feather name={icon as any} size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
            {CATEGORY_LABELS[task.category]} · {task.citizenName.split(" ")[0]}
          </Text>
        </View>
        <UrgencyBar urgency={task.urgency} />
      </View>

      <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 10, fontFamily: "Inter_400Regular" }} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{task.location.district}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="navigation" size={11} color={colors.primary} />
            <Text style={{ fontSize: 11, color: colors.primary, fontFamily: "Inter_500Medium" }}>{distanceLabel}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{timeAgo(task.createdAt)}</Text>
          </View>
        </View>
        {isAssigned ? (
          <Button title="Update" onPress={onUpdateStatus ?? (() => {})} size="sm" variant="outline" />
        ) : (
          <Button title="Accept" onPress={handleAccept} size="sm" />
        )}
      </View>
    </Card>
  );
}
