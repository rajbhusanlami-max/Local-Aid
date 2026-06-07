import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Card, SectionHeader, StatCard } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const AI_DIGEST = `This week, LocalAid processed 47 new requests across Kathmandu Valley. Blood donation and elderly care continue to be the highest-demand categories (38%). Volunteer engagement is up 12% vs last week. 3 NGOs have pending approval. Capacity utilization is at 71% — recommend activating 5-7 more verified volunteers in Lalitpur district to address growing backlog.`;

const ANOMALIES = [
  { level: "warning", message: "Lalitpur district showing 34% higher request volume than average", time: "2h ago" },
  { level: "info", message: "3 NGO registrations awaiting Super Admin approval", time: "5h ago" },
];

export default function AdminHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { requests, campaigns, volunteers, notifications } = useData();

  const pending = requests.filter((r) => r.status === "submitted").length;
  const active = requests.filter((r) => ["accepted", "in_progress"].includes(r.status)).length;
  const completed = requests.filter((r) => r.status === "completed").length;
  const unread = notifications.filter((n) => !n.read).length;
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#1E1E2E", "#2D1A3E"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 28, paddingHorizontal: 20 }}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 10 }}>
              <Feather name="shield" size={22} color="#fff" />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" }}>Super Admin</Text>
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>
                {user?.name?.split(" ")[0]}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.push("/(main)/notifications")}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 10, position: "relative" }}>
              <Feather name="bell" size={20} color="#fff" />
              {unread > 0 && (
                <View style={{ position: "absolute", top: -2, right: -2, backgroundColor: colors.destructive, borderRadius: 10, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 9, fontFamily: "Inter_700Bold" }}>{unread}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {[
            { label: "Total Requests", value: requests.length, color: "#A78BFA" },
            { label: "Active Today", value: active, color: "#34D399" },
            { label: "Pending", value: pending, color: "#F87171" },
            { label: "Resolved", value: completed, color: "#60A5FA" },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 10, alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: stat.color, fontFamily: "Inter_700Bold" }}>{stat.value}</Text>
              <Text style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular", textAlign: "center" }}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ marginBottom: 24, borderColor: colors.primary + "30", borderWidth: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <View style={{ backgroundColor: colors.primary + "20", borderRadius: 10, padding: 8 }}>
              <Feather name="zap" size={16} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>AI Weekly Digest</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 20, fontFamily: "Inter_400Regular" }}>
            {AI_DIGEST}
          </Text>
        </Card>

        <SectionHeader title="Anomaly Alerts" />
        {ANOMALIES.map((alert, idx) => (
          <Card key={idx} style={{ marginBottom: 10, borderColor: alert.level === "warning" ? colors.warning + "40" : colors.info + "40", borderWidth: 1 }}>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
              <View style={{ backgroundColor: (alert.level === "warning" ? colors.warning : colors.info) + "20", borderRadius: 8, padding: 7 }}>
                <Feather name={alert.level === "warning" ? "alert-triangle" : "info"} size={14} color={alert.level === "warning" ? colors.warning : colors.info} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium", lineHeight: 18 }}>{alert.message}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 4, fontFamily: "Inter_400Regular" }}>{alert.time}</Text>
              </View>
            </View>
          </Card>
        ))}

        <SectionHeader
          title="Platform Overview"
          action={{ label: "Full Analytics", onPress: () => router.push("/(main)/analytics") }}
        />
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <StatCard label="NGOs Active" value={2} icon={<Feather name="briefcase" size={14} color={colors.accent} />} color={colors.accent} />
          <StatCard label="Volunteers" value={volunteers.length} icon={<Feather name="users" size={14} color={colors.info} />} color={colors.info} />
        </View>

        <SectionHeader title="Recent Activity" />
        {requests.slice(0, 3).map((req) => (
          <Card key={req.id} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ backgroundColor: colors.muted, borderRadius: 10, padding: 7 }}>
                <Feather name="file-text" size={14} color={colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }} numberOfLines={1}>{req.title}</Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{req.citizenName} · {req.status}</Text>
              </View>
              <Badge label={req.status} variant={req.status === "completed" ? "success" : req.status === "in_progress" ? "warning" : "info"} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
