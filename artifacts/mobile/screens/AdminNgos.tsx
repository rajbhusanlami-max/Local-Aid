import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Button, Card, TagChip } from "@/components/UI";
import { useColors } from "@/hooks/useColors";

const NGO_DATA = [
  { id: "ngo-001", name: "Helping Hands Nepal", admin: "Sunita Rai", email: "ngo@localaid.np", district: "Kathmandu", status: "approved" as const, requestsHandled: 42, createdAt: "2025-09-08" },
  { id: "ngo-002", name: "Green Future Nepal", admin: "Ram Prasad", email: "ram@greenfuture.np", district: "Kathmandu", status: "approved" as const, requestsHandled: 18, createdAt: "2025-10-15" },
  { id: "ngo-003", name: "Youth Alliance Pokhara", admin: "Sita Rana", email: "sita@youthalliance.np", district: "Kaski", status: "pending" as const, requestsHandled: 0, createdAt: "2026-01-02" },
  { id: "ngo-004", name: "Digital Nepal Foundation", admin: "Bikash KC", email: "bikash@dnf.np", district: "Lalitpur", status: "pending" as const, requestsHandled: 0, createdAt: "2026-01-06" },
];

const TABS = ["All", "Pending", "Approved"];

export default function AdminNgos() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState("All");
  const [ngos, setNgos] = useState(NGO_DATA);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = ngos.filter((n) => {
    if (tab === "Pending") return n.status === "pending";
    if (tab === "Approved") return n.status === "approved";
    return true;
  });

  const pendingCount = ngos.filter((n) => n.status === "pending").length;

  const handleApprove = (id: string) => {
    setNgos((prev) => prev.map((n) => n.id === id ? { ...n, status: "approved" as const } : n));
    Alert.alert("Approved", "NGO has been approved and notified.");
  };

  const handleReject = (id: string) => {
    Alert.alert("Reject NGO", "Provide a reason:", [
      { text: "Insufficient info", onPress: () => setNgos((prev) => prev.filter((n) => n.id !== id)) },
      { text: "Duplicate NGO", onPress: () => setNgos((prev) => prev.filter((n) => n.id !== id)) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>NGOs</Text>
          {pendingCount > 0 && (
            <View style={{ backgroundColor: colors.accent + "20", borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontSize: 12, color: colors.accent, fontFamily: "Inter_600SemiBold" }}>{pendingCount} pending</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {TABS.map((t) => <TagChip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />)}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((ngo) => (
          <Card key={ngo.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{ngo.name}</Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{ngo.admin} · {ngo.district}</Text>
              </View>
              <Badge
                label={ngo.status === "approved" ? "Approved" : "Pending"}
                variant={ngo.status === "approved" ? "success" : "warning"}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Feather name="mail" size={12} color={colors.mutedForeground} />
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{ngo.email}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Feather name="check-circle" size={12} color={colors.success} />
                <Text style={{ fontSize: 12, color: colors.success, fontFamily: "Inter_500Medium" }}>{ngo.requestsHandled} handled</Text>
              </View>
            </View>

            {ngo.status === "pending" ? (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button title="Reject" onPress={() => handleReject(ngo.id)} size="sm" variant="outline" style={{ borderColor: colors.destructive }} />
                <Button title="Approve" onPress={() => handleApprove(ngo.id)} size="sm" fullWidth icon={<Feather name="check" size={13} color="#fff" />} />
              </View>
            ) : (
              <Button
                title="View Details"
                onPress={() => Alert.alert(ngo.name, `Email: ${ngo.email}\nDistrict: ${ngo.district}\nRequests Handled: ${ngo.requestsHandled}`)}
                size="sm"
                variant="outline"
                fullWidth
              />
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
