import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useCategory from "@/redux/hooks/category/useCategory";

const DiscoverCarousel = () => {
  const { categories } = useCategory();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories?.map((category) => (
        <TouchableOpacity
          key={category?.id}
          style={styles.tagContainer}
          onPress={() => console.log("Navigate to", category?.name)}
        >
          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tag}
          >
            <Text style={styles.tagText}>{category?.name}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default DiscoverCarousel;

const styles = StyleSheet.create({
  tagContainer: {
    marginRight: 15,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 1000,
    alignSelf: "flex-start",
  },
  tagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
