import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card, Divider } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function AdminProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

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
    { label: "Audit Log", icon: "list", action: () => Alert.alert("Audit Log", "Full audit log viewer coming soon.") },
    { label: "Platform Settings", icon: "settings", action: () => Alert.alert("Coming soon") },
    { label: "Broadcast Message", icon: "send", action: () => Alert.alert("Broadcast", "Send notification to all users") },
    { label: "API Usage", icon: "activity", action: () => Alert.alert("AI Usage", "Gemini API: 12,450 tokens this week\nEst. cost: $0.24") },
    { label: "Help & Documentation", icon: "book", action: () => Alert.alert("Docs", "admin.localaid.np/docs") },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#1E1E2E", "#2D1A3E"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 60, alignItems: "center" }}
      >
        <Avatar name={user.name} size={72} role="admin" />
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold", marginTop: 12 }}>{user.name}</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 8 }}>{user.email}</Text>
        <Badge label="Super Admin" variant="error" size="md" />
      </LinearGradient>

      <View style={{ marginTop: -28, paddingHorizontal: 20 }}>
        <Card style={{ marginBottom: 16, borderColor: "#A78BFA40", borderWidth: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Feather name="shield" size={16} color="#A78BFA" />
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>Platform Access</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", lineHeight: 18 }}>
            Full platform access — all data, all roles. Every action is logged in the audit trail.
          </Text>
        </Card>

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
