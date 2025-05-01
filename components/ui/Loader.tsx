import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Loader = () => {
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
        <View key={idx} style={styles.productCard}>
          <View style={styles.imageWrapper}>
            <Animated.View
              style={[styles.skeletonImage, { backgroundColor }]}
            />
            <Animated.View style={[styles.skeletonFav, { backgroundColor }]} />
          </View>

          <View style={styles.productCardContent}>
            <Animated.View
              style={[styles.skeletonLineShort, { backgroundColor }]}
            />
            <Animated.View
              style={[styles.skeletonLineLong, { backgroundColor }]}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Loader;

const CARD_WIDTH = SCREEN_WIDTH * 0.4;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  productCard: {
    width: CARD_WIDTH,
    gap: 10,
    marginRight: 15,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    alignItems: "center",
  },
  skeletonImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
  },
  skeletonFav: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  productCardContent: {
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  skeletonLineShort: {
    height: 15,
    width: "60%",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonLineLong: {
    height: 14,
    width: "40%",
    borderRadius: 4,
  },
});
