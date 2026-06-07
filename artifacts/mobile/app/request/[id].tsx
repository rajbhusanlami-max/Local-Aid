import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Button, Card, UrgencyBar } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const STATUS_STEPS = ["submitted", "accepted", "in_progress", "completed"];
const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted", accepted: "Accepted", in_progress: "In Progress", completed: "Completed",
};
const CATEGORY_LABELS: Record<string, string> = {
  elderly_care: "Elderly Care", emergency: "Emergency", blood_donation: "Blood Donation",
  welfare: "Welfare", food: "Food", medical: "Medical", shelter: "Shelter", education: "Education", other: "Other",
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

export default function RequestDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { requests, updateRequest, volunteers } = useData();

  const request = requests.find((r) => r.id === id);
  if (!request) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Request not found.</Text>
      </View>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(request.status);
  const assignedVol = volunteers.find((v) => v.id === request.assignedVolunteerId);

  const canCancel = ["submitted", "accepted"].includes(request.status);

  const handleCancel = () => {
    Alert.alert("Cancel Request", "Why are you cancelling?", [
      { text: "No longer needed", onPress: () => updateRequest(request.id, { status: "cancelled" }) },
      { text: "Resolved another way", onPress: () => updateRequest(request.id, { status: "cancelled" }) },
      { text: "Keep request", style: "cancel" },
    ]);
  };

  const STATUS_BADGE: Record<string, { label: string; variant: any }> = {
    submitted: { label: "Submitted", variant: "info" },
    accepted: { label: "Accepted", variant: "accent" },
    in_progress: { label: "In Progress", variant: "warning" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "error" },
  };

  const badgeCfg = STATUS_BADGE[request.status] ?? { label: request.status, variant: "default" };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Badge label={CATEGORY_LABELS[request.category]} variant="default" />
          <Badge label={badgeCfg.label} variant={badgeCfg.variant} />
        </View>

        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 8 }}>
          {request.title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <UrgencyBar urgency={request.urgency} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="map-pin" size={12} color={colors.mutedForeground} />
            <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{request.location.district}</Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{timeAgo(request.createdAt)}</Text>
        </View>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 8 }}>Progress</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <React.Fragment key={step}>
                  <View style={{ alignItems: "center", flex: idx < STATUS_STEPS.length - 1 ? 0 : undefined }}>
                    <View style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: isCompleted ? colors.primary : colors.muted,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: isCurrent ? 2 : 0,
                      borderColor: colors.primary + "60",
                    }}>
                      {isCompleted ? (
                        <Feather name="check" size={13} color="#fff" />
                      ) : (
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mutedForeground }} />
                      )}
                    </View>
                    <Text style={{ fontSize: 9, color: isCompleted ? colors.primary : colors.mutedForeground, fontFamily: "Inter_500Medium", marginTop: 4, textAlign: "center", width: 50 }}>
                      {STATUS_LABELS[step]}
                    </Text>
                  </View>
                  {idx < STATUS_STEPS.length - 1 && (
                    <View style={{ flex: 1, height: 2, backgroundColor: idx < currentStepIdx ? colors.primary : colors.muted, marginBottom: 12 }} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </Card>

        {assignedVol && (
          <Card style={{ marginBottom: 20, borderColor: colors.success + "30", borderWidth: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ backgroundColor: colors.success + "20", borderRadius: 14, padding: 10 }}>
                <Feather name="user" size={18} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Assigned Volunteer</Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{assignedVol.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <Text style={{ fontSize: 12, color: colors.warning, fontFamily: "Inter_500Medium" }}>{assignedVol.rating}★</Text>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>· {assignedVol.completedTaskCount} tasks completed</Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 8 }}>Description</Text>
          <Text style={{ fontSize: 14, color: colors.mutedForeground, lineHeight: 21, fontFamily: "Inter_400Regular" }}>{request.description}</Text>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 12 }}>Timeline</Text>
          {request.timeline.map((entry, idx) => (
            <View key={idx} style={{ flexDirection: "row", gap: 12, marginBottom: idx < request.timeline.length - 1 ? 16 : 0 }}>
              <View style={{ alignItems: "center" }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />
                {idx < request.timeline.length - 1 && (
                  <View style={{ width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 }} />
                )}
              </View>
              <View style={{ flex: 1, paddingBottom: idx < request.timeline.length - 1 ? 8 : 0 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{STATUS_LABELS[entry.status] ?? entry.status}</Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{entry.note}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 }}>{timeAgo(entry.timestamp)}</Text>
              </View>
            </View>
          ))}
        </Card>

        {canCancel && (
          <Button
            title="Cancel Request"
            onPress={handleCancel}
            variant="outline"
            fullWidth
            size="lg"
            style={{ borderColor: colors.destructive }}
            icon={<Feather name="x-circle" size={16} color={colors.destructive} />}
          />
        )}
      </ScrollView>
    </View>
  );
}
