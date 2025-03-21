import HeadLine from "@/components/ui/HeadLine";
import QuantityControl from "@/components/ui/QuantityControl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Cart() {
  const [data, setData] = useState([]);

  const getCartItems = async () => {
    try {
      const storedData = await AsyncStorage.getItem("cart");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setData(parsedData); // Update state with the cart items from AsyncStorage
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  // Update Item Quantity
  const updateQuantity = async (productId, newCount) => {
    try {
      const updatedCart = data.map((item) =>
        item.pdData.id === productId
          ? { ...item, count: newCount, total: newCount * item.pdData.price }
          : item
      );

      setData(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem("cart");
      setData([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const calculateTotal = () => {
    return data.reduce((acc, item) => acc + item.total, 0);
  };

  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <Text style={styles.headText}>Cart</Text>
        </LinearGradient>

        <View>
          <TouchableOpacity
            style={styles.clearContainer}
            onPress={() => clearCart()}
          >
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          {data.map((item, index) => (
            <View key={index} style={styles.pdCard}>
              <Image
                source={{ uri: item?.pdData?.images[0] }}
                style={styles.pdCardImg}
              />
              <View style={styles.pdCardInfo}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.pdCardName}
                >
                  {item?.pdData?.name}
                </Text>
                <Text style={styles.pdCardCat}>
                  {item?.pdData?.category.join(" , ")}
                </Text>
                <View style={styles.pdCardQuantity}>
                  <Text style={styles.totalText}>
                    {item?.total?.toLocaleString()} Ks
                  </Text>

                  <View style={{ width: "100%" }}>
                    <QuantityControl
                      count={item?.count}
                      setCount={(newCount) =>
                        updateQuantity(item.pdData.id, newCount)
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

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
              <Text style={styles.buttonText}>Checkout ({data?.length})</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    position: "relative",
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 500,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  column: {
    gap: 20,
    paddingHorizontal: 15,
  },
  pdCard: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    gap: 12,
    borderRadius: 15,
    overflow: "hidden",
  },
  pdCardImg: {
    width: 75,
    height: 75,
    borderRadius: 5,
    objectFit: "contain",
    backgroundColor: "#ddd",
  },
  pdCardInfo: {
    gap: 5,
    width: "100%",
  },
  pdCardName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#000000",
    fontFamily: "Saira-bold",
    width: 260,
    textOverflow: "hidden",
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

  clearContainer: {
    paddingHorizontal: 20,
    display: "flex",
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

  confirmComponent: {
    position: "absolute",
    bottom: -200,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    boxShadow: "0px 0px 10px 2px #0000000D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 15,
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
