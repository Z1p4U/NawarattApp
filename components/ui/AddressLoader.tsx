import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

export default function AddressLoader({ count = 2 }: { count?: number }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#e0e0e0", "#f5f5f5", "#e0e0e0"],
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.skeletonCard}>
          <Animated.View style={[styles.skeletonIcon, { backgroundColor }]} />
          <View style={styles.skeletonTextContainer}>
            <Animated.View
              style={[styles.skeletonLineShort, { backgroundColor }]}
            />
            <Animated.View
              style={[styles.skeletonLineLong, { backgroundColor }]}
            />
            <Animated.View
              style={[styles.skeletonLineLong, { backgroundColor }]}
            />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    padding: 20,
    gap: 20,
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 25,
    height: 24,
    borderRadius: 4,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  skeletonLineShort: {
    height: 12,
    width: "40%",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineLong: {
    height: 12,
    width: "80%",
    borderRadius: 4,
    marginBottom: 8,
  },
});
