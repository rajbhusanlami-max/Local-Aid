import { Redirect } from "expo-router";
import React from "react";
import { LoadingScreen } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect href="/login" />;

  return <Redirect href="/(main)" />;
}
