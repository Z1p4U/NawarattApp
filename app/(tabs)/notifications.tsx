import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";
import { useRouter } from "expo-router";
import useNotification from "@/redux/hooks/notification/useNotification";
import useAuth from "@/redux/hooks/auth/useAuth";
import useGlobalNotification from "@/redux/hooks/notification/useGlobalNotification";

type TabKey = "global" | "user";

export default function Notifications() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  // user-specific notifications
  const {
    notifications,
    loading: notificationLoading,
    loadMore,
    hasMore,
    reset,
  } = useNotification();

  // global notifications
  const {
    globalNotifications,
    loading: globalNotificationLoading,
    loadMore: loadMoreGlobalNotifications,
    hasMore: hasMoreGlobalNotifications,
    reset: resetGlobalNotifications,
  } = useGlobalNotification();

  // UI state
  const [activeTab, setActiveTab] = useState<TabKey>("global"); // default to global
  const [refreshing, setRefreshing] = useState(false);

  // debounce for infinite scroll
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // When switching tabs, reset and reload the active tab data
  useEffect(() => {
    if (activeTab === "global") {
      resetGlobalNotifications();
    } else {
      // if user attempts to switch to user tab while not authenticated, redirect to login
      if (!authLoading && !isAuthenticated) {
        router.push("/login");
        setActiveTab("global"); // keep them on global
        return;
      }
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Pull-to-refresh: call the active tab's reset
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (activeTab === "global") {
      resetGlobalNotifications();
    } else {
      reset();
    }
    // mirror your prior behaviour: short timeout for UX; ideally replace with real completion callback
    setTimeout(() => setRefreshing(false), 800);
  }, [activeTab, reset, resetGlobalNotifications]);

  // infinite scroll handler that delegates to the active list
  const onEndReached = () => {
    if (debounceRef.current) return;

    if (activeTab === "global") {
      if (globalNotificationLoading || !hasMoreGlobalNotifications) return;
      debounceRef.current = setTimeout(() => {
        loadMoreGlobalNotifications();
        debounceRef.current = null;
      }, 500);
    } else {
      if (notificationLoading || !hasMore) return;
      debounceRef.current = setTimeout(() => {
        loadMore();
        debounceRef.current = null;
      }, 500);
    }
  };

  // render item: supports both shapes (item may be wrapped in { data: {...} })
  const renderItem = ({ item }: { item: any }) => {
    const payload = item?.data ?? item;
    return (
      <TouchableOpacity
        onPress={() => {
          if (payload.type === "order" && payload.order_id) {
            router.push(`/orderDetail?id=${payload.order_id}`);
          } else if (payload.type === "promotion" && payload.discountable_id) {
            router.push(
              `/productListByCampaign?id=${payload.discountable_id}&name=${payload.title}&image=${payload?.image}&expire=${payload?.end_date}`
            );
          } else {
            router.push("/");
          }
        }}
        style={styles.notificationCardWrapper}
      >
        <View style={styles.notificationCard}>
          <Text style={styles.notificationCardTitle}>{payload.title}</Text>
          <Text style={styles.notificationCardDescription}>
            {payload.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // choose the active data & flags
  const activeData =
    activeTab === "global" ? globalNotifications : notifications;
  const activeLoading =
    activeTab === "global" ? globalNotificationLoading : notificationLoading;
  const activeHasMore =
    activeTab === "global" ? hasMoreGlobalNotifications : hasMore;

  // Empty component per-tab
  const ListEmpty = () => {
    if (activeTab === "user" && !isAuthenticated) {
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

    if (activeLoading) {
      return (
        <View style={styles.bodyCentered}>
          <ActivityIndicator size="large" color="#2555E7" />
        </View>
      );
    }

    return (
      <View style={styles.bodyCentered}>
        <Text style={styles.messageText} allowFontScaling={false}>
          {activeTab === "global"
            ? "No global notifications."
            : "You have no notifications."}
        </Text>
      </View>
    );
  };

  // tab buttons UI
  const TabsHeader = () => (
    <View style={styles.tabsRow}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setActiveTab("global")}
        style={styles.tabWrapper}
      >
        {activeTab === "global" ? (
          <LinearGradient
            colors={["#53CAFE", "#2555E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.tabButton, styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, styles.tabTextActive]}>
              Global Notifications
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.tabButton]}>
            <Text style={styles.tabText}>Global Notifications</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (!isAuthenticated && !authLoading) {
            router.push("/login");
            return;
          }
          setActiveTab("user");
        }}
        style={styles.tabWrapper}
      >
        {activeTab === "user" ? (
          <LinearGradient
            colors={["#53CAFE", "#2555E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.tabButton, styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, styles.tabTextActive]}>
              Notifications
            </Text>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.tabButton,
              !isAuthenticated && !authLoading ? styles.tabButtonDisabled : {},
            ]}
          >
            <Text
              style={[
                styles.tabText,
                !isAuthenticated && !authLoading ? styles.tabTextDisabled : {},
              ]}
            >
              Notifications
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <HeadLine />
      <FlatList
        style={styles.flatList}
        data={activeData}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
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

            {/* Tabs (right below GoBack) */}
            <View style={{ paddingHorizontal: 15, paddingTop: 8 }}>
              <TabsHeader />
            </View>
          </>
        }
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={
          activeHasMore ? (
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
          (activeData?.length ?? 0) === 0 && styles.containerEmpty,
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
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
  // tabs
  tabsRow: {
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  tabWrapper: {
    flex: 1,
  },
  tabButton: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F4",
  },
  tabButtonActive: {
    // active gradient applied via LinearGradient wrapper
  },
  tabButtonDisabled: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Saira-Medium",
    color: "#333",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  tabTextDisabled: {
    color: "#999",
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
