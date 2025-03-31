import useBrand from "@/redux/hooks/brand/useBrand";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

const BrandList = () => {
  const { brands } = useBrand();

  const nav = useNavigation();

  return (
    <View style={styles?.brandContainer}>
      {brands?.map((brand) => (
        <TouchableOpacity key={brand?.id} style={styles?.brand}>
          <Image
            source={{
              uri: brand?.image
                ? brand.image
                : require("@/assets/images/placeholder.jpg"),
            }}
            style={styles.brandImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BrandList;

const styles = StyleSheet.create({
  brandContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  brand: {
    marginBottom: 15,
    width: "28%",
  },
  brandImage: {
    width: "100%",
    aspectRatio: "1/1",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,
  },
});
