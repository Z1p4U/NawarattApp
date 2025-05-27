import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AddressLoader({ count = 2 }: { count?: number }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#ECECEC", "#F5F5F5", "#ECECEC"],
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
    </ScrollView>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 40;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  skeletonCard: {
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    flexDirection: "row",
    padding: 20,
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 25,
    height: 24,
    borderRadius: 4,
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 20,
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
