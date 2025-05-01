import React from "react";
import useBrand from "@/redux/hooks/brand/useBrand";
import { Link } from "expo-router";
import { StyleSheet, View, Image, Text } from "react-native";
import Loader from "../ui/Loader";

const BrandList: React.FC = () => {
  const { brands, loading } = useBrand();

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.brandContainer}>
      {brands?.map((brand) => (
        <Link
          key={brand.id}
          href={`/productListByBrand?id=${brand?.id}&name=${brand?.name}`}
          style={styles.brand}
        >
          <Image
            source={
              brand.image
                ? { uri: brand.image }
                : require("@/assets/images/placeholder.jpg")
            }
            style={styles.brandImage}
          />
        </Link>
      ))}
    </View>
  );
};

export default BrandList;

const styles = StyleSheet.create({
  noBrandContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  brandContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  brand: {
    display: "flex",
    width: "28%",
    height: "100%",
    marginBottom: 15,
    aspectRatio: 1,
  },
  brandImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,
  },
});
