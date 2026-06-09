import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Button, Card, SectionHeader, StatCard } from "@/components/UI";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const QUICK_ACTIONS = [
  { label: "Food", icon: "coffee", category: "food" },
  { label: "Medical", icon: "activity", category: "medical" },
  { label: "Elder Care", icon: "heart", category: "elderly_care" },
  { label: "Blood", icon: "droplet", category: "blood_donation" },
  { label: "Education", icon: "book", category: "education" },
  { label: "Other", icon: "help-circle", category: "other" },
];

export default function CitizenHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { requests, notifications } = useData();

  const myRequests = requests.filter((r) => r.citizenId === user?.id);
  const activeRequests = myRequests.filter((r) => !["completed", "cancelled"].includes(r.status));
  const unreadCount = notifications.filter((n) => n.userId === user?.id && !n.read).length;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.primary, colors.primary + "E0"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 28, paddingHorizontal: 20 }}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Good morning,</Text>
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>
              {user?.name?.split(" ")[0]}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Pressable onPress={() => router.push("/(main)/notifications")} style={{ position: "relative" }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 10 }}>
                <Feather name="bell" size={20} color="#fff" />
              </View>
              {unreadCount > 0 && (
                <View style={{
                  position: "absolute", top: -2, right: -2,
                  backgroundColor: colors.accent, borderRadius: 10, minWidth: 18, height: 18,
                  alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.primary,
                }}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700", fontFamily: "Inter_700Bold" }}>{unreadCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/(main)/profile")} style={{ borderRadius: 21, borderWidth: 2, borderColor: "rgba(255,255,255,0.5)" }}>
              <Avatar name={user?.name ?? "User"} size={38} />
            </Pressable>
          </View>
        </View>

        <Button
          title="Request Help Now"
          onPress={() => router.push("/new-request" as any)}
          variant="secondary"
          fullWidth
          size="lg"
          style={{ backgroundColor: "#fff" }}
          icon={<Feather name="plus" size={18} color={colors.primary} />}
        />
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <StatCard
            label="Active Requests"
            value={activeRequests.length}
            icon={<Feather name="clock" size={14} color={colors.accent} />}
            color={colors.accent}
            subtitle="Currently open"
          />
          <StatCard
            label="Completed"
            value={myRequests.filter((r) => r.status === "completed").length}
            icon={<Feather name="check-circle" size={14} color={colors.success} />}
            color={colors.success}
            subtitle="All time"
          />
        </View>

        <SectionHeader title="Quick Request" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.category}
              onPress={() => router.push("/new-request" as any)}
              style={{
                width: "30%",
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                padding: 14,
                alignItems: "center",
                gap: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View style={{ backgroundColor: colors.primary + "15", borderRadius: 10, padding: 8 }}>
                <Feather name={a.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 12, color: colors.foreground, fontFamily: "Inter_500Medium", textAlign: "center" }}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {activeRequests.length > 0 && (
          <>
            <SectionHeader
              title="My Active Requests"
              action={{ label: "See all", onPress: () => router.push("/(main)/requests") }}
            />
            {activeRequests.slice(0, 2).map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </>
        )}

        <SectionHeader
          title="Nearby Campaigns"
          action={{ label: "See all", onPress: () => router.push("/(main)/campaigns") }}
        />
        <Card style={{ backgroundColor: colors.primary + "08", borderColor: colors.primary + "20", borderWidth: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ backgroundColor: colors.primary + "20", borderRadius: 12, padding: 10 }}>
              <Feather name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                Winter Blanket Drive
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
                Helping Hands Nepal · In 7 days
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
