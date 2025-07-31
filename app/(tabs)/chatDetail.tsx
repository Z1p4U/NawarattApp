import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  FlatListProps,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import useAuth from "@/redux/hooks/auth/useAuth";
import useMessage from "@/redux/hooks/messages/useMessage";
import useMessageAction from "@/redux/hooks/messages/useMessageAction";
import Svg, { Path } from "react-native-svg";
import useUser from "@/redux/hooks/user/useUser";
import { ChatMessage, ChatMessagePayload } from "@/constants/config";
import ChatInput from "@/components/Chat/ChatInput";

// helper to format a Date as dd/mm/yy
const formatDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear() % 100).padStart(2, "0");
  return `${d}/${m}/${y}`;
};

export default function ChatDetail() {
  const router = useRouter();
  const chatId = Number(useSearchParams().get("id")) || 0;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { profileDetail } = useUser();
  const {
    chatMessages,
    loading: messageLoading,
    reset,
    hasMore,
    loadMore,
  } = useMessage(chatId);
  const { sendChatMessage } = useMessageAction(chatId);

  const [refreshing, setRefreshing] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  // guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reset();
    setRefreshing(false);
  }, [reset]);

  // load older
  const onEndReached = useCallback(() => {
    if (hasMore && !messageLoading) loadMore();
  }, [hasMore, messageLoading, loadMore]);

  // send
  const handleSend = useCallback(
    (payload: ChatMessagePayload) => {
      sendChatMessage(payload);
      setReplyTo(null);
    },
    [sendChatMessage]
  );

  const listRef = useRef<FlatList<ChatMessage>>(null);
  useLayoutEffect(() => {
    if (chatMessages.length && listRef.current) {
      listRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  }, [chatMessages]);

  const renderItem: FlatListProps<ChatMessage>["renderItem"] = ({
    item,
    index,
  }) => {
    const thisDate = new Date(item.created_at);
    const thisDateStr = formatDate(thisDate);
    const next = chatMessages[index + 1];
    const showDateSeparator =
      !next || formatDate(new Date(next.created_at)) !== thisDateStr;

    const isAdminMessage = profileDetail?.data?.name !== item.sender?.name;
    const hasRepliedMessage = item?.reply_to != null;

    return (
      <>
        <View
          style={[
            styles.messageRow,
            isAdminMessage ? styles.adminRow : styles.userRow,
          ]}
        >
          <View
            style={[
              styles.chatCol,
              isAdminMessage ? styles.adminCol : styles.userCol,
            ]}
          >
            {hasRepliedMessage && (
              <Text
                style={[
                  styles.repliedMessage,
                  isAdminMessage
                    ? styles.adminRepliedMessage
                    : styles.ownRepliedMessage,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.reply_to?.message}
              </Text>
            )}

            <View style={[styles.chatRow]}>
              {!isAdminMessage && (
                <TouchableOpacity
                  onPress={() => setReplyTo(item)}
                  style={[
                    styles.replyIcon,
                    {
                      marginRight: 4,
                    },
                  ]}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M10 9V5l-7 7 7 7v-4.1c5.05 0 8.5 1.93 11 5.1-1-5-4-10-11-11z"
                      fill="#888"
                    />
                  </Svg>
                </TouchableOpacity>
              )}

              <View style={styles.bubble}>
                <Text
                  style={[
                    styles.chatText,
                    isAdminMessage ? styles.adminText : styles.userText,
                  ]}
                >
                  {item.message}
                </Text>
              </View>

              {isAdminMessage && (
                <TouchableOpacity
                  onPress={() => setReplyTo(item)}
                  style={[
                    styles.replyIcon,
                    {
                      marginLeft: 4,
                    },
                  ]}
                >
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M10 9V5l-7 7 7 7v-4.1c5.05 0 8.5 1.93 11 5.1-1-5-4-10-11-11z"
                      fill="#888"
                    />
                  </Svg>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={[
                styles.tsText,
                isAdminMessage
                  ? {
                      textAlign: "left",
                    }
                  : {},
              ]}
            >
              {new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        {showDateSeparator && (
          <View style={styles.dateSeparatorRow}>
            <Text style={styles.dateSeparatorText}>{thisDateStr}</Text>
          </View>
        )}
      </>
    );
  };

  // initial loader
  if (messageLoading && chatMessages.length === 0) {
    return (
      <>
        <HeadLine />
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={["#53CAFE", "#2555E7"]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 0,
            }}
            style={styles.banner}
          >
            <Text style={styles.headText}>Chat with Admin</Text>
          </LinearGradient>
          <GoBack to="/chatList" />
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2555E7" />
        </View>
        <ChatInput
          replyTo={replyTo}
          onSend={handleSend}
          clearReply={() => setReplyTo(null)}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <HeadLine />

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 0,
          }}
          style={styles.banner}
        >
          <Text style={styles.headText}>Chat with Admin</Text>
        </LinearGradient>
        <GoBack to="/chatList" />
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={chatMessages}
        inverted
        keyExtractor={(m) => String(m.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          messageLoading ? (
            <ActivityIndicator
              style={{
                margin: 12,
              }}
            />
          ) : null
        }
        ListEmptyComponent={
          !messageLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet.</Text>
            </View>
          ) : null
        }
      />

      {/* Input bar */}
      <ChatInput
        replyTo={replyTo}
        onSend={handleSend}
        clearReply={() => setReplyTo(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#fff",
  },
  flatList: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
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
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Saira-Medium",
  },
  messageRow: {
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  adminRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  chatCol: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  adminCol: {
    alignItems: "flex-start",
  },
  userCol: {
    alignItems: "flex-end",
  },
  replyIcon: {
    marginHorizontal: 4,
    padding: 8,
    backgroundColor: "#F1F1F1",
    borderRadius: 1000,
  },
  bubble: {
    maxWidth: "75%",
  },
  chatText: {
    fontSize: 14,
    padding: 10,
    borderRadius: 15,
    minWidth: 60,
    fontFamily: "Saira-Regular",
  },
  userText: {
    backgroundColor: "#F1F1F1",
    color: "#000",
    borderBottomRightRadius: 0,
    marginLeft: 10,
    textAlign: "justify",
  },
  adminText: {
    backgroundColor: "#53CAFE",
    color: "#fff",
    borderBottomLeftRadius: 0,
    marginRight: 10,
    textAlign: "justify",
  },
  tsText: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
    fontFamily: "Saira-Regular",
  },
  inputBar: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    fontSize: 14,
    fontFamily: "Saira-Regular",
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#53CAFE",
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "500",
  },
  repliedMessage: {
    color: "#000",
    backgroundColor: "#E7E7E7",
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: 70,
    height: 45,
    alignContent: "flex-end",
    marginBottom: -20,
    fontFamily: "Saira-Regular",
  },
  adminRepliedMessage: {
    textAlign: "left",
  },
  ownRepliedMessage: {
    textAlign: "right",
  },
  // NEW styles for date separator
  dateSeparatorRow: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: "#888",
    backgroundColor: "#EEE",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    fontFamily: "Saira-Medium",
  },
});
