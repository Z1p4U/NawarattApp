import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

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
    return <Image source={{ uri: item.image }} style={styles.carouselImage} />;
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={width}
        height={180}
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
    borderRadius: 30,
    width: "100%",
    aspectRatio: "2/1",
    alignSelf: "center",
    overflow: "hidden",
    marginTop: 30,
    marginBottom: -150,
    boxShadow: "0px 4px 4px 0px #00000026",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
