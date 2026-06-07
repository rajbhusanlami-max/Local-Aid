import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card, Divider } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

export default function NgoProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { requests, campaigns, volunteers } = useData();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const handled = requests.filter((r) => r.status === "completed").length;
  const activeCamps = campaigns.filter((c) => c.ngoId === "ngo-001" && c.status === "published").length;
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleSignOut = async () => {
    const confirmed =
      Platform.OS === "web"
        ? window.confirm("Sign out of LocalAid?")
        : await new Promise<boolean>((resolve) =>
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              { text: "Sign Out", style: "destructive", onPress: () => resolve(true) },
            ])
          );
    if (!confirmed) return;
    setSigningOut(true);
    await logout();
    router.replace("/login");
  };

  const MENU = [
    { label: "Edit NGO Profile", icon: "edit-2", action: () => Alert.alert("Coming soon") },
    { label: "Coverage Areas", icon: "map", action: () => Alert.alert("Coming soon") },
    { label: "Notification Settings", icon: "bell", action: () => Alert.alert("Coming soon") },
    { label: "Export Analytics", icon: "download", action: () => Alert.alert("Exporting", "Analytics export will download as CSV.") },
    { label: "Help & Support", icon: "help-circle", action: () => Alert.alert("Support", "Email: support@localaid.np") },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.accent, "#E05010"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 60, alignItems: "center" }}
      >
        <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, padding: 16, marginBottom: 12 }}>
          <Feather name="briefcase" size={36} color="#fff" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{user.ngoName}</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 8 }}>{user.email}</Text>
        <Badge label={user.approvalStatus === "approved" ? "Approved" : "Pending"} variant={user.approvalStatus === "approved" ? "success" : "warning"} size="md" />
      </LinearGradient>

      <View style={{ marginTop: -28, paddingHorizontal: 20 }}>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{handled}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Requests</Text>
            </View>
            <Divider style={{ width: 1, height: "100%" }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.accent, fontFamily: "Inter_700Bold" }}>{activeCamps}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Campaigns</Text>
            </View>
            <Divider style={{ width: 1, height: "100%" }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.info, fontFamily: "Inter_700Bold" }}>{volunteers.length}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Volunteers</Text>
            </View>
          </View>
        </Card>

        {user.ngoDescription && (
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 20, fontFamily: "Inter_400Regular" }}>
              {user.ngoDescription}
            </Text>
          </Card>
        )}

        <Card style={{ marginBottom: 16 }}>
          {MENU.map((item, idx) => (
            <View key={item.label}>
              <Pressable onPress={item.action} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 }}>
                <View style={{ backgroundColor: colors.muted, borderRadius: 10, padding: 8 }}>
                  <Feather name={item.icon as any} size={16} color={colors.mutedForeground} />
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
              {idx < MENU.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        <Button
          title={signingOut ? "Signing out…" : "Sign Out"}
          onPress={handleSignOut}
          loading={signingOut}
          variant="outline"
          fullWidth
          size="lg"
          icon={<Feather name="log-out" size={16} color={colors.destructive} />}
          style={{ borderColor: colors.destructive }}
        />
      </View>
    </ScrollView>
  );
}
