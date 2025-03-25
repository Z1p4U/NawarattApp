import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ProductCard from "./ProductCard";

export interface ProductSliderItem {
  id: string;
  images: string[];
  thumbnail: string;
  name: string;
  price: number;
}

interface ProductSliderProps {
  products: ProductSliderItem[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={true}
      //   pagingEnabled={true}
      contentContainerStyle={{
        columnGap: 16,
        marginRight: 15,
      }}
    >
      {products?.map((product, index) => (
        <View key={index} style={styles.cardContainer}>
          <ProductCard product={product} />
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
    width: 150,
  },
});
