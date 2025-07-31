import { CardProps } from "@/constants/config";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import ProductCard from "./ProductCard";
import Loader from "./Loader";

interface ProductSliderProps {
  products: CardProps[] | null;
  loading: boolean | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.3;

const ProductSlider: React.FC<ProductSliderProps> = ({ products, loading }) => {
  if (loading || !products || products?.length === 0) {
    return <Loader />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={true}
      //   pagingEnabled={true}
      contentContainerStyle={{
        columnGap: 16,
        paddingHorizontal: 10,
      }}
    >
      {products?.map((product, index) => (
        <View key={index} style={styles.cardContainer}>
          <ProductCard product={product} width={SCREEN_WIDTH * 0.35} />
        </View>
      ))}
    </ScrollView>
  );
};

export default ProductSlider;

const styles = StyleSheet.create({
  row: {
    gap: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 15,
  },
});
