import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Card } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const RANK_COLORS = ["#F59E0B", "#9CA3AF", "#B45309"];

export default function VolunteerLeaderboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { volunteers } = useData();

  const sorted = [...volunteers].sort((a, b) => b.completedTaskCount - a.completedTaskCount);
  const myRank = sorted.findIndex((v) => v.id === user?.id) + 1;
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#F59E0B", "#D97706"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 32, paddingHorizontal: 20 }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold", marginBottom: 4 }}>Leaderboard</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular", marginBottom: 20 }}>
          Top volunteers this month
        </Text>

        {myRank > 0 && (
          <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>#{myRank}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 }}>Your Rank</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", fontSize: 12 }}>
                {user?.completedTaskCount ?? 0} tasks · {user?.totalHoursContributed ?? 0} hours
              </Text>
            </View>
            <Feather name="trending-up" size={20} color="#fff" />
          </View>
        )}
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {sorted.slice(0, 3).length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 12, marginBottom: 24, paddingTop: 10 }}>
            {[sorted[1], sorted[0], sorted[2]].filter(Boolean).map((vol, idx) => {
              const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const heights = [90, 110, 80];
              return (
                <View key={vol.id} style={{ alignItems: "center", gap: 6 }}>
                  <Avatar name={vol.name} size={actualRank === 1 ? 52 : 42} />
                  <View style={{
                    width: 70,
                    height: heights[idx],
                    backgroundColor: RANK_COLORS[actualRank - 1] + "20",
                    borderRadius: 10,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderTopWidth: 3,
                    borderTopColor: RANK_COLORS[actualRank - 1],
                  }}>
                    <Text style={{ fontSize: 18, color: RANK_COLORS[actualRank - 1], fontFamily: "Inter_700Bold" }}>#{actualRank}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: colors.foreground, fontFamily: "Inter_600SemiBold", textAlign: "center" }} numberOfLines={1}>
                    {vol.name.split(" ")[0]}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{vol.completedTaskCount} tasks</Text>
                </View>
              );
            })}
          </View>
        )}

        <Card style={{ gap: 0, padding: 0, overflow: "hidden" }}>
          {sorted.map((vol, idx) => {
            const rank = idx + 1;
            const isMe = vol.id === user?.id;
            return (
              <View key={vol.id} style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 14,
                backgroundColor: isMe ? colors.primary + "08" : "transparent",
                borderBottomWidth: idx < sorted.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontFamily: "Inter_700Bold",
                  color: rank <= 3 ? RANK_COLORS[rank - 1] : colors.mutedForeground,
                  width: 28,
                  textAlign: "center",
                }}>
                  #{rank}
                </Text>
                <Avatar name={vol.name} size={36} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: isMe ? colors.primary : colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                      {vol.name}{isMe ? " (You)" : ""}
                    </Text>
                    {vol.isVerifiedByNGO && <Feather name="shield" size={12} color={colors.success} />}
                  </View>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{vol.district}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{vol.completedTaskCount}</Text>
                  <Text style={{ fontSize: 10, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>tasks</Text>
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
}
