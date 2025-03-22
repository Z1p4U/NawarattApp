import React, { ReactNode, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useAuth from "@/redux/hooks/auth/useAuth";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  return children;
};

export default RouteGuard;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
