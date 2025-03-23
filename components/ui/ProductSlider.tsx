import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ProductCard from "./ProductCard";

export interface ProductSliderItem {
  id: string;
  image: string;
  name: string;
  price: number;
}

interface ProductSliderProps {
  data: ProductSliderItem[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ data }) => {
  const nav = useNavigation();

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
      {data?.map((item, index) => (
        <View style={styles.cardContainer}>
          <ProductCard key={index} item={item} />
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
