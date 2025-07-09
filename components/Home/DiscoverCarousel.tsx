import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useCategory from "@/redux/hooks/category/useCategory";
import PillLoader from "../ui/PillLoader";
import { Link } from "expo-router";

const DiscoverCarousel = () => {
  const { categories, loading } = useCategory();

  if (loading) {
    return <PillLoader />;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories?.map((category) => (
        <Link
          key={category?.id}
          style={styles.tagContainer}
          href={`/productListByCategory?id=${category?.id}&name=${category?.name}`}
        >
          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tag}
          >
            <Text style={styles.tagText}>{category?.name}</Text>
          </LinearGradient>
        </Link>
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
    width: "auto",
  },
  tagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
