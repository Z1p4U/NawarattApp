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

export interface BrandListItem {
  id: string;
  image: string;
}

interface BrandListProps {
  data: BrandListItem[];
}

const BrandList: React.FC<BrandListProps> = ({ data }) => {
  const nav = useNavigation();

  return (
    <View style={styles?.brandContainer}>
      {data.map((item) => (
        <TouchableOpacity key={item?.id} style={styles?.brand}>
          <Image source={{ uri: item?.image }} style={styles.brandImage} />
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
  },
  brand: {
    marginRight: 14,
    marginBottom: 15,
  },
  brandImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,
  },
});
