import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  Image,
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
import useChat from "@/redux/hooks/chat/useChat";
import useAuth from "@/redux/hooks/auth/useAuth";
import AddressLoader from "@/components/ui/AddressLoader";
import Svg, { Path } from "react-native-svg";

export default function ChatBook() {
  const router = useRouter();
  const { chats, loading, reset } = useChat();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Pull‑to‑refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await reset();
    } catch {}
    setRefreshing(false);
  }, [reset]);

  // Render each chat
  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push(`/chatDetail?id=${item?.id}`);
        }}
        key={item?.id}
        style={styles.notificationCardWrapper}
      >
        <View style={styles.notificationCard}>
          <LinearGradient
            colors={["#53CAFE", "#2555E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.avatar}
          >
            <Svg width={30} height={30} viewBox="0 0 18 18" fill="none">
              <Path
                d="M14.04 11.07c.263-.638.405-1.32.405-2.07 0-.54-.082-1.057-.225-1.537a6.784 6.784 0 01-1.53.172 6.803 6.803 0 01-5.565-2.88 6.9 6.9 0 01-3.547 3.66c-.03.188-.03.39-.03.585A5.452 5.452 0 009 14.453c.787 0 1.545-.173 2.227-.48.428.817.623 1.222.608 1.222-1.23.412-2.183.615-2.835.615a6.785 6.785 0 01-4.822-1.995 6.75 6.75 0 01-1.68-2.768H1.5V7.635h.817a6.818 6.818 0 0111.498-3.45 6.75 6.75 0 011.853 3.45h.832v3.412h-.045l-2.67 2.453-3.975-.45v-1.253h3.622l.608-.727zM6.953 8.828c.224 0 .442.09.6.255a.852.852 0 010 1.2.852.852 0 01-.6.247.848.848 0 01-.856-.847c0-.473.383-.855.855-.855zm4.087 0c.473 0 .848.382.848.855a.842.842 0 01-.848.847.848.848 0 01-.605-1.452c.16-.16.378-.25.605-.25z"
                fill="#fff"
              />
            </Svg>
          </LinearGradient>
          <View>
            <Text style={styles.notificationCardTitle}>Chat {item?.id}</Text>
            <Text style={styles.notificationCardDescription}>
              {item?.last_message
                ? item?.last_message?.sender?.name
                : "Last Message"}{" "}
              : {item?.last_message ? item?.last_message?.message : "..."}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeadLine />

      <FlatList
        style={styles.flatList}
        data={chats}
        keyExtractor={(a) => a.id.toString()}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text style={styles.headText} allowFontScaling={false}>
                Chat List
              </Text>
            </LinearGradient>
            <GoBack to="/account" />
            <TouchableOpacity
              style={styles.addButtonWrapper}
              onPress={() => alert("This function will coming soon !")}
            >
              <LinearGradient
                colors={["#54CAFF", "#275AE8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.newChat}
              >
                <Text style={styles.chatText} allowFontScaling={false}>
                  Create New Chat
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        }
        renderItem={renderItem}
        contentContainerStyle={[
          styles.contentContainer,
          chats.length === 0 && !loading && styles.containerEmpty,
        ]}
        ListEmptyComponent={
          loading ? (
            <AddressLoader count={6} />
          ) : (
            <View style={styles.bodyCentered}>
              <Text style={styles.messageText}>No chats found.</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 120,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  containerEmpty: {
    justifyContent: "center",
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

  addButtonWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  newChat: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCardWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  notificationCard: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 10,
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

  bodyCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },
});
