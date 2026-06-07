import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Card, EmptyState, TagChip } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TAGS = ["All", "Medical", "Welfare", "Education", "Environment", "Food"];

export default function CitizenCampaigns() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { campaigns } = useData();
  const [selectedTag, setSelectedTag] = useState("All");

  const published = campaigns.filter((c) => c.status === "published" || c.status === "ongoing");
  const filtered = published.filter((c) =>
    selectedTag === "All" || c.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()))
  );

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 14 }}>Campaigns</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {TAGS.map((t) => (
              <TagChip key={t} label={t} selected={selectedTag === t} onPress={() => setSelectedTag(t)} />
            ))}
          </View>
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="No campaigns"
          description="No campaigns match your filter. Check back soon."
          icon={<Feather name="calendar" size={32} color={colors.mutedForeground} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((camp) => {
            const spotsLeft = camp.maxVolunteers - camp.registeredCount;
            const isFull = spotsLeft <= 0;
            return (
              <Card key={camp.id} onPress={() => Alert.alert(camp.title, camp.description)}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 2 }}>
                      {camp.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_500Medium" }}>{camp.ngoName}</Text>
                  </View>
                  <Badge label={isFull ? "Full" : "Open"} variant={isFull ? "error" : "success"} />
                </View>

                <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 12, fontFamily: "Inter_400Regular" }} numberOfLines={2}>
                  {camp.description}
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {camp.tags.map((tag) => (
                    <Badge key={tag} label={tag} variant="default" />
                  ))}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Feather name="calendar" size={12} color={colors.mutedForeground} />
                    <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{formatDate(camp.eventDate)}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                    <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{camp.location.district}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Feather name="users" size={12} color={colors.primary} />
                    <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_500Medium" }}>
                      {camp.registeredCount}/{camp.maxVolunteers}
                    </Text>
                  </View>
                </View>

                {!isFull && (
                  <Pressable
                    onPress={() => Alert.alert("Joined!", `You have joined ${camp.title}`)}
                    style={{ marginTop: 12, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" }}>Join Campaign</Text>
                  </Pressable>
                )}
              </Card>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
