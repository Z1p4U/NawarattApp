import { useNavigation } from "expo-router";
import React from "react";
import { ScrollView, Text, StyleSheet, View, Image } from "react-native";

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
    >
      {data.map((item) => (
        <View style={styles.productCard} key={item?.id}>
          <Image source={{ uri: item?.image }} style={styles.productImage} />

          <View style={styles.productCardContent}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.productCardName}
            >
              {item?.name}
            </Text>
            <Text style={styles.productCardPrice}>
              {item?.price?.toLocaleString()} Ks
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ProductSlider;

const styles = StyleSheet.create({
  productCard: {
    gap: 10,
    marginRight: 15,
    maxWidth: 140,
  },
  productImage: {
    width: 135,
    height: 135,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,
  },
  productCardContent: {
    paddingHorizontal: 8,
  },
  productCardName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Saira-Bold",
  },
  productCardPrice: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Regular",
  },
});
