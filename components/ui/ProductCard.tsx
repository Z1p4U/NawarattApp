import React, { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { CardProps } from "@/constants/config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.45;

type Placeholder = number;
const placeholderImage: Placeholder = require("../../assets/images/placeholder.png");

const ProductCard: React.FC<{ product: CardProps }> = ({ product }) => {
  const [addedInWishlist, setAddedInWishlist] = useState(false);

  // if product.thumbnail is a valid string URI, use it; otherwise show placeholder
  const thumbnailSource =
    typeof product.thumbnail === "string" && product.thumbnail.length > 0
      ? { uri: product.thumbnail }
      : placeholderImage;

  const handleImgError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    // console.warn(
    //   `Failed to load image for product ${product.id}:`,
    //   e.nativeEvent.error
    // );
  };

  // placeholder toggle function for wishlist
  const toggleWishlist = (id: string | number) => {
    // Implement your wishlist logic here
    setAddedInWishlist((prev) => !prev);
  };

  const hasDiscount = product.discount_price != null;

  return (
    <View style={styles.productCard}>
      <View style={styles.imageWrapper}>
        {/* Wishlist Button */}
        {/*
        {isAuthenticated && (
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleWishlist(product.id)}
          >
            <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
              <Path
                d="M10.433 4.856l-.445.43a.618.618 0 00.89 0l-.445-.43zM8.31 15.431c-1.25-.986-2.617-1.948-3.701-3.169-1.062-1.197-1.805-2.593-1.805-4.406H1.567c0 2.199.916 3.876 2.117 5.228 1.18 1.328 2.684 2.392 3.86 3.319l.766-.972zM2.804 7.856c0-1.773 1.002-3.261 2.37-3.887 1.33-.608 3.116-.447 4.814 1.316l.89-.857C8.867 2.336 6.529 1.99 4.66 2.844c-1.826.835-3.093 2.775-3.093 5.012h1.237zm4.74 8.547c.423.333.877.687 1.336.956.46.27.984.487 1.553.487v-1.237c-.256 0-.556-.1-.929-.318s-.76-.518-1.194-.86l-.766.972zm5.778 0c1.176-.928 2.68-1.99 3.86-3.32 1.202-1.352 2.117-3.028 2.117-5.227h-1.237c0 1.813-.742 3.209-1.805 4.406-1.084 1.221-2.45 2.183-3.701 3.169l.766.972zM19.3 7.856c0-2.237-1.266-4.177-3.093-5.012-1.867-.854-4.204-.508-6.218 1.583l.89.858c1.698-1.762 3.484-1.924 4.814-1.316 1.368.626 2.37 2.113 2.37 3.887h1.237zm-6.743 7.575c-.434.342-.82.643-1.194.86-.374.218-.673.318-.929.318v1.237c.57 0 1.094-.219 1.553-.487.46-.269.913-.623 1.336-.956l-.766-.972z"
                fill={
                  addedInWishlist ? "#FF4B84" : "url(#paint0_linear_108_412)"
                }
              />
              <Defs>
                <LinearGradient
                  id="paint0_linear_108_412"
                  x1={10.4331}
                  y1={2.41016}
                  x2={10.4331}
                  y2={17.8459}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#54CAFF" />
                  <Stop offset={1} stopColor="#275AE8" />
                </LinearGradient>
              </Defs>
            </Svg>
          </TouchableOpacity>
        )}
        */}

        <Link href={`/productDetail?id=${product.id}`} style={styles.link}>
          <ImageBackground
            source={placeholderImage}
            style={styles.imageBg}
            imageStyle={styles.imageStyle}
          >
            <Image
              source={thumbnailSource}
              style={[styles.imageOverlay, styles.imageStyle]}
              onError={handleImgError}
            />
          </ImageBackground>
        </Link>
      </View>

      <View style={styles.productCardContent}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.productCardName}
          allowFontScaling={false}
        >
          {product.name}
        </Text>
        <View style={styles.priceContainer}>
          {hasDiscount && (
            <Text
              style={[styles.productCardPrice, styles.originalPrice]}
              allowFontScaling={false}
            >
              {Number(product.price).toLocaleString()} Ks
            </Text>
          )}

          <Text
            style={[
              styles.productCardPrice,
              hasDiscount && styles.discountPrice,
            ]}
            allowFontScaling={false}
          >
            {Number(
              hasDiscount ? product.discount_price! : product.price
            ).toLocaleString()}{" "}
            Ks
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    width: CARD_WIDTH,
    // margin: (SCREEN_WIDTH - CARD_WIDTH * 2) / 4, // center two cards per row
  },
  imageWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    width: "100%",
    height: "100%",
  },
  imageBg: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0000001A",
  },
  productCardContent: {
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  productCardName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Saira-Bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productCardPrice: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Regular",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#888888",
    marginRight: 6,
  },
  discountPrice: {
    color: "#D32F2F",
  },
  favButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
