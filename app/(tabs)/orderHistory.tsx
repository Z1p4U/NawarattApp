import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import { useRouter } from "expo-router";
import useAuth from "@/redux/hooks/auth/useAuth";
import AddressLoader from "@/components/ui/AddressLoader";
import useOrder from "@/redux/hooks/order/useOrder";
import { Link } from "expo-router";

export default function OrderHistory() {
  const router = useRouter();
  const { orders, loading: orderLoading } = useOrder();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
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
          <Text style={styles.headText}>Order History</Text>
        </LinearGradient>

        <View style={styles.orderSection}>
          {orderLoading ? (
            <AddressLoader count={6} />
          ) : (
            orders?.map((o) => (
              <Link href={`/orderDetail?id=${o?.id}`}>
                <View key={o.id} style={styles.orderCard}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderCode}>{o.order_code}</Text>
                    <Text style={styles.orderDate}>{formatDate(o.date)}</Text>
                    <Text style={styles.orderMeta}>
                      Total Products -{" "}
                      <Text style={styles.metaValue}>{o.total_qty}</Text>
                    </Text>
                    <Text style={styles.orderMeta}>
                      Payment Status -{" "}
                      <Text
                        style={[
                          styles.metaValue,
                          o.status?.toLowerCase() === "submitted"
                            ? styles.submitted
                            : o.status?.toLowerCase() === "delivered"
                            ? styles.delivered
                            : o.status?.toLowerCase() === "canceled"
                            ? styles.canceled
                            : styles.defaultStatus,
                        ]}
                      >
                        {o.status}
                      </Text>
                    </Text>
                  </View>

                  <Text style={styles.orderAmount}>
                    Ks {o.total_amount.toLocaleString()}
                  </Text>
                </View>
              </Link>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
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

  orderSection: {
    gap: 10,
    marginHorizontal: 15,
  },
  orderCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#00000020",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  orderInfo: {
    flex: 1,
    gap: 4,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Saira-Medium",
  },
  orderDate: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Saira-Regular",
    marginBottom: 6,
  },
  orderMeta: {
    fontSize: 13,
    color: "#333",
    fontFamily: "Saira-Regular",
  },
  metaValue: {
    fontWeight: "600",
    fontFamily: "Saira-Bold",
  },
  submitted: {
    color: "#FBBF24",
  },
  delivered: {
    color: "#22C55E",
  },
  canceled: {
    color: "#EF4444",
  },
  defaultStatus: {
    color: "#000000",
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Saira-Medium",
    marginLeft: 10,
  },
});
