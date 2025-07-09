import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";
import { useRouter, Link } from "expo-router";
import useAuth from "@/redux/hooks/auth/useAuth";
import useOrder from "@/redux/hooks/order/useOrder";
import { useSearchParams } from "expo-router/build/hooks";

export default function OrderHistory() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const orderStatus = searchParams.get("status") || "";

  const {
    orders,
    loading: orderLoading,
    loadMore,
    hasMore,
    reset,
  } = useOrder({ orderStatus });
  const [refreshing, setRefreshing] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => setRefreshing(false), 800);
  }, [reset]);

  // Infinite scroll
  const onEndReached = () => {
    if (hasMore && !orderLoading && !debounceRef.current) {
      debounceRef.current = setTimeout(() => {
        loadMore();
        debounceRef.current = null;
      }, 500);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Link
      key={item?.id}
      href={`/orderDetail?id=${item.id}`}
      style={styles.cardLink}
    >
      <View style={styles.orderCard}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderCode}>{item.order_code}</Text>
          <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          <Text style={styles.orderMeta}>
            Total Products –{" "}
            <Text style={styles.metaValue}>{item.total_qty}</Text>
          </Text>
          <Text style={styles.orderMeta}>
            Status –{" "}
            <Text
              style={[
                styles.metaValue,
                item.status === "submitted"
                  ? styles.submitted
                  : item.status === "confirmed"
                  ? styles.confirmed
                  : item.status === "payment_pending"
                  ? styles.delivering
                  : item.status === "delivering"
                  ? styles.delivering
                  : item.status === "delivered"
                  ? styles.delivered
                  : item.status === "canceled"
                  ? styles.canceled
                  : styles.defaultStatus,
              ]}
            >
              {item.status}
            </Text>
          </Text>
        </View>
        <Text style={styles.orderAmount}>
          Ks {item.total_amount.toLocaleString()}
        </Text>
      </View>
    </Link>
  );

  return (
    <>
      <HeadLine />

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text style={styles.headText}>{orderStatus} Order History</Text>
            </LinearGradient>

            <GoBack to="/account" />
          </>
        }
        ListEmptyComponent={
          orderLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.centered}>
              <Text style={styles.messageText}>No orders found.</Text>
            </View>
          )
        }
        ListFooterComponent={
          hasMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          orders.length === 0 ? styles.flatListEmpty : styles.flatList
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: 15,
    paddingBottom: 120,
    backgroundColor: "#fff",
  },
  flatListEmpty: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 120,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 10,
    justifyContent: "flex-end",
    marginHorizontal: -15,
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
    textTransform: "capitalize",
  },
  centered: {
    flex: 1,
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 30,
  },
  cardLink: {
    marginTop: 10,
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
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
    gap: 4,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Saira-Medium",
    color: "#000",
  },
  orderDate: {
    fontSize: 14,
    fontFamily: "Saira-Regular",
    color: "#555",
    marginBottom: 6,
  },
  orderMeta: {
    fontSize: 13,
    fontFamily: "Saira-Regular",
    color: "#333",
  },
  metaValue: {
    fontWeight: "600",
    fontFamily: "Saira-Bold",
  },
  submitted: { color: "#D97706" },
  confirmed: { color: "#10B981" },
  delivering: { color: "#F97316" },
  delivered: { color: "#0EA5E9" },
  canceled: { color: "#DC2626" },
  defaultStatus: { color: "#000000" },
  orderAmount: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Saira-Bold",
    color: "#000",
    marginLeft: 10,
  },
});
