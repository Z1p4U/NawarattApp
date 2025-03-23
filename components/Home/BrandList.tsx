import { useNavigation } from "expo-router";
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export interface BrandListItem {
  id: string;
  thumbnail: string;
}

interface BrandListProps {
  data: BrandListItem[];
}

const BrandList: React.FC<BrandListProps> = ({ data }) => {
  const nav = useNavigation();

  return (
    <View style={styles?.brandContainer}>
      {data?.map((item) => (
        <TouchableOpacity key={item?.id} style={styles?.brand}>
          <ImageBackground
            source={require("@/assets/images/placeholder.jpg")}
            style={styles.productImageContainer}
          >
            <Image
              source={{
                uri: item.thumbnail
                  ? item.thumbnail
                  : require("@/assets/images/placeholder.jpg"),
              }}
              style={styles.productImage}
            />
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BrandList;

const styles = StyleSheet.create({
  brandContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  brand: {
    marginBottom: 15,
    width: "28%",
  },
  productImageContainer: {
    width: "100%",
    aspectRatio: "1/1",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    aspectRatio: "1/1",
    resizeMode: "cover",
  },
});
