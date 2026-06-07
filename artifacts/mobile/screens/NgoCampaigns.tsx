import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Button, Card, EmptyState, TagChip } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["Published", "Draft", "Completed"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NgoCampaigns() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { campaigns, addCampaign } = useData();
  const [tab, setTab] = useState("Published");
  const [generating, setGenerating] = useState(false);

  const myCamps = campaigns.filter((c) => c.ngoId === "ngo-001");
  const filtered = myCamps.filter((c) => {
    if (tab === "Published") return ["published", "ongoing"].includes(c.status);
    if (tab === "Draft") return c.status === "draft";
    return c.status === "completed";
  });

  const handleAIGenerate = async () => {
    setGenerating(true);
    setTimeout(() => {
      addCampaign({
        ngoId: "ngo-001",
        ngoName: "Helping Hands Nepal",
        title: "AI-Generated: Community Blood Drive",
        description: "Urgent community blood drive to support local hospitals. All blood types needed. Free health screening included for all donors.",
        tags: ["blood_donation", "health", "community"],
        eventDate: new Date(Date.now() + 10 * 24 * 3600000).toISOString(),
        location: { address: "Central Hospital, Kathmandu", district: "Kathmandu" },
        maxVolunteers: 40,
        registeredCount: 0,
        status: "draft",
      });
      setGenerating(false);
      Alert.alert("Campaign Created!", "AI has drafted a new campaign. Review and publish it when ready.");
    }, 2000);
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>Campaigns</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              title="AI Draft"
              onPress={handleAIGenerate}
              size="sm"
              variant="secondary"
              loading={generating}
              icon={<Feather name="zap" size={13} color={colors.primary} />}
            />
            <Button
              title="New"
              onPress={() => Alert.alert("Create Campaign", "Campaign builder coming soon")}
              size="sm"
              icon={<Feather name="plus" size={13} color="#fff" />}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {TABS.map((t) => <TagChip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />)}
        </View>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${tab.toLowerCase()} campaigns`}
          description={tab === "Published" ? "Publish a campaign to reach volunteers and citizens." : "Use AI Draft to quickly create a campaign."}
          action={{ label: "AI Draft Campaign", onPress: handleAIGenerate }}
          icon={<Feather name="flag" size={32} color={colors.mutedForeground} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((camp) => (
            <Card key={camp.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", flex: 1, marginRight: 8 }} numberOfLines={2}>
                  {camp.title}
                </Text>
                <Badge
                  label={camp.status}
                  variant={camp.status === "published" ? "success" : camp.status === "draft" ? "default" : "info"}
                />
              </View>

              <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18, marginBottom: 12, fontFamily: "Inter_400Regular" }} numberOfLines={2}>
                {camp.description}
              </Text>

              <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Feather name="calendar" size={12} color={colors.mutedForeground} />
                  <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>{formatDate(camp.eventDate)}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Feather name="users" size={12} color={colors.primary} />
                  <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_500Medium" }}>
                    {camp.registeredCount}/{camp.maxVolunteers} volunteers
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {camp.status === "draft" && (
                  <Button
                    title="Publish"
                    onPress={() => Alert.alert("Publish Campaign", "Make this campaign public?")}
                    size="sm"
                    fullWidth
                  />
                )}
                <Button
                  title={camp.status === "published" ? "Manage" : "Edit"}
                  onPress={() => Alert.alert("Campaign", "Campaign editor coming soon")}
                  size="sm"
                  variant="outline"
                  fullWidth={camp.status !== "draft"}
                />
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
