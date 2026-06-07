import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, EmptyState } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useColors } from "@/hooks/useColors";

const NOTIF_ICONS: Record<string, { icon: string; color: string }> = {
  status_update: { icon: "refresh-cw", color: "#2563EB" },
  volunteer_matched: { icon: "user-check", color: "#1A6B4A" },
  task_assigned: { icon: "clipboard", color: "#F07020" },
  new_campaign: { icon: "calendar", color: "#7C3AED" },
  certificate_ready: { icon: "award", color: "#D97706" },
  request_completed: { icon: "check-circle", color: "#16A34A" },
  ngo_approved: { icon: "thumbs-up", color: "#1A6B4A" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllRead } = useData();

  const myNotifs = notifications
    .filter((n) => n.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = myNotifs.filter((n) => !n.read).length;
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: topPadding + 12, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" }}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_500Medium", marginTop: 2 }}>
                {unreadCount} unread
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <Button title="Mark all read" onPress={markAllRead} size="sm" variant="ghost" />
          )}
        </View>
      </View>

      {myNotifs.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="You have no notifications yet. We'll notify you when something important happens."
          icon={<Feather name="bell" size={32} color={colors.mutedForeground} />}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {myNotifs.map((notif) => {
            const iconConfig = NOTIF_ICONS[notif.type] ?? { icon: "bell", color: colors.primary };
            return (
              <Pressable
                key={notif.id}
                onPress={() => markNotificationRead(notif.id)}
                style={{
                  backgroundColor: notif.read ? colors.card : colors.primary + "08",
                  borderRadius: colors.radius,
                  padding: 14,
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "flex-start",
                  borderWidth: notif.read ? 0 : 1,
                  borderColor: colors.primary + "20",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View style={{ backgroundColor: iconConfig.color + "15", borderRadius: 12, padding: 10, marginTop: 2 }}>
                  <Feather name={iconConfig.icon as any} size={16} color={iconConfig.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, fontFamily: "Inter_600SemiBold", flex: 1 }}>
                      {notif.title}
                    </Text>
                    {!notif.read && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 }} />
                    )}
                  </View>
                  <Text style={{ fontSize: 13, color: colors.mutedForeground, lineHeight: 18, fontFamily: "Inter_400Regular" }}>
                    {notif.message}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 6, fontFamily: "Inter_400Regular" }}>
                    {timeAgo(notif.createdAt)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
