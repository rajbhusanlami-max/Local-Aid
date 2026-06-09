import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Card, SectionHeader, StatCard } from "@/components/UI";
import TaskCard from "@/components/TaskCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const BADGES_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  first_task: { label: "First Step", icon: "star", color: "#F59E0B" },
  ten_tasks: { label: "10 Tasks", icon: "award", color: "#8B5CF6" },
  fifty_hours: { label: "50 Hours", icon: "clock", color: "#06B6D4" },
  hundred_hours: { label: "100 Hours", icon: "zap", color: "#EF4444" },
};

export default function VolunteerHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { requests, notifications } = useData();

  const myTasks = requests.filter((r) => r.assignedVolunteerId === user?.id);
  const activeTasks = myTasks.filter((r) => ["accepted", "in_progress"].includes(r.status));
  const openTasks = requests.filter((r) => r.status === "submitted" && !r.assignedVolunteerId);
  const unread = notifications.filter((n) => n.userId === user?.id && !n.read).length;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.info, colors.info + "CC"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 28, paddingHorizontal: 20 }}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Volunteer</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>
                {user?.name?.split(" ")[0]}
              </Text>
              {user?.isVerifiedByNGO && (
                <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <Feather name="shield" size={10} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" }}>Verified</Text>
                </View>
              )}
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable onPress={() => router.push("/(main)/notifications")} style={{ position: "relative" }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 10 }}>
                <Feather name="bell" size={20} color="#fff" />
              </View>
              {unread > 0 && (
                <View style={{ position: "absolute", top: -2, right: -2, backgroundColor: colors.accent, borderRadius: 10, minWidth: 18, height: 18, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.info }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold" }}>{unread}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/(main)/profile")} style={{ borderRadius: 21, borderWidth: 2, borderColor: "rgba(255,255,255,0.5)" }}>
              <Avatar name={user?.name ?? "V"} size={38} role="volunteer" />
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user?.completedTaskCount ?? 0}</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Tasks Done</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user?.totalHoursContributed ?? 0}h</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Hours Given</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user?.rating?.toFixed(1) ?? "—"}</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Rating</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {(user?.badges?.length ?? 0) > 0 && (
          <>
            <SectionHeader title="Your Badges" action={{ label: "View all", onPress: () => router.push("/(main)/impact") }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: "row", gap: 10, paddingRight: 20 }}>
                {(user?.badges ?? []).map((badgeKey) => {
                  const cfg = BADGES_CONFIG[badgeKey] ?? { label: badgeKey, icon: "star", color: colors.primary };
                  return (
                    <View key={badgeKey} style={{ alignItems: "center", gap: 6 }}>
                      <View style={{ backgroundColor: cfg.color + "20", borderRadius: 20, padding: 14, borderWidth: 2, borderColor: cfg.color + "40" }}>
                        <Feather name={cfg.icon as any} size={22} color={cfg.color} />
                      </View>
                      <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_500Medium", textAlign: "center" }}>{cfg.label}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </>
        )}

        {activeTasks.length > 0 && (
          <>
            <SectionHeader title="Active Tasks" action={{ label: "View all", onPress: () => router.push("/(main)/tasks") }} />
            {activeTasks.slice(0, 2).map((task) => (
              <TaskCard key={task.id} task={task} isAssigned />
            ))}
          </>
        )}

        <SectionHeader
          title="Available Tasks Nearby"
          action={{ label: "View all", onPress: () => router.push("/(main)/tasks") }}
        />
        {openTasks.length === 0 ? (
          <Card style={{ alignItems: "center", padding: 24 }}>
            <Feather name="check-circle" size={32} color={colors.success} />
            <Text style={{ fontSize: 14, color: colors.mutedForeground, marginTop: 8, fontFamily: "Inter_400Regular" }}>All tasks covered right now!</Text>
          </Card>
        ) : (
          openTasks.slice(0, 3).map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </ScrollView>
    </View>
  );
}
