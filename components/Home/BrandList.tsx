import React from "react";
import { Link } from "expo-router";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import Loader from "../ui/Loader";
import { Brand } from "@/constants/config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = SCREEN_WIDTH * 0.28;
interface BrandListProps {
  brands: Brand[] | null;
  loading: boolean;
}

const BrandList: React.FC<BrandListProps> = ({ brands, loading }) => {
  if (loading) {
    return <Loader />;
  }

  return (
    <FlatList
      data={brands || []}
      keyExtractor={(brand) => brand.id.toString()}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row}
      renderItem={({ item: brand }) => {
        const thumbnailSource = brand.image
          ? { uri: brand.image }
          : require("@/assets/images/placeholder.png");

        return (
          <Link
            key={brand.id}
            href={`/productListByBrand?id=${brand.id}&name=${brand.name}`}
            style={styles.brandCard}
          >
            <ImageBackground
              source={require("@/assets/images/placeholder.png")}
              style={styles.imageBg}
              imageStyle={styles.imageStyle}
            >
              <Image
                source={thumbnailSource}
                style={[styles.imageOverlay, styles.imageStyle]}
              />
            </ImageBackground>
          </Link>
        );
      }}
    />
  );
};

export default BrandList;

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: "center",
  },
  brandCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: 5, // replaces gap + marginBottom
  },
  imageBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0000001A",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
