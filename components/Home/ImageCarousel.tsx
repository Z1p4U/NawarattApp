import { AppBanner } from "@/constants/config";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Link } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
type Placeholder = number;
interface ImageCarouselProps {
  banners: AppBanner[];
}

const placeholderImage: Placeholder = require("../../assets/images/banner-placeholder.png");

const isCampaignBanner = (
  b: AppBanner
): b is AppBanner & { discountable: any } =>
  b.type === "campaign" && (b as any).discountable != null;

const ImageCarousel: React.FC<ImageCarouselProps> = ({ banners }) => {
  const renderItem = ({ item }: { item: AppBanner }) => {
    // choose the correct image source depending on banner type
    const imageUri =
      isCampaignBanner(item) && item.discountable
        ? item.discountable.image
        : (item as any).image;

    const thumbnailSource =
      typeof imageUri === "string" && imageUri.length > 0
        ? { uri: imageUri }
        : placeholderImage;

    const imageInner = (
      <ImageBackground
        source={placeholderImage}
        style={styles.imageBg}
        imageStyle={styles.imageStyle}
      >
        <Image
          source={thumbnailSource}
          style={[styles.imageOverlay, styles.imageStyle]}
        />
      </ImageBackground>
    );

    // If campaign — wrap in Link and route to discountable details
    if (isCampaignBanner(item) && item.discountable) {
      const disc = item.discountable;
      const href = `/productListByCampaign?id=${encodeURIComponent(
        String(disc.id)
      )}&name=${encodeURIComponent(
        disc.title ?? ""
      )}&image=${encodeURIComponent(
        disc.image ?? ""
      )}&expire=${encodeURIComponent(disc.end_date ?? "")}`;

      return (
        <Link href={href as any} style={styles.link}>
          {imageInner}
        </Link>
      );
    }

    // Otherwise info banner — show the image only (not clickable)
    return <View style={styles.link}>{imageInner}</View>;
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.25}
        data={banners}
        renderItem={renderItem}
        autoPlay={true}
        autoPlayInterval={5000}
      />
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: -80,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
    marginHorizontal: 20,
    alignSelf: "center",
    overflow: "hidden",
    boxShadow: "0px 4px 4px 0px #00000026",
    zIndex: 10000,
  },
  link: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
  },
  imageBg: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
  },
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0000001A",
  },
});
