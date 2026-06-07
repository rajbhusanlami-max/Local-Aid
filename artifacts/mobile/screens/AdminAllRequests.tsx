import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState, TagChip } from "@/components/UI";
import RequestCard from "@/components/RequestCard";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["All", "Submitted", "In Progress", "Completed"];

export default function AdminAllRequests() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { requests } = useData();
  const [tab, setTab] = useState("All");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = requests.filter((r) => {
    if (tab === "Submitted") return r.status === "submitted";
    if (tab === "In Progress") return ["accepted", "in_progress"].includes(r.status);
    if (tab === "Completed") return r.status === "completed";
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>All Requests</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {TABS.map((t) => <TagChip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />)}
          </View>
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <EmptyState title="No requests" description="No requests match this filter." icon={<Feather name="inbox" size={32} color={colors.mutedForeground} />} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
          {filtered.map((r) => <RequestCard key={r.id} request={r} />)}
        </ScrollView>
      )}
    </View>
  );
}
