import { useNavigation } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
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
      }}
    >
      {data.map((item, index) => (
        <ProductCard key={index} item={item} />
      ))}
    </ScrollView>
  );
};

export default ProductSlider;

const styles = StyleSheet.create({
  row: {
    gap: 20,
  },
});
