import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface ImageCarouselItem {
  id: string;
  image: string;
  bgContain: boolean;
}

interface ImageCarouselProps {
  data: ImageCarouselItem[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ data }) => {
  const renderItem = ({ item }: { item: ImageCarouselItem }) => {
    return (
      <Image
        source={
          typeof item?.image === "string" ? { uri: item?.image } : item.image
        }
        style={styles.carouselImage}
      />
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.25}
        data={data}
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
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
