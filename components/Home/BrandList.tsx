import React from "react";
import useBrand from "@/redux/hooks/brand/useBrand";
import { Link } from "expo-router";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import Loader from "../ui/Loader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Adjust this percentage as desired:
const CARD_SIZE = SCREEN_WIDTH * 0.28;

const BrandList: React.FC = () => {
  const { brands, loading } = useBrand();

  return (
    <View style={styles.brandContainer}>
      {brands?.map((brand) => {
        // If brand.image is a remote URL string, we use that.
        // Otherwise, we fall back to the local placeholder right away.
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
              // Always display the placeholder behind
              source={require("@/assets/images/placeholder.png")}
              style={styles.imageBg}
              imageStyle={styles.imageStyle}
            >
              {/* Overlay the remote (or local) thumbnail on top */}
              <Image
                source={thumbnailSource}
                style={[styles.imageOverlay, styles.imageStyle]}
              />
            </ImageBackground>
          </Link>
        );
      })}
    </View>
  );
};

export default BrandList;

const styles = StyleSheet.create({
  brandContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10, // React Native 0.70+ supports “gap” on View for row/column spacing
  },
  brandCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginBottom: 15,
  },
  // The ImageBackground container:
  imageBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  // Common rounded‐corner, border styling for both BG and overlay:
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0000001A",
  },
  // The actual overlayed Image will sit absolutely to fill the same space:
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
