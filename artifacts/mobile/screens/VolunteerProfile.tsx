import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Badge, Button, Card, Divider } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function VolunteerProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  if (!user) return null;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const MENU = [
    { label: "Skills & Availability", icon: "settings", action: () => Alert.alert("Coming soon") },
    { label: "Service Radius", icon: "map-pin", action: () => Alert.alert("Service Radius", `Current: ${user.serviceRadiusKm ?? 5} km`) },
    { label: "Certificates", icon: "award", action: () => Alert.alert("Certificates", "Your certificates will be available after milestone tasks.") },
    { label: "Privacy Settings", icon: "shield", action: () => Alert.alert("Coming soon") },
    { label: "Help & Support", icon: "help-circle", action: () => Alert.alert("Support", "Email: support@localaid.np") },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.info, colors.info + "CC"]}
        style={{ paddingTop: topPadding + 16, paddingBottom: 60, alignItems: "center" }}
      >
        <Avatar name={user.name} size={72} role="volunteer" />
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold", marginTop: 12 }}>{user.name}</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 8 }}>{user.email}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Badge label="Volunteer" variant="default" size="md" />
          {user.isVerifiedByNGO && <Badge label="Verified" variant="success" size="md" />}
        </View>
      </LinearGradient>

      <View style={{ marginTop: -28, paddingHorizontal: 20 }}>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>{user.completedTaskCount ?? 0}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Tasks</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.info, fontFamily: "Inter_700Bold" }}>{user.totalHoursContributed ?? 0}h</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Hours</Text>
            </View>
            <Divider style={{ width: 1, height: "100%", marginHorizontal: 0 }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: colors.warning, fontFamily: "Inter_700Bold" }}>{user.rating?.toFixed(1) ?? "—"}</Text>
              <Text style={{ fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Rating</Text>
            </View>
          </View>
        </Card>

        {(user.skills?.length ?? 0) > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 10 }}>Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {user.skills?.map((skill) => (
                <View key={skill} style={{ backgroundColor: colors.primary + "15", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ fontSize: 13, color: colors.primary, fontFamily: "Inter_500Medium" }}>{skill}</Text>
                </View>
              ))}
            </View>
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

        <Button title="Sign Out" onPress={() => Alert.alert("Sign Out", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: logout },
        ])} variant="outline" fullWidth size="lg" icon={<Feather name="log-out" size={16} color={colors.destructive} />} style={{ borderColor: colors.destructive }} />
      </View>
    </ScrollView>
  );
}
