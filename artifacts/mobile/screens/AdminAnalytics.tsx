import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, SectionHeader, StatCard } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const WEEKLY_DATA = [
  { day: "Mon", requests: 8 },
  { day: "Tue", requests: 12 },
  { day: "Wed", requests: 6 },
  { day: "Thu", requests: 15 },
  { day: "Fri", requests: 11 },
  { day: "Sat", requests: 9 },
  { day: "Sun", requests: 5 },
];

const TOP_CATEGORIES = [
  { label: "Elderly Care", count: 18, pct: 38, color: "#1A6B4A" },
  { label: "Food", count: 11, pct: 23, color: "#F07020" },
  { label: "Blood Donation", count: 8, pct: 17, color: "#DC2626" },
  { label: "Medical", count: 6, pct: 13, color: "#2563EB" },
  { label: "Education", count: 4, pct: 9, color: "#7C3AED" },
];

const TOP_DISTRICTS = [
  { name: "Kathmandu", requests: 28, pct: 59 },
  { name: "Lalitpur", requests: 12, pct: 25 },
  { name: "Bhaktapur", requests: 7, pct: 15 },
];

export default function AdminAnalytics() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { requests, volunteers } = useData();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const completed = requests.filter((r) => r.status === "completed").length;
  const pending = requests.filter((r) => r.status === "submitted").length;
  const resolutionRate = Math.round((completed / requests.length) * 100);
  const maxRequests = Math.max(...WEEKLY_DATA.map((d) => d.requests));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>Analytics</Text>
          <Button
            title="Export"
            size="sm"
            variant="outline"
            onPress={() => Alert.alert("Export", "Analytics exported as CSV")}
            icon={<Feather name="download" size={13} color={colors.primary} />}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total Requests" value={requests.length} icon={<Feather name="file-text" size={14} color={colors.primary} />} color={colors.primary} />
          <StatCard label="Resolution Rate" value={`${resolutionRate}%`} icon={<Feather name="trending-up" size={14} color={colors.success} />} color={colors.success} />
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <StatCard label="Active Volunteers" value={volunteers.length} icon={<Feather name="users" size={14} color={colors.info} />} color={colors.info} />
          <StatCard label="Avg Response" value="2.4h" icon={<Feather name="clock" size={14} color={colors.warning} />} color={colors.warning} />
        </View>

        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 16 }}>
            Requests This Week
          </Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 80 }}>
            {WEEKLY_DATA.map((d) => (
              <View key={d.day} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 9, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{d.requests}</Text>
                <View style={{
                  width: "80%",
                  height: (d.requests / maxRequests) * 55,
                  backgroundColor: d.day === "Thu" ? colors.primary : colors.primary + "50",
                  borderRadius: 4,
                }} />
                <Text style={{ fontSize: 9, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{d.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>
            By Category
          </Text>
          {TOP_CATEGORIES.map((cat) => (
            <View key={cat.label} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{cat.label}</Text>
                <Text style={{ fontSize: 13, color: cat.color, fontFamily: "Inter_600SemiBold" }}>{cat.count} ({cat.pct}%)</Text>
              </View>
              <View style={{ height: 7, borderRadius: 4, backgroundColor: colors.muted }}>
                <View style={{ height: 7, borderRadius: 4, backgroundColor: cat.color, width: `${cat.pct}%` }} />
              </View>
            </View>
          ))}
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>
            Top Districts
          </Text>
          {TOP_DISTRICTS.map((d, i) => (
            <View key={d.name} style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.mutedForeground, fontFamily: "Inter_700Bold", width: 24, textAlign: "center" }}>
                {i + 1}
              </Text>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{d.name}</Text>
                  <Text style={{ fontSize: 13, color: colors.primary, fontFamily: "Inter_600SemiBold" }}>{d.requests}</Text>
                </View>
                <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.muted }}>
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.primary, width: `${d.pct}%` }} />
                </View>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}
