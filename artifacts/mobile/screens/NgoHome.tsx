import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Card, SectionHeader, StatCard } from "@/components/UI";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

export default function NgoHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { requests, campaigns, volunteers, notifications } = useData();

  const pending = requests.filter((r) => r.status === "submitted");
  const active = requests.filter((r) => ["accepted", "in_progress"].includes(r.status));
  const unread = notifications.filter((n) => !n.read).length;
  const myCampaigns = campaigns.filter((c) => c.ngoId === "ngo-001");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={[colors.accent, "#E05010"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 28, paddingHorizontal: 20 }}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Avatar name={user?.ngoName ?? "NGO"} size={42} role="ngo" />
            <View>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>NGO Dashboard</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }} numberOfLines={1}>
                {user?.ngoName ?? "Your NGO"}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.push("/(main)/notifications")} style={{ position: "relative" }}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 10 }}>
              <Feather name="bell" size={20} color="#fff" />
            </View>
            {unread > 0 && (
              <View style={{ position: "absolute", top: -2, right: -2, backgroundColor: colors.primary, borderRadius: 10, minWidth: 18, height: 18, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.accent }}>
                <Text style={{ color: "#fff", fontSize: 10, fontFamily: "Inter_700Bold" }}>{unread}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable onPress={() => router.push("/(main)/requests")} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{pending.length}</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Pending Triage</Text>
            {pending.length > 0 && <View style={{ position: "absolute", top: 8, right: 8, backgroundColor: "#fff", borderRadius: 6, width: 8, height: 8 }} />}
          </Pressable>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{active.length}</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>In Progress</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{volunteers.length}</Text>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>Volunteers</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {pending.length > 0 && (
          <>
            <SectionHeader
              title="Needs Triage"
              action={{ label: "Triage all", onPress: () => router.push("/(main)/requests") }}
            />
            {pending.slice(0, 2).map((req) => (
              <RequestCard key={req.id} request={req} compact />
            ))}
          </>
        )}

        <SectionHeader
          title="Active Requests"
          action={{ label: "View all", onPress: () => router.push("/(main)/requests") }}
        />
        {active.slice(0, 2).map((req) => (
          <RequestCard key={req.id} request={req} compact />
        ))}

        <SectionHeader
          title="My Campaigns"
          action={{ label: "Manage", onPress: () => router.push("/(main)/campaigns") }}
        />
        {myCampaigns.slice(0, 1).map((camp) => (
          <Card key={camp.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", flex: 1 }} numberOfLines={1}>
                {camp.title}
              </Text>
              <Badge label={camp.status} variant="success" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Feather name="users" size={12} color={colors.primary} />
                <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_500Medium" }}>
                  {camp.registeredCount}/{camp.maxVolunteers}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Feather name="calendar" size={12} color={colors.mutedForeground} />
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
                  {new Date(camp.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
