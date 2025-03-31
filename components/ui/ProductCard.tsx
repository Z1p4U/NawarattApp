import React from "react";
import { Link } from "expo-router";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

export interface ProductCardProps {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<{ product: ProductCardProps }> = ({ product }) => {
  return (
    <>
      <Link
        href={`/productDetail?id=${product?.id}`}
        style={styles.productCard}
        key={product?.id}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri: product?.thumbnail
                ? product?.thumbnail
                : require("@/assets/images/placeholder.jpg"),
            }}
            style={styles.productImage}
          />
          <TouchableOpacity style={styles.favButton}>
            <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
              <Path
                d="M10.4331 4.85618L9.98776 5.28505C10.0455 5.34491 10.1146 5.39253 10.1912 5.42506C10.2677 5.45758 10.35 5.47434 10.4331 5.47434C10.5163 5.47434 10.5986 5.45758 10.6751 5.42506C10.7516 5.39253 10.8208 5.34491 10.8785 5.28505L10.4331 4.85618ZM8.31023 15.431C7.05992 14.4455 5.69332 13.483 4.60879 12.2624C3.54652 11.0648 2.80425 9.66855 2.80425 7.85577H1.56714C1.56714 10.0545 2.4826 11.7321 3.68425 13.0838C4.86363 14.4116 6.36796 15.4756 7.54405 16.4026L8.31023 15.431ZM2.80425 7.85577C2.80425 6.08257 3.80631 4.59474 5.17456 3.96876C6.50405 3.36092 8.29044 3.52175 9.98776 5.28505L10.8785 4.42814C8.86611 2.33577 6.52714 1.9902 4.65992 2.84381C2.83394 3.67928 1.56714 5.61907 1.56714 7.85577H2.80425ZM7.54405 16.4026C7.96714 16.7358 8.42075 17.0904 8.88013 17.3593C9.33951 17.6281 9.86405 17.8459 10.4331 17.8459V16.6088C10.1774 16.6088 9.87724 16.5098 9.50446 16.2912C9.13085 16.0735 8.74405 15.7733 8.31023 15.431L7.54405 16.4026ZM13.3222 16.4026C14.4983 15.4747 16.0026 14.4125 17.182 13.0838C18.3836 11.7312 19.2991 10.0545 19.2991 7.85577H18.062C18.062 9.66855 17.3197 11.0648 16.2574 12.2624C15.1729 13.483 13.8063 14.4455 12.556 15.431L13.3222 16.4026ZM19.2991 7.85577C19.2991 5.61907 18.0331 3.67928 16.2063 2.84381C14.3391 1.9902 12.0018 2.33577 9.98776 4.42732L10.8785 5.28505C12.5758 3.52257 14.3622 3.36092 15.6917 3.96876C17.0599 4.59474 18.062 6.08175 18.062 7.85577H19.2991ZM12.556 15.431C12.1222 15.7733 11.7354 16.0735 11.3618 16.2912C10.9882 16.509 10.6888 16.6088 10.4331 16.6088V17.8459C11.0022 17.8459 11.5267 17.6273 11.9861 17.3593C12.4463 17.0904 12.8991 16.7358 13.3222 16.4026L12.556 15.431Z"
                fill="url(#paint0_linear_108_412)"
              />
              <Defs>
                <LinearGradient
                  id="paint0_linear_108_412"
                  x1="10.4331"
                  y1="2.41016"
                  x2="10.4331"
                  y2="17.8459"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#54CAFF" />
                  <Stop offset="1" stopColor="#275AE8" />
                </LinearGradient>
              </Defs>
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.productCardContent}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.productCardName}
          >
            {product?.name}
          </Text>
          <Text style={styles.productCardPrice}>
            {Number(product?.price)?.toLocaleString()} Ks
          </Text>
        </View>
      </Link>
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  productCard: {
    gap: 10,
  },
  productImage: {
    width: "100%",
    aspectRatio: "1/1",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,
  },
  productCardContent: {
    paddingTop: 10,
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

  favButton: {
    width: 34,
    height: 34,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
  },
});
