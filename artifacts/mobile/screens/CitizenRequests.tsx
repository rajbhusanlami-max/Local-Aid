import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, EmptyState, TagChip } from "@/components/UI";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["All", "Active", "Completed", "Cancelled"];

export default function CitizenRequests() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { requests } = useData();
  const [activeTab, setActiveTab] = useState("All");

  const myReqs = requests.filter((r) => r.citizenId === user?.id);
  const filtered = myReqs.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return ["submitted", "accepted", "in_progress"].includes(r.status);
    if (activeTab === "Completed") return r.status === "completed";
    if (activeTab === "Cancelled") return r.status === "cancelled";
    return true;
  });

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>My Requests</Text>
          <Button title="New" onPress={() => router.push("/new-request" as any)} size="sm" icon={<Feather name="plus" size={14} color="#fff" />} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {TABS.map((t) => (
              <TagChip key={t} label={t} selected={activeTab === t} onPress={() => setActiveTab(t)} />
            ))}
          </View>
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description={activeTab === "All" ? "Submit your first help request and we'll find support for you." : `No ${activeTab.toLowerCase()} requests.`}
          action={activeTab === "All" ? { label: "Request Help", onPress: () => router.push("/new-request" as any) } : undefined}
          icon={<Feather name="inbox" size={32} color={colors.mutedForeground} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
