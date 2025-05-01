import { CardProps } from "@/constants/config";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ProductCard from "./ProductCard";
import Loader from "./Loader";

interface ProductSliderProps {
  products: CardProps[] | null;
  loading: boolean | null;
}

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
    marginRight: 16,
  },
});
