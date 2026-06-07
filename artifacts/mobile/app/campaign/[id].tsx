import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, Button, Card } from "@/components/UI";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

export default function CampaignDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { campaigns } = useData();

  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Campaign not found.</Text>
      </View>
    );
  }

  const spotsLeft = campaign.maxVolunteers - campaign.registeredCount;
  const pct = Math.round((campaign.registeredCount / campaign.maxVolunteers) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Badge label={campaign.ngoName} variant="default" />
          <Badge label={campaign.status} variant={campaign.status === "published" ? "success" : "info"} />
        </View>

        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 12 }}>
          {campaign.title}
        </Text>

        <Text style={{ fontSize: 15, color: colors.mutedForeground, lineHeight: 22, fontFamily: "Inter_400Regular", marginBottom: 20 }}>
          {campaign.description}
        </Text>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Feather name="calendar" size={14} color={colors.primary} />
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Date</Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                {new Date(campaign.eventDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Feather name="map-pin" size={14} color={colors.primary} />
                <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Location</Text>
              </View>
              <Text style={{ fontSize: 14, color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                {campaign.location.district}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>Volunteers</Text>
            <Text style={{ fontSize: 13, color: spotsLeft > 0 ? colors.success : colors.destructive, fontFamily: "Inter_600SemiBold" }}>
              {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
            </Text>
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.muted, marginBottom: 6 }}>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.primary, width: `${Math.min(pct, 100)}%` }} />
          </View>
          <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>
            {campaign.registeredCount} of {campaign.maxVolunteers} volunteers registered
          </Text>
        </Card>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {campaign.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="default" />
          ))}
        </View>

        {spotsLeft > 0 && (
          <Button
            title="Join This Campaign"
            onPress={() => Alert.alert("Joined!", `You've registered for ${campaign.title}.`)}
            fullWidth
            size="lg"
            icon={<Feather name="check-circle" size={16} color="#fff" />}
          />
        )}
      </ScrollView>
    </View>
  );
}
