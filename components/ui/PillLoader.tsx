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

const PillLoader = () => {
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

  const placeholders = Array.from({ length: 6 });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {placeholders.map((_, idx) => (
        <Animated.View key={idx} style={[styles.pill, { backgroundColor }]} />
      ))}
    </ScrollView>
  );
};

export default PillLoader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  pill: {
    height: 32,
    width: SCREEN_WIDTH * 0.25,
    borderRadius: 1000,
    marginRight: 15,
  },
});
