import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Button, Card, EmptyState, TagChip, UrgencyBar } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["Pending", "In Progress", "All"];

const CATEGORY_LABELS: Record<string, string> = {
  elderly_care: "Elderly Care", emergency: "Emergency", blood_donation: "Blood Donation",
  welfare: "Welfare", food: "Food", medical: "Medical", shelter: "Shelter", education: "Education", other: "Other",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default function NgoRequestTriage() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { requests, volunteers, updateRequest } = useData();
  const [tab, setTab] = useState("Pending");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = requests.filter((r) => {
    if (tab === "Pending") return r.status === "submitted";
    if (tab === "In Progress") return ["accepted", "in_progress"].includes(r.status);
    return true;
  }).sort((a, b) => b.urgency - a.urgency);

  const handleAssign = (requestId: string) => {
    const available = volunteers.filter((v) => v.isVerifiedByNGO);
    Alert.alert("Assign Volunteer", "Select a volunteer:", [
      ...available.slice(0, 3).map((v) => ({
        text: `${v.name} (${v.rating}★)`,
        onPress: () => {
          updateRequest(requestId, {
            status: "accepted",
            assignedVolunteerId: v.id,
            timeline: [
              ...(requests.find((r) => r.id === requestId)?.timeline ?? []),
              { status: "accepted", timestamp: new Date().toISOString(), note: `Assigned to ${v.name}` },
            ],
          });
        },
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>Request Triage</Text>
          {requests.filter((r) => r.status === "submitted").length > 0 && (
            <View style={{ backgroundColor: colors.accent + "20", borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 12, color: colors.accent, fontFamily: "Inter_600SemiBold" }}>
                {requests.filter((r) => r.status === "submitted").length} pending
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {TABS.map((t) => <TagChip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />)}
        </View>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="All clear"
          description="No requests in this category right now."
          icon={<Feather name="check-circle" size={32} color={colors.success} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {tab === "Pending" && filtered.length > 1 && (
            <Button
              title="Assign All AI Recommended"
              onPress={() => Alert.alert("AI Assign", "All requests will be auto-assigned based on volunteer availability and skills.")}
              variant="secondary"
              fullWidth
              size="sm"
              style={{ marginBottom: 12 }}
              icon={<Feather name="zap" size={14} color={colors.primary} />}
            />
          )}

          {filtered.map((req) => (
            <Card key={req.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>
                    {req.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
                    {CATEGORY_LABELS[req.category]} · {req.citizenName.split(" ")[0]} · {timeAgo(req.createdAt)}
                  </Text>
                </View>
                <UrgencyBar urgency={req.urgency} />
              </View>

              <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 10, fontFamily: "Inter_400Regular" }} numberOfLines={2}>
                {req.description}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{req.location.district}</Text>
                </View>
                {req.status === "submitted" ? (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Button title="Decline" onPress={() => Alert.alert("Decline", "Mark as unable to assist?")} size="sm" variant="ghost" />
                    <Button title="Assign" onPress={() => handleAssign(req.id)} size="sm" />
                  </View>
                ) : (
                  <Badge label={req.status.replace("_", " ")} variant={req.status === "in_progress" ? "warning" : "info"} />
                )}
              </View>

              {req.assignedVolunteerId && (
                <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.success + "10", borderRadius: 8, padding: 8 }}>
                  <Feather name="user-check" size={12} color={colors.success} />
                  <Text style={{ fontSize: 12, color: colors.success, fontFamily: "Inter_500Medium" }}>
                    Assigned to {volunteers.find((v) => v.id === req.assignedVolunteerId)?.name ?? "Volunteer"}
                  </Text>
                </View>
              )}
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
