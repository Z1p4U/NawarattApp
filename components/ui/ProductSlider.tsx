import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ProductCard, { ProductCardProps } from "./ProductCard";

interface ProductSliderProps {
  products: ProductCardProps[] | null;
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
