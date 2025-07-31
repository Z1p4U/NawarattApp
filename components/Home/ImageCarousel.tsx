import { Campaign } from "@/constants/config";
import useCampaign from "@/redux/hooks/campaign/useCampaign";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type Placeholder = number;
interface ImageCarouselProps {
  campaigns: Campaign[];
}

const placeholderImage: Placeholder = require("../../assets/images/banner-placeholder.png");

const ImageCarousel: React.FC<ImageCarouselProps> = ({ campaigns }) => {
  const renderItem = ({ item }: { item: Campaign }) => {
    const thumbnailSource =
      typeof item.image === "string" ? { uri: item.image } : placeholderImage;

    // const handleImgError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    //   console.warn(
    //     `Failed to load image for product ${item.id}:`,
    //     e.nativeEvent.error
    //   );
    // };

    return (
      <Link
        href={`/productListByCampaign?id=${item.id}&name=${item?.title}&image=${item?.image}&expire=${item?.end_date}`}
        style={styles.link}
      >
        <ImageBackground
          source={placeholderImage}
          style={styles.imageBg}
          imageStyle={styles.imageStyle}
        >
          <Image
            source={thumbnailSource}
            style={[styles.imageOverlay, styles.imageStyle]}
            // onError={handleImgError}
          />
        </ImageBackground>
      </Link>
    );
  };

  // <Image
  //   source={typeof item?.image === "string" ? { uri: item?.image } : item.image}
  //   style={styles.carouselImage}
  // />;

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.25}
        data={campaigns}
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
