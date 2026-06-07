import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState, TagChip } from "@/components/UI";
import TaskCard from "@/components/TaskCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["Available", "My Tasks", "Completed"];

export default function VolunteerTasks() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { requests, updateRequest } = useData();
  const [tab, setTab] = useState("Available");

  const available = requests.filter((r) => r.status === "submitted" && !r.assignedVolunteerId);
  const myTasks = requests.filter((r) => r.assignedVolunteerId === user?.id && ["accepted", "in_progress"].includes(r.status));
  const completed = requests.filter((r) => r.assignedVolunteerId === user?.id && r.status === "completed");

  const shown = tab === "Available" ? available : tab === "My Tasks" ? myTasks : completed;
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleAccept = async (taskId: string) => {
    await updateRequest(taskId, {
      status: "accepted",
      assignedVolunteerId: user?.id,
      timeline: [
        ...(requests.find((r) => r.id === taskId)?.timeline ?? []),
        { status: "accepted", timestamp: new Date().toISOString(), note: `Accepted by ${user?.name}` },
      ],
    });
    Alert.alert("Task Accepted!", "The citizen has been notified. Check-in when you arrive.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>Tasks</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {TABS.map((t) => (
            <TagChip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
          ))}
        </View>
      </View>

      {shown.length === 0 ? (
        <EmptyState
          title={tab === "Available" ? "No tasks available" : tab === "My Tasks" ? "No active tasks" : "No completed tasks"}
          description={
            tab === "Available"
              ? "All nearby requests are covered. Check back soon or expand your service radius."
              : tab === "My Tasks"
              ? "Accept a task from the Available tab to get started."
              : "Your completed tasks will appear here."
          }
          icon={<Feather name={tab === "Completed" ? "check-circle" : "clipboard"} size={32} color={colors.mutedForeground} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {tab === "Available" && (
            <View style={{ backgroundColor: colors.primary + "10", borderRadius: 10, padding: 12, flexDirection: "row", gap: 8, marginBottom: 16, alignItems: "center" }}>
              <Feather name="zap" size={14} color={colors.primary} />
              <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_500Medium", flex: 1 }}>
                Tasks are ranked by distance and skill match. Top picks for you first.
              </Text>
            </View>
          )}
          {shown.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isAssigned={tab === "My Tasks"}
              onAccept={() => handleAccept(task.id)}
              onUpdateStatus={() => Alert.alert("Update Status", "Select new status:", [
                { text: "In Progress", onPress: () => updateRequest(task.id, { status: "in_progress" }) },
                { text: "Completed", onPress: () => updateRequest(task.id, { status: "completed" }) },
                { text: "Cancel", style: "cancel" },
              ])}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
