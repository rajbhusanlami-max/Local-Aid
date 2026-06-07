import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

type TabConfig = {
  name: string;
  title: string;
  icon: string;
  iconFocused?: string;
};

const CITIZEN_TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: "home" },
  { name: "requests", title: "Requests", icon: "list" },
  { name: "campaigns", title: "Campaigns", icon: "calendar" },
  { name: "notifications", title: "Inbox", icon: "bell" },
  { name: "profile", title: "Profile", icon: "user" },
];

const VOLUNTEER_TABS: TabConfig[] = [
  { name: "index", title: "Home", icon: "home" },
  { name: "tasks", title: "Tasks", icon: "check-square" },
  { name: "impact", title: "Impact", icon: "bar-chart-2" },
  { name: "leaderboard", title: "Leaders", icon: "award" },
  { name: "profile", title: "Profile", icon: "user" },
];

const NGO_TABS: TabConfig[] = [
  { name: "index", title: "Dashboard", icon: "grid" },
  { name: "requests", title: "Requests", icon: "inbox" },
  { name: "campaigns", title: "Campaigns", icon: "flag" },
  { name: "volunteers", title: "Team", icon: "users" },
  { name: "profile", title: "NGO", icon: "briefcase" },
];

const ADMIN_TABS: TabConfig[] = [
  { name: "index", title: "Dashboard", icon: "grid" },
  { name: "users", title: "Users", icon: "users" },
  { name: "ngos", title: "NGOs", icon: "briefcase" },
  { name: "analytics", title: "Analytics", icon: "bar-chart-2" },
  { name: "profile", title: "Admin", icon: "shield" },
];

const ALL_SCREENS = [
  "index", "requests", "campaigns", "notifications", "profile",
  "tasks", "impact", "leaderboard", "volunteers",
  "users", "ngos", "analytics",
];

export default function MainTabLayout() {
  const { user } = useAuth();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";

  if (!user) return <Redirect href="/login" />;

  const activeTabs =
    user?.role === "volunteer" ? VOLUNTEER_TABS :
    user?.role === "ngo" ? NGO_TABS :
    user?.role === "admin" ? ADMIN_TABS :
    CITIZEN_TABS;

  const activeTabNames = activeTabs.map((t) => t.name);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.tabBar,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.tabBarBorder,
          elevation: 0,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBar }]} />
          ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginBottom: 2,
        },
      }}
    >
      {ALL_SCREENS.map((screenName) => {
        const tabConfig = activeTabs.find((t) => t.name === screenName);
        const isHidden = !activeTabNames.includes(screenName);

        return (
          <Tabs.Screen
            key={screenName}
            name={screenName}
            options={{
              title: tabConfig?.title ?? screenName,
              href: isHidden ? null : undefined,
              tabBarIcon: ({ color }) => (
                <Feather
                  name={(tabConfig?.icon ?? "circle") as any}
                  size={20}
                  color={color}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
