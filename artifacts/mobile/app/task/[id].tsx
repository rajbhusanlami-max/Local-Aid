import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Button, Card, UrgencyBar } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

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

export default function TaskDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { requests, updateRequest } = useData();

  const task = requests.find((r) => r.id === id);

  if (!task) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Task not found.</Text>
      </View>
    );
  }

  const isMyTask = task.assignedVolunteerId === user?.id;
  const canAccept = task.status === "submitted" && !task.assignedVolunteerId;

  const handleAccept = async () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateRequest(task.id, {
      status: "accepted",
      assignedVolunteerId: user?.id,
      timeline: [...task.timeline, { status: "accepted", timestamp: new Date().toISOString(), note: `Accepted by ${user?.name}` }],
    });
    Alert.alert("Task Accepted!", "The citizen has been notified. Check-in when you arrive.");
  };

  const handleCheckIn = async () => {
    await updateRequest(task.id, {
      status: "in_progress",
      timeline: [...task.timeline, { status: "in_progress", timestamp: new Date().toISOString(), note: "Volunteer checked in" }],
    });
    Alert.alert("Checked In!", "Great! The citizen has been notified you've arrived.");
  };

  const handleComplete = () => {
    Alert.alert("Complete Task", "Confirm task completion?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: async () => {
          await updateRequest(task.id, {
            status: "completed",
            timeline: [...task.timeline, { status: "completed", timestamp: new Date().toISOString(), note: "Task completed by volunteer" }],
          });
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Badge label={CATEGORY_LABELS[task.category]} variant="default" />
          <UrgencyBar urgency={task.urgency} />
        </View>

        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 6 }}>
          {task.title}
        </Text>

        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="user" size={13} color={colors.mutedForeground} />
            <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{task.citizenName.split(" ")[0]}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{task.location.district}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Feather name="clock" size={13} color={colors.mutedForeground} />
            <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{timeAgo(task.createdAt)}</Text>
          </View>
        </View>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 8 }}>What's needed</Text>
          <Text style={{ fontSize: 14, color: colors.mutedForeground, lineHeight: 21, fontFamily: "Inter_400Regular" }}>{task.description}</Text>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 10 }}>Location</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ backgroundColor: colors.primary + "15", borderRadius: 10, padding: 10 }}>
              <Feather name="map-pin" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{task.location.address || task.location.district}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{task.location.district}</Text>
            </View>
          </View>
        </Card>

        {task.timeline.length > 0 && (
          <Card style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 12 }}>Timeline</Text>
            {task.timeline.map((entry, idx) => (
              <View key={idx} style={{ flexDirection: "row", gap: 12, marginBottom: idx < task.timeline.length - 1 ? 14 : 0 }}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />
                  {idx < task.timeline.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 }} />}
                </View>
                <View style={{ flex: 1, paddingBottom: idx < task.timeline.length - 1 ? 6 : 0 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{entry.note}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{timeAgo(entry.timestamp)}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }}>
        {canAccept && (
          <Button title="Accept Task" onPress={handleAccept} fullWidth size="lg" icon={<Feather name="check" size={16} color="#fff" />} />
        )}
        {isMyTask && task.status === "accepted" && (
          <Button title="Check In — I've Arrived" onPress={handleCheckIn} fullWidth size="lg" variant="accent" icon={<Feather name="map-pin" size={16} color="#fff" />} />
        )}
        {isMyTask && task.status === "in_progress" && (
          <Button title="Mark as Completed" onPress={handleComplete} fullWidth size="lg" icon={<Feather name="check-circle" size={16} color="#fff" />} />
        )}
        {task.status === "completed" && (
          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={{ fontSize: 15, color: colors.success, fontFamily: "Inter_600SemiBold" }}>Task completed</Text>
          </View>
        )}
      </View>
    </View>
  );
}
