import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card, Divider } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

export default function CitizenProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { requests } = useData();
  const [notifToggle, setNotifToggle] = useState(user?.notificationPrefs.statusUpdates ?? true);
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const myReqs = requests.filter((r) => r.citizenId === user.id);
  const completed = myReqs.filter((r) => r.status === "completed").length;
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

  const MENU_ITEMS = [
    { label: "Personal Information", icon: "user", action: () => Alert.alert("Coming soon") },
    { label: "Location Settings", icon: "map-pin", action: () => Alert.alert("Coming soon") },
    { label: "Language", icon: "globe", action: () => Alert.alert("Select Language", "English / नेपाली") },
    { label: "Help & Support", icon: "help-circle", action: () => Alert.alert("Support", "Email: support@localaid.np") },
    { label: "Privacy Policy", icon: "shield", action: () => Alert.alert("Coming soon") },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, colors.primary + "CC"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 60, alignItems: "center" }}
      >
        <Avatar name={user.name} size={72} role={user.role} />
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold", marginTop: 12 }}>{user.name}</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" }}>{user.email}</Text>
        <Badge label="Citizen" variant="default" size="md" />
      </LinearGradient>

      <View style={{ marginTop: -28, paddingHorizontal: 20 }}>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{myReqs.length}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Total Requests</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.success, fontFamily: "Inter_700Bold" }}>{completed}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Resolved</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.accent, fontFamily: "Inter_700Bold" }}>
                {myReqs.length - completed}
              </Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Active</Text>
            </View>
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ backgroundColor: colors.info + "15", borderRadius: 10, padding: 8 }}>
                <Feather name="bell" size={16} color={colors.info} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: "500", color: colors.foreground, fontFamily: "Inter_500Medium" }}>Status Notifications</Text>
            </View>
            <Switch
              value={notifToggle}
              onValueChange={(v) => {
                setNotifToggle(v);
                updateUser({ notificationPrefs: { ...user.notificationPrefs, statusUpdates: v } });
              }}
              trackColor={{ false: colors.muted, true: colors.primary + "80" }}
              thumbColor={notifToggle ? colors.primary : colors.mutedForeground}
            />
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          {MENU_ITEMS.map((item, idx) => (
            <View key={item.label}>
              <Pressable
                onPress={item.action}
                style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 }}
              >
                <View style={{ backgroundColor: colors.muted, borderRadius: 10, padding: 8 }}>
                  <Feather name={item.icon as any} size={16} color={colors.mutedForeground} />
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, fontFamily: "Inter_500Medium" }}>{item.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
              {idx < MENU_ITEMS.length - 1 && <Divider />}
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
