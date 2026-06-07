import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Card, StatCard } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const BADGES_CONFIG: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  first_task: { label: "First Step", icon: "star", color: "#F59E0B", desc: "Completed your first task" },
  ten_tasks: { label: "10 Tasks", icon: "award", color: "#8B5CF6", desc: "Completed 10 tasks" },
  fifty_hours: { label: "50 Hours", icon: "clock", color: "#06B6D4", desc: "50 volunteer hours contributed" },
  hundred_hours: { label: "Century", icon: "zap", color: "#EF4444", desc: "100+ volunteer hours" },
};

const CATEGORY_STATS = [
  { category: "Elderly Care", count: 12, color: "#1A6B4A" },
  { category: "Food", count: 8, color: "#F07020" },
  { category: "Education", count: 7, color: "#2563EB" },
  { category: "Medical", count: 5, color: "#DC2626" },
  { category: "Other", count: 2, color: "#6B7B72" },
];

const MONTHLY = [
  { month: "Aug", tasks: 3 },
  { month: "Sep", tasks: 5 },
  { month: "Oct", tasks: 7 },
  { month: "Nov", tasks: 9 },
  { month: "Dec", tasks: 6 },
  { month: "Jan", tasks: 4 },
];

export default function VolunteerImpact() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { requests } = useData();

  const myCompleted = requests.filter((r) => r.assignedVolunteerId === user?.id && r.status === "completed");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const maxTasks = Math.max(...MONTHLY.map((m) => m.tasks));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.info, colors.info + "CC"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 32, paddingHorizontal: 20 }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold", marginBottom: 4 }}>
          Your Impact
        </Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 20 }}>
          Every task makes a difference in someone's life.
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user?.completedTaskCount ?? 34}</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Tasks Completed</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user?.totalHoursContributed ?? 127}h</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Hours Given</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <StatCard label="People Helped" value={(user?.completedTaskCount ?? 34)} icon={<Feather name="users" size={14} color={colors.success} />} color={colors.success} subtitle="Est. individuals" />
          <StatCard label="Rating" value={`${user?.rating?.toFixed(1) ?? "4.8"} ★`} icon={<Feather name="star" size={14} color={colors.warning} />} color={colors.warning} subtitle="Avg. citizen rating" />
        </View>

        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 16 }}>Monthly Activity</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 10, height: 80 }}>
            {MONTHLY.map((m) => (
              <View key={m.month} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                <View style={{
                  width: "100%",
                  height: (m.tasks / maxTasks) * 60,
                  backgroundColor: colors.info,
                  borderRadius: 4,
                  opacity: m.month === "Nov" ? 1 : 0.5,
                }} />
                <Text style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{m.month}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>By Category</Text>
          {CATEGORY_STATS.map((cat) => (
            <View key={cat.category} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{cat.category}</Text>
                <Text style={{ fontSize: 13, color: cat.color, fontFamily: "Inter_600SemiBold" }}>{cat.count}</Text>
              </View>
              <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.muted }}>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: cat.color, width: `${(cat.count / 12) * 100}%` }} />
              </View>
            </View>
          ))}
        </Card>

        <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>Badges Earned</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {Object.entries(BADGES_CONFIG).map(([key, cfg]) => {
            const earned = user?.badges?.includes(key) ?? false;
            return (
              <Pressable
                key={key}
                onPress={() => Alert.alert(cfg.label, cfg.desc)}
                style={{
                  width: "47%",
                  backgroundColor: earned ? cfg.color + "12" : colors.muted,
                  borderRadius: 14,
                  padding: 16,
                  alignItems: "center",
                  gap: 8,
                  opacity: earned ? 1 : 0.4,
                  borderWidth: 1.5,
                  borderColor: earned ? cfg.color + "30" : colors.border,
                }}
              >
                <View style={{ backgroundColor: earned ? cfg.color + "20" : colors.muted, borderRadius: 20, padding: 12 }}>
                  <Feather name={cfg.icon as any} size={24} color={earned ? cfg.color : colors.mutedForeground} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: "600", color: earned ? cfg.color : colors.mutedForeground, fontFamily: "Inter_600SemiBold", textAlign: "center" }}>
                  {cfg.label}
                </Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" }}>
                  {cfg.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
