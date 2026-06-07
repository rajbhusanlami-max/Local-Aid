import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card, TagChip } from "@/components/UI";
import { useColors } from "@/hooks/useColors";

const ALL_USERS = [
  { id: "citizen-001", name: "Priya Sharma", email: "citizen@localaid.np", role: "citizen" as const, joined: "2025-11-07", lastActive: "Today", status: "active" },
  { id: "volunteer-001", name: "Raj Thapa", email: "volunteer@localaid.np", role: "volunteer" as const, joined: "2025-10-08", lastActive: "Today", status: "active" },
  { id: "ngo-001", name: "Sunita Rai", email: "ngo@localaid.np", role: "ngo" as const, joined: "2025-09-08", lastActive: "Yesterday", status: "active" },
  { id: "user-003", name: "Hari Bahadur", email: "hari@example.com", role: "citizen" as const, joined: "2025-12-01", lastActive: "3 days ago", status: "active" },
  { id: "user-004", name: "Anita Gurung", email: "anita@example.com", role: "volunteer" as const, joined: "2025-11-15", lastActive: "1 week ago", status: "active" },
  { id: "user-005", name: "Sanjay Magar", email: "sanjay@example.com", role: "volunteer" as const, joined: "2025-10-20", lastActive: "Today", status: "active" },
  { id: "user-006", name: "Bimala Khadka", email: "bimala@example.com", role: "citizen" as const, joined: "2025-12-10", lastActive: "2 days ago", status: "inactive" },
];

const ROLE_FILTERS = ["All", "Citizen", "Volunteer", "NGO"];

const ROLE_BADGE: Record<string, { label: string; variant: any }> = {
  citizen: { label: "Citizen", variant: "default" },
  volunteer: { label: "Volunteer", variant: "info" },
  ngo: { label: "NGO", variant: "accent" },
  admin: { label: "Admin", variant: "error" },
};

export default function AdminUsers() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = ALL_USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>
          Users <Text style={{ color: colors.mutedForeground, fontSize: 16 }}>({ALL_USERS.length})</Text>
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.muted, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 10, marginBottom: 12 }}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or email..."
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, fontSize: 14, color: colors.foreground, fontFamily: "Inter_400Regular" }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {ROLE_FILTERS.map((f) => <TagChip key={f} label={f} selected={roleFilter === f} onPress={() => setRoleFilter(f)} />)}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((u) => {
          const badgeCfg = ROLE_BADGE[u.role] ?? { label: u.role, variant: "default" };
          return (
            <Card key={u.id} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <Avatar name={u.name} size={40} role={u.role} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>{u.name}</Text>
                    <Badge label={badgeCfg.label} variant={badgeCfg.variant} />
                  </View>
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{u.email}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 1 }}>
                    Joined {u.joined} · Last active {u.lastActive}
                  </Text>
                </View>
                <Button
                  title="Actions"
                  size="sm"
                  variant="ghost"
                  onPress={() => Alert.alert(`Actions for ${u.name}`, undefined, [
                    { text: "View Profile", onPress: () => {} },
                    { text: "Edit Role", onPress: () => {} },
                    { text: "Deactivate", style: "destructive", onPress: () => {} },
                    { text: "Cancel", style: "cancel" },
                  ])}
                  icon={<Feather name="more-vertical" size={16} color={colors.mutedForeground} />}
                />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
