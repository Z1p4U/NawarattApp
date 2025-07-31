import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";
import { useRouter } from "expo-router";
import useNotification from "@/redux/hooks/notification/useNotification";
import useAuth from "@/redux/hooks/auth/useAuth";

export default function Notifications() {
  const router = useRouter();
  const {
    notifications,
    loading: notificationLoading,
    loadMore,
    hasMore,
    reset,
  } = useNotification();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // redirect to login if necessary
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // pull‑to‑refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reset(); // clear & reload first page
    setTimeout(() => setRefreshing(false), 800);
  }, [reset]);

  // infinite scroll
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onEndReached = () => {
    if (!hasMore || notificationLoading) return;
    if (!debounceRef.current) {
      debounceRef.current = setTimeout(() => {
        loadMore();
        debounceRef.current = null;
      }, 500);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const { data } = item;
    return (
      <TouchableOpacity
        onPress={() => {
          if (data.type === "order" && data.order_id) {
            router.push(`/orderDetail?id=${data.order_id}`);
          } else if (data.type === "promotion" && data.discountable_id) {
            router.push(
              `/productListByCampaign?id=${data.discountable_id}&name=${data.title}&image=${data?.image}&expire=${data?.end_date}`
            );
          } else {
            router.push("/");
          }
        }}
        style={styles.notificationCardWrapper}
      >
        <View style={styles.notificationCard}>
          <Text style={styles.notificationCardTitle}>{data.title}</Text>
          <Text style={styles.notificationCardDescription}>
            {data.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmpty = () => {
    if (!isAuthenticated) {
      return (
        <View style={styles.bodyCentered}>
          <Text style={styles.messageText} allowFontScaling={false}>
            Please
            <Text onPress={() => router.push("/login")} style={styles.linkText}>
              {" "}
              log in{" "}
            </Text>
            to view your notifications.
          </Text>
        </View>
      );
    }
    if (notificationLoading) {
      return (
        <View style={styles.bodyCentered}>
          <ActivityIndicator size="large" color="#2555E7" />
        </View>
      );
    }
    return (
      <View style={styles.bodyCentered}>
        <Text style={styles.messageText} allowFontScaling={false}>
          You have no notifications.
        </Text>
      </View>
    );
  };

  return (
    <>
      <HeadLine />
      <FlatList
        style={styles.flatList} // <— add this
        data={notifications}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        numColumns={1}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text style={styles.headText} allowFontScaling={false}>
                Notifications
              </Text>
            </LinearGradient>
            <GoBack to="/" />
          </>
        }
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2555E7" />
            </View>
          ) : null
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.container,
          notifications.length === 0 && styles.containerEmpty,
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1, // <— ensure FlatList itself grows
    backgroundColor: "#fff",
  },
  container: {
    paddingBottom: 120,
  },
  containerEmpty: {
    flexGrow: 1,
    justifyContent: "center",
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
  },
  notificationCardWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  notificationCard: {
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  notificationCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
  },
  notificationCardDescription: {
    fontSize: 14,
    color: "#0000004D",
    fontFamily: "Saira-Medium",
  },
  loadingContainer: {
    paddingVertical: 30,
  },
  bodyCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  linkText: {
    color: "#52C5FE",
    textDecorationLine: "underline",
  },
});
