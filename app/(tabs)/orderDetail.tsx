import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import { Link, useRouter } from "expo-router";
import useAuth from "@/redux/hooks/auth/useAuth";
import useOrderDetail from "@/redux/hooks/order/useOrderDetail";
import { useSearchParams } from "expo-router/build/hooks";
import Svg, { Circle, Path } from "react-native-svg";
import GoBack from "@/components/ui/GoBack";

export default function OrderDetail() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("id")) || 0;
  const router = useRouter();
  const {
    orderDetail,
    loading: orderLoading,
    handleLoadOrderDetail,
  } = useOrderDetail(orderId);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await handleLoadOrderDetail();
    } catch (e) {
      console.error("Failed to fetch:", e);
    } finally {
      setRefreshing(false);
    }
  }, [handleLoadOrderDetail]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const od = orderDetail!;

  let currentStep = 0;
  const fullyPaid = od?.paid_amount >= od?.total_amount;
  if (fullyPaid) currentStep = 1;
  if (od?.status === "delivering") currentStep = 2;
  if (od?.status === "delivered") currentStep = 3;

  const steps = ["Payment Pending", "Paid", "Delivering", "Delivered"].map(
    (label, i) => ({
      label,
      done: i <= currentStep,
    })
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  if (orderLoading) {
    return (
      <>
        <HeadLine />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </>
    );
  }

  return (
    <>
      <HeadLine />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner */}
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Text style={styles.headText} allowFontScaling={false}>
            Order Detail
          </Text>
        </LinearGradient>

        <GoBack to={"/orderHistory"} />

        {/* Timeline */}
        <View style={styles.timeline}>
          {steps.map((s, i) => (
            <View key={i} style={styles.stepContainer}>
              <Svg width={24} height={24}>
                <Circle
                  cx={12}
                  cy={12}
                  r={10}
                  fill={s.done ? "#53CAFE" : "#ddd"}
                />
                {s.done && (
                  <Path
                    d="M8 12l2 2l4-4"
                    stroke="#fff"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </Svg>

              <Text style={styles.stepLabel} allowFontScaling={false}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.col}>
              <View>
                <Text style={styles.metaLabel} allowFontScaling={false}>
                  Order Code
                </Text>
                <Text style={styles.metaValue} allowFontScaling={false}>
                  {od?.order_code}
                </Text>
              </View>

              <View>
                <Text style={styles.metaLabel} allowFontScaling={false}>
                  Order Date
                </Text>
                <Text style={styles.metaValue} allowFontScaling={false}>
                  {formatDate(od?.date)}
                </Text>
              </View>

              <View>
                <Text style={styles.metaLabel} allowFontScaling={false}>
                  Order Status
                </Text>
                <Text
                  style={[
                    styles.metaValue,
                    od?.status === "submitted"
                      ? styles.submitted
                      : od?.status === "confirmed"
                      ? styles.confirmed
                      : od?.status === "payment_pending"
                      ? styles.delivering
                      : od?.status === "delivering"
                      ? styles.delivering
                      : od?.status === "delivered"
                      ? styles.delivered
                      : od?.status === "canceled"
                      ? styles.canceled
                      : styles.defaultStatus,
                  ]}
                  allowFontScaling={false}
                >
                  {od?.status === "delivering"
                    ? "Delivering"
                    : od?.status.charAt(0).toUpperCase() + od?.status.slice(1)}
                </Text>
              </View>

              <View>
                <Text style={styles.metaLabel} allowFontScaling={false}>
                  Payment Status
                </Text>
                <Text
                  style={[
                    styles.metaValue,
                    fullyPaid ? styles.paid : styles.unpaid,
                  ]}
                  allowFontScaling={false}
                >
                  {fullyPaid ? "Paid" : "Unpaid"}
                </Text>
              </View>

              <View>
                <Text style={styles.metaLabel} allowFontScaling={false}>
                  Address
                </Text>
                <Text style={styles.metaValue} allowFontScaling={false}>
                  {od?.address_book.address}
                </Text>
              </View>
            </View>

            {/* <View style={styles.col}>
              <Text style={styles.metaLabel} allowFontScaling={false}>Shipping Method</Text>
              <Text style={styles.metaValue}>
                {od?.shipping_method || "Standard Delivery"}
              </Text>

              <Text style={styles.metaLabel} allowFontScaling={false}>Payment Method</Text>
              <Text style={styles.metaValue} allowFontScaling={false}>{od?.payment_method || "Mpu"}</Text>

              <Text style={styles.totalAmount} allowFontScaling={false}>
                Ks{od?.total_amount.toLocaleString()}
              </Text>
            </View> */}
          </View>
        </View>

        {/* Ordered Products */}
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          Ordered Product
        </Text>
        {od?.order_items.map((item) => (
          <View key={item.id} style={styles?.orderEach}>
            <View style={styles.itemRow}>
              <Text
                style={styles.itemName}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {item.product?.name || "—"}
              </Text>
              <Text style={styles.itemQty} allowFontScaling={false}>
                {item.qty}
              </Text>
              <Text style={styles.itemPrice} allowFontScaling={false}>
                Ks{item.sub_total_amount.toLocaleString()}
              </Text>
            </View>

            {/* Combo Items, if any */}
            {item?.product?.combo_items &&
              item?.product?.combo_items.length > 0 && (
                <View style={styles.comboContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                  >
                    {item?.product?.combo_items?.map((ci) =>
                      ci.product ? (
                        <View key={ci.id} style={styles.comboItemRow}>
                          <Image
                            source={{ uri: ci.product.thumbnail }}
                            style={styles.comboItemImage}
                          />
                          <Text
                            style={styles.comboItemText}
                            allowFontScaling={false}
                          >
                            {ci.product.name} × {ci.qty}
                          </Text>
                        </View>
                      ) : null
                    )}
                  </ScrollView>
                </View>
              )}
          </View>
        ))}

        {/* Totals Breakdown */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              SUB TOTAL
            </Text>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              Ks {od?.total_amount.toLocaleString()}
            </Text>
          </View>
          {/* <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel} allowFontScaling={false}>TAX</Text>
            <Text style={styles.summaryValue} allowFontScaling={false}>Ks{od?.tax_amount || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel} allowFontScaling={false}>SHIPPING COST</Text>
            <Text style={styles.summaryValue} allowFontScaling={false}>Ks{od?.shipping_cost || 0}</Text>
          </View> */}

          {od?.status?.toLowerCase() === "confirmed" && (
            <Link href={`/orderPay?id=${od?.id}`} style={{ marginTop: 30 }}>
              <LinearGradient
                colors={["#54CAFF", "#275AE8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.newAddress}
              >
                <Text style={styles.chatText} allowFontScaling={false}>
                  Pay For Order
                </Text>
              </LinearGradient>
            </Link>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 10,
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

  timeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  stepContainer: {
    flex: 1,
    gap: 15,
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  row: { flexDirection: "row" },
  col: { flex: 1, paddingHorizontal: 5, rowGap: 5 },

  metaLabel: {
    fontSize: 12,
    color: "#444",
    marginTop: 6,
    fontFamily: "Saira-Medium",
  },
  metaValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  paid: {
    color: "#22C55E",
  },
  unpaid: {
    color: "#EF4444",
  },
  submitted: {
    color: "#D97706",
  },
  confirmed: {
    color: "#10B981",
  },
  delivering: {
    color: "#F97316",
  },
  delivered: {
    color: "#0EA5E9",
  },
  canceled: {
    color: "#DC2626",
  },
  defaultStatus: {
    color: "#000000",
  },
  totalAmount: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
    fontFamily: "Saira-Medium",
  },

  sectionTitle: {
    color: "#2555E7",
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },

  orderEach: {
    marginHorizontal: 20,
  },
  comboContainer: {
    paddingHorizontal: 10,
  },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Saira-Medium",
  },
  itemQty: {
    width: 80,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Saira-Medium",
  },
  itemPrice: {
    width: 80,
    textAlign: "right",
    fontSize: 14,
    fontFamily: "Saira-Medium",
  },

  summary: {
    marginHorizontal: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#444",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Saira-Bold",
  },

  comboItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  comboItemImage: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
  },
  comboItemText: {
    fontSize: 12,
    fontFamily: "Saira-Medium",
    color: "#333",
  },
  newAddress: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
