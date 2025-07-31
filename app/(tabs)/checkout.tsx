import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import Svg, { Path } from "react-native-svg";
import { useFocusEffect, useRouter } from "expo-router";
import useAddress from "@/redux/hooks/address/useAddress";
import { Address, OrderOption, OrderPayload } from "@/constants/config";
import useAuth from "@/redux/hooks/auth/useAuth";
import AddressLoader from "@/components/ui/AddressLoader";
import useOrderAction from "@/redux/hooks/order/useOrderAction";
import GoBack from "@/components/ui/GoBack";
import AlertBox from "@/components/ui/AlertBox";

interface CartItem {
  productId: string;
  pdData: {
    name: string;
    price: string;
    discountable_item_id: number | null;
  };
  count: number;
  total: number;
}

export default function Checkout() {
  const router = useRouter();
  const { addresses, loading: addressLoading } = useAddress();
  const { isAuthenticated, loading } = useAuth();
  const { createOrder, loading: orderLoading } = useOrderAction();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  const getCartItems = async () => {
    try {
      const storedData = await AsyncStorage.getItem("cart");
      if (storedData) {
        const parsedData: CartItem[] = JSON.parse(storedData);
        setCart(parsedData);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCartItems();
    }, [])
  );

  useEffect(() => {
    if (addresses) {
      setSelectedAddress(
        (prev) =>
          addresses?.find(
            (a) => a?.is_default === true || a?.is_default == 1
          ) ??
          addresses[0] ??
          null
      );
    }
  }, []);

  // 2) Whenever `addresses` changes, pick the default (or first) one
  // useEffect(() => {
  //   if (addresses?.length) {
  //     const defaultAddr = addresses.find((a) => a.is_default);
  //     setSelectedAddress(defaultAddr ?? addresses[0]);
  //   } else {
  //     setSelectedAddress(null);
  //   }
  // }, [addresses]);

  const totalAmount = cart?.reduce((sum, item) => sum + item.total, 0);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // <— annotate the payload so TS knows it must be OrderPayload

    const payload: OrderPayload = {
      address_book_id: selectedAddress.id,
      remark: "remark",
      items: cart.map((item) => ({
        product_id: Number(item.productId),
        qty: item.count,
        unit_price: Number(item.pdData.price),
        option: "phone" as OrderOption,
        discountable_item_id: item?.pdData?.discountable_item_id,
      })),
    };

    try {
      const result = await createOrder(payload);
      // console.log("Order placed!", result);
      setAlertModalVisible(true);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order. Please try again.");
    }
  }, [cart, selectedAddress, router]);

  const onClose = async () => {
    await AsyncStorage.removeItem("cart");
    setAgreed(false);
    router.push("/catalog");
    setAlertModalVisible(false);
  };

  return (
    <>
      <HeadLine />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Text style={styles.headText} allowFontScaling={false}>
            Checkout
          </Text>
        </LinearGradient>

        <GoBack to={"/cart"} />

        <View style={{ paddingHorizontal: 15 }}>
          {/* Selected Address */}
          <Text style={styles.deliAddress} allowFontScaling={false}>
            Delivery Address
          </Text>
          <TouchableOpacity
            style={[styles.addressCard, { marginVertical: 16 }]}
            onPress={() => setModalVisible(true)}
          >
            <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
              <Path
                d="M23.75 22.75H1.25m0-12.375l4.57-3.656m17.93 3.656l-9.142-7.313a3.375 3.375 0 00-4.216 0l-.88.704m6.925.421v-2.25A.563.563 0 0117 1.375h2.813a.562.562 0 01.562.563v5.625M3.5 22.75V8.687m18 0v4.5m0 9.563v-5.063"
                stroke="#000"
                strokeOpacity={0.5}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <Path
                d="M15.875 22.75v-5.625c0-1.59 0-2.386-.495-2.88-.493-.495-1.288-.495-2.88-.495-1.592 0-2.386 0-2.88.495m-.495 8.505v-5.625"
                stroke="#000"
                strokeOpacity={0.5}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M14.75 8.688a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                stroke="#000"
                strokeOpacity={0.5}
                strokeWidth={1.5}
              />
            </Svg>
            <View style={styles.addressCardDiv}>
              {selectedAddress ? (
                <>
                  <Text style={styles.addressCardHead} allowFontScaling={false}>
                    Address {selectedAddress.id}
                    {(selectedAddress.is_default === true ||
                      selectedAddress.is_default === 1 ||
                      selectedAddress.is_default === "1") &&
                      "(Default)"}
                  </Text>
                  <Text style={styles.addressCardText} allowFontScaling={false}>
                    {selectedAddress.address}, {selectedAddress.city.name_en},{" "}
                    {selectedAddress.state.name_en},{" "}
                    {selectedAddress.country.name_en}
                  </Text>
                </>
              ) : (
                <Text style={styles.addressCardText} allowFontScaling={false}>
                  Tap to select address
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Order Summary */}
          <Text style={styles.orderSummary} allowFontScaling={false}>
            Order Summary
          </Text>
          {cart.map((item) => (
            <View key={item.productId} style={styles.summaryRow}>
              <Text style={styles.summaryText} allowFontScaling={false}>
                {item.pdData.name} × {item.count}
              </Text>
              <Text style={styles.summaryText} allowFontScaling={false}>
                {item.total.toLocaleString()} Ks
              </Text>
            </View>
          ))}

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <View
                style={{ alignItems: "center", gap: 10, flexDirection: "row" }}
              >
                <Svg width={20} height={16} viewBox="0 0 20 16" fill="none">
                  <Path
                    d="M2 0a2 2 0 00-2 2v4a2 2 0 110 4v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 010-4V2a2 2 0 00-2-2H2zm11.5 3L15 4.5 6.5 13 5 11.5 13.5 3zm-6.69.04a1.77 1.77 0 110 3.54 1.77 1.77 0 010-3.54zm6.38 6.38a1.77 1.77 0 110 3.54 1.77 1.77 0 010-3.54z"
                    fill="#3173ED"
                  />
                </Svg>
                <Text style={styles.summaryText} allowFontScaling={false}>
                  SubTotal
                </Text>
              </View>
              <Text style={styles.summaryText} allowFontScaling={false}>
                {totalAmount.toLocaleString()} Ks
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <View
                style={{ alignItems: "center", gap: 7, flexDirection: "row" }}
              >
                <Text style={styles.summaryTextBold} allowFontScaling={false}>
                  Total
                </Text>
                <Text style={styles.summaryTextDim} allowFontScaling={false}>
                  (Including Tax)
                </Text>
              </View>
              <Text style={styles.summaryText} allowFontScaling={false}>
                {totalAmount.toLocaleString()} Ks
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.placeOrderComponent}>
        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => setAgreed(!agreed)}
        >
          <View style={[styles.radioCircle, agreed && styles.selected]} />
          <Text style={styles.placeOrderComponentText} allowFontScaling={false}>
            I&apos;d read and agree to Terms and Conditions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePlaceOrder}
          style={styles.placeOrderBtn}
          disabled={orderLoading || !agreed}
        >
          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.placeOrderBtn}
          >
            {orderLoading ? (
              <ActivityIndicator size="large" color="#2555E7" />
            ) : (
              <Text style={styles.placeOrderText} allowFontScaling={false}>
                Place Order
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Select Address
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose} allowFontScaling={false}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {addressLoading ? (
              <AddressLoader count={10} />
            ) : (
              addresses?.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  onPress={() => {
                    setSelectedAddress(addr);
                    setModalVisible(false);
                  }}
                  style={[styles.addressCard, { marginBottom: 12 }]}
                >
                  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
                    <Path
                      d="M23.75 22.75H1.25m0-12.375l4.57-3.656m17.93 3.656l-9.142-7.313a3.375 3.375 0 00-4.216 0l-.88.704m6.925.421v-2.25A.563.563 0 0117 1.375h2.813a.562.562 0 01.562.563v5.625M3.5 22.75V8.687m18 0v4.5m0 9.563v-5.063"
                      stroke="#000"
                      strokeOpacity={0.5}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <Path
                      d="M15.875 22.75v-5.625c0-1.59 0-2.386-.495-2.88-.493-.495-1.288-.495-2.88-.495-1.592 0-2.386 0-2.88.495m-.495 8.505v-5.625"
                      stroke="#000"
                      strokeOpacity={0.5}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M14.75 8.688a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      stroke="#000"
                      strokeOpacity={0.5}
                      strokeWidth={1.5}
                    />
                  </Svg>
                  <View style={styles.addressCardDiv}>
                    <Text
                      style={styles.addressCardHead}
                      allowFontScaling={false}
                    >
                      Address {addr.id}
                      {(addr.is_default === true ||
                        addr.is_default === 1 ||
                        addr.is_default === "1") &&
                        "(Default)"}
                    </Text>
                    <Text
                      style={styles.addressCardText}
                      allowFontScaling={false}
                    >
                      {addr.address}, {addr.city.name_en}, {addr.state.name_en},{" "}
                      {addr.country.name_en}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <AlertBox
        visible={alertModalVisible}
        message="Order Placed!"
        onClose={onClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 120, // ensure space for bottom area
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },

  deliAddress: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
  },
  addressCard: {
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    gap: 20,
  },
  addressCardDiv: {
    gap: 10,
  },
  addressCardHead: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
  },
  addressCardText: {
    fontSize: 14,
    color: "#0000004D",
    fontFamily: "Saira-Medium",
  },
  orderSummary: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
    marginTop: 20,
    marginBottom: 12,
  },
  summary: {
    marginTop: 10,
    borderTopColor: "#00000040",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Saira-Regular",
  },
  summaryTextBold: {
    fontSize: 18,
    fontWeight: 700,
    color: "#000",
    fontFamily: "Saira-Bold",
  },
  summaryTextDim: {
    fontSize: 14,
    color: "#00000050",
    fontFamily: "Saira-Regular",
  },

  placeOrderComponent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.select({ ios: 100, android: 20 }),
    height: "auto",
    gap: 10,
    marginHorizontal: 10,
  },
  placeOrderComponentText: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Saira-Regular",
  },
  placeOrderBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 1000,
    borderWidth: 4,
    borderColor: "#D9D9D9",
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },
  selected: {
    backgroundColor: "#275AE8",
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalClose: {
    fontSize: 16,
    color: "#007AFF",
  },
  modalContent: {
    padding: 16,
    backgroundColor: "#fff",
  },
});
