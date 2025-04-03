import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import QuantityControl from "@/components/ui/QuantityControl";
import { useFocusEffect } from "expo-router";

// Define the shape of your product data
interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string; // price as string from API; convert to number when needed
  category: string; // assuming category is a string for simplicity
  images: string[]; // array of image URLs
  thumbnail: string; // thumbnail image URL
}

// Define the shape of a cart item
interface CartItem {
  productId: string; // unique cart item id (should be unique even for same product)
  pdData: ProductData;
  count: number;
  total: number;
}

export default function Cart() {
  const [data, setData] = useState<CartItem[]>([]);

  // Retrieve cart items from AsyncStorage
  const getCartItems = async () => {
    try {
      const storedData = await AsyncStorage.getItem("cart");
      if (storedData) {
        const parsedData: CartItem[] = JSON.parse(storedData);
        setData(parsedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Load cart items whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      getCartItems();
    }, [])
  );

  // Update quantity for a specific cart item using its unique id
  const updateQuantity = async (cartItemId: string, newCount: number) => {
    try {
      const updatedCart = data.map((item) => {
        if (item.productId === cartItemId) {
          const price = Number(item.pdData.price);
          return {
            ...item,
            count: newCount,
            total: newCount * price,
          };
        }
        return item;
      });
      setData(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("cart");
      setData([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Calculate total price for all cart items
  const calculateTotal = () => {
    return data.reduce((acc, item) => acc + item.total, 0);
  };

  return (
    <>
      <HeadLine />
      {/* <SafeAreaView style={styles.safeArea}> */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <Text style={styles.headText}>Cart</Text>
        </LinearGradient>

        {/* Clear Cart Button */}
        <View style={styles.clearContainer}>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <View style={styles.column}>
          {data.map((item) => (
            <View key={item.productId} style={styles.pdCard}>
              <Image
                source={
                  item?.pdData?.images && item?.pdData?.images.length > 0
                    ? { uri: item?.pdData?.images[0] }
                    : require("@/assets/images/placeholder.jpg")
                }
                style={styles.pdCardImg}
              />
              <View style={styles.pdCardInfo}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.pdCardName}
                >
                  {item.pdData.name}
                </Text>
                <Text style={styles.pdCardCat}>{item.pdData.category}</Text>
                <View style={styles.pdCardQuantity}>
                  <Text style={styles.totalText}>
                    {item?.total?.toLocaleString()} Ks
                  </Text>
                  {/* Quantity Control */}
                  <View style={{ width: "100%" }}>
                    <QuantityControl
                      count={item.count}
                      // Pass the unique cart item id to updateQuantity
                      setCount={(newCount: number) =>
                        updateQuantity(item.productId, newCount)
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Checkout Section */}
      <View style={styles.confirmComponent}>
        <View style={styles.confirmComponentInfo}>
          <Text style={styles.confirmComponentText}>Delivery Fee - Free</Text>
          <Text style={styles.confirmComponentTotal}>
            Total - {calculateTotal()?.toLocaleString()} Ks
          </Text>
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmButton}
          >
            <Text style={styles.buttonText}>Checkout ({data.length})</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 120, // ensure space for bottom checkout bar
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  clearContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  clearText: {
    fontSize: 14,
    color: "#ff0000",
    fontFamily: "Saira-Bold",
    letterSpacing: 2,
  },
  column: {
    paddingHorizontal: 15,
  },
  pdCard: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: 10,
    flexDirection: "row",
    gap: 12,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  pdCardImg: {
    width: 75,
    height: 75,
    resizeMode: "cover",
    borderRadius: 20,
  },
  pdCardInfo: {
    flex: 1,
    gap: 5,
  },
  pdCardName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Saira-Bold",
    width: 260,
  },
  pdCardCat: {
    fontSize: 12,
    color: "#0000004D",
    fontFamily: "Saira-Regular",
  },
  pdCardQuantity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  totalText: {
    fontSize: 13,
    color: "#00000080",
    fontFamily: "Saira-Medium",
    width: 90,
  },
  confirmComponent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.select({ ios: 100, android: 20 }),
    height: "auto",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  confirmComponentInfo: {
    gap: 5,
  },
  confirmComponentText: {
    fontSize: 15,
    color: "#000000",
    fontFamily: "Saira-Regular",
  },
  confirmComponentTotal: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "Saira-Regular",
  },
  confirmButton: {
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    paddingVertical: 15,
    paddingHorizontal: 35,
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
