import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

export default function NgoVolunteers() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { volunteers } = useData();
  const [search, setSearch] = useState("");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>Volunteer Roster</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.muted, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 10 }}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or skill..."
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, fontSize: 14, color: colors.foreground, fontFamily: "Inter_400Regular" }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((vol) => (
          <Card key={vol.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
              <Avatar name={vol.name} size={44} role="volunteer" />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                    {vol.name}
                  </Text>
                  {vol.isVerifiedByNGO && <Feather name="shield" size={13} color={colors.success} />}
                </View>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 8 }}>
                  {vol.district} · {vol.completedTaskCount} tasks · {vol.rating}★
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {vol.skills.slice(0, 3).map((skill) => (
                    <View key={skill} style={{ backgroundColor: colors.primary + "15", borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, color: colors.primary, fontFamily: "Inter_500Medium" }}>{skill}</Text>
                    </View>
                  ))}
                  {vol.skills.length > 3 && (
                    <View style={{ backgroundColor: colors.muted, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>+{vol.skills.length - 3}</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {!vol.isVerifiedByNGO && (
                    <Button
                      title="Verify"
                      size="sm"
                      onPress={() => Alert.alert("Verify Volunteer", `Mark ${vol.name} as verified?`)}
                      icon={<Feather name="shield" size={12} color="#fff" />}
                    />
                  )}
                  <Button
                    title="Assign Task"
                    size="sm"
                    variant="outline"
                    onPress={() => Alert.alert("Assign", `Assign a task to ${vol.name}?`)}
                  />
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
