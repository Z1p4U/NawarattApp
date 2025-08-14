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
import useNotificationAction from "@/redux/hooks/notification/useNotificationAction";
import Svg, { Path } from "react-native-svg";
import useLocalGlobalReads from "@/hooks/useLocalGlobalReads";

type TabKey = "global" | "user";

export default function Notifications() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const {
    notifications,
    loading: notificationLoading,
    loadMore,
    hasMore,
    reset,
  } = useNotification();
  const {
    globalNotifications,
    loading: globalNotificationLoading,
    loadMore: loadMoreGlobalNotifications,
    hasMore: hasMoreGlobalNotifications,
    reset: resetGlobalNotifications,
  } = useGlobalNotification();
  const { readAllNotifications, readNotification } = useNotificationAction();
  const { markRead, markAllRead, isRead } = useLocalGlobalReads(); //local-storage

  useEffect(() => {
    reset();
    resetGlobalNotifications();
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<TabKey>("global");
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

  // Helpers to format date/time
  const formatDate = (iso: string | undefined | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };
  const formatTime = (iso: string | undefined | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")} : ${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Pull-to-refresh: call the active tab's reset
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (activeTab === "global") {
      resetGlobalNotifications();
    } else {
      reset();
    }
    setTimeout(() => setRefreshing(false), 800);
  }, [activeTab, reset, resetGlobalNotifications]);

  // infinite scroll handler delegates to active list
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

  // get stable string id (works with both shapes)
  const getItemId = (item: any): string | null => {
    if (!item) return null;
    const cand = item?.id ?? item?.data?.id ?? item?.data?.notification_id;
    if (cand == null) return null;
    return String(cand);
  };

  // Render item supports both shapes (top-level item or wrapper with data)
  const renderItem = ({ item }: { item: any }) => {
    const payload = item?.data ?? item;
    const id = getItemId(item);
    // unread: server-driven for user tab (read_at), local-driven for global
    const unread =
      activeTab === "user"
        ? !item?.read_at // server field
        : !(id && isRead(id));

    return (
      <TouchableOpacity
        onPress={() => {
          if (payload?.type === "order" && payload?.order_id) {
            if (activeTab === "user") {
              readNotification(item?.id);
            } else if (id) {
              markRead(id);
            }
            router.push(`/orderDetail?id=${payload.order_id}`);
            return;
          }

          if (payload?.type === "promotion" && payload?.discountable_id) {
            if (activeTab === "user") {
              readNotification(item?.id);
            } else if (id) {
              markRead(id);
            }
            router.push(
              `/productListByCampaign?id=${payload.discountable_id}&name=${payload.title}&image=${payload?.image}&expire=${payload?.end_date}`
            );
            return;
          }

          // fallback: mark read and go home
          if (activeTab === "user") {
            readNotification(item?.id);
          } else if (id) {
            markRead(id);
          }
          router.push("/");
        }}
        style={styles.notificationCardWrapper}
      >
        <View
          style={[
            styles.notificationCard,
            unread
              ? { backgroundColor: "#e7f3ff" }
              : { backgroundColor: "#F8F8F8" },
          ]}
        >
          <Text
            style={[
              styles.notificationCardTitle,
              unread
                ? { fontWeight: "600", fontFamily: "Saira-Bold" }
                : { fontWeight: "500", fontFamily: "Saira-Medium" },
            ]}
          >
            {payload?.title}
          </Text>
          <Text style={styles.notificationCardDescription}>
            {payload?.description}
          </Text>

          <View style={styles.notificationCardDateContainerDiv}>
            <View style={styles.notificationCardDateContainer}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M8.5 14a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm0 3.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm4.75-4.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM12 17.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm4.75-4.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
                  fill="#0000004D"
                />
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 3.25a.75.75 0 01.75.75v.75h6.5V4a.75.75 0 111.5 0v.758a7.8 7.8 0 01.425.022c.38.03.736.098 1.073.27a2.75 2.75 0 011.202 1.202c.172.337.24.693.27 1.073.03.365.03.81.03 1.345v7.66c0 .535 0 .98-.03 1.345-.03.38-.098.736-.27 1.073a2.75 2.75 0 01-1.201 1.202c-.338.172-.694.24-1.074.27-.365.03-.81.03-1.344.03H8.17c-.535 0-.98 0-1.345-.03-.38-.03-.736-.098-1.073-.27a2.75 2.75 0 01-1.202-1.2c-.172-.338-.24-.694-.27-1.074-.03-.365-.03-.81-.03-1.344V8.67c0-.535 0-.98.03-1.345.03-.38.098-.736.27-1.073A2.75 2.75 0 015.752 5.05c.337-.172.693-.24 1.073-.27.131-.01.273-.018.425-.022V4A.75.75 0 018 3.25zM7.25 6.5v-.242a5.999 5.999 0 00-.303.017c-.287.023-.424.065-.514.111a1.25 1.25 0 00-.547.547c-.046.09-.088.227-.111.514-.024.296-.025.68-.025 1.253v.55h12.5V8.7c0-.572 0-.957-.025-1.253-.023-.287-.065-.424-.111-.514a1.25 1.25 0 00-.547-.547c-.09-.046-.227-.088-.515-.111a6.006 6.006 0 00-.302-.017V6.5a.75.75 0 11-1.5 0v-.25h-6.5v.25a.75.75 0 01-1.5 0zm11 3.75H5.75v6.05c0 .572 0 .957.025 1.252.023.288.065.425.111.515.12.236.311.427.547.547.09.046.227.088.514.111.296.024.68.025 1.253.025h7.6c.572 0 .957 0 1.252-.025.288-.023.425-.065.515-.111a1.25 1.25 0 00.547-.547c.046-.09.088-.227.111-.515.024-.295.025-.68.025-1.252v-6.05z"
                  fill="#0000004D"
                />
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.75 7.75A.75.75 0 0110.5 7h3a.75.75 0 110 1.5h-3a.75.75 0 01-.75-.75z"
                  fill="#0000004D"
                />
              </Svg>
              <Text style={styles.notificationCardDate}>
                {formatDate(item?.created_at ?? item?.data?.created_at)}
              </Text>
            </View>

            <View style={styles.notificationCardDateContainer}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                  stroke="#0000004D"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                <Path
                  d="M12.004 6v6.005l4.24 4.24"
                  stroke="#0000004D"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.notificationCardDate}>
                {formatTime(item?.created_at ?? item?.data?.created_at)}
              </Text>
            </View>
          </View>
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
            to view your order information.
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
            ? "No notifications."
            : "You have no order information."}
        </Text>
      </View>
    );
  };

  // tab buttons UI
  const TabsHeader = () => (
    <View style={styles.tabsRow}>
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
              Order Information
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
              Order Information
            </Text>
          </View>
        )}
      </TouchableOpacity>

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
              Notifications
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.tabButton]}>
            <Text style={styles.tabText}> Notifications</Text>
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

            {/* Mark all as read: server for user, local for global */}
            <View style={styles.clearContainer}>
              {activeTab === "user" ? (
                <TouchableOpacity onPress={readAllNotifications}>
                  <Text style={styles.clearText} allowFontScaling={false}>
                    Mark All As Read
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    const ids = (globalNotifications ?? [])
                      .map((g: any) => getItemId(g))
                      .filter(Boolean) as string[];
                    if (ids.length === 0) return;
                    markAllRead(ids);
                  }}
                >
                  <Text style={styles.clearText} allowFontScaling={false}>
                    Mark All As Read
                  </Text>
                </TouchableOpacity>
              )}
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
  tabButtonActive: {},
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

  clearContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  clearText: {
    fontSize: 14,
    color: "#ff0000",
    fontFamily: "Saira-Bold",
    letterSpacing: 1,
  },

  notificationCardWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  notificationCard: {
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  notificationCardTitle: {
    fontSize: 16,
    color: "#000",
  },
  notificationCardDescription: {
    fontSize: 14,
    color: "#0000004D",
    fontFamily: "Saira-Medium",
  },
  notificationCardDateContainerDiv: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  notificationCardDateContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  notificationCardDate: {
    fontSize: 12,
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
