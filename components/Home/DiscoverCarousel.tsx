import React from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PillLoader from "../ui/PillLoader";
import { Link } from "expo-router";
import { Category } from "@/constants/config";

interface DiscoverCarouselProps {
  categories: Category[] | null;
  loading: boolean;
}

const DiscoverCarousel: React.FC<DiscoverCarouselProps> = ({
  categories,
  loading,
}) => {
  if (loading) {
    return <PillLoader />;
  }

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <Link
          style={styles.tagContainer}
          href={`/productListByCategory?id=${item.id}&name=${item.name}`}
        >
          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tag}
          >
            <Text style={styles.tagText}>{item.name}</Text>
          </LinearGradient>
        </Link>
      )}
    />
  );
};

export default DiscoverCarousel;

const styles = StyleSheet.create({
  listContent: {
    paddingLeft: 10,
  },
  separator: {
    width: 15,
  },
  tagContainer: {},
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
