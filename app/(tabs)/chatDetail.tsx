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
  Image,
  Modal,
  Pressable,
  Dimensions,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// helper to format a Date as dd/mm/yy
const formatDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear() % 100).padStart(2, "0");
  return `${d}/${m}/${y}`;
};

function getAttachmentUri(att: any): string | null {
  if (!att) return null;

  // plain string case
  if (typeof att === "string") {
    const s = att.trim();
    if (s.startsWith("data:")) return s;
    // assume raw base64, prefix with jpeg mime (server should ideally include mime)
    return `data:image/jpeg;base64,${s}`;
  }

  // object case
  if (typeof att === "object") {
    if (att.data && typeof att.data === "string") {
      const s = att.data.trim();
      if (s.startsWith("data:")) return s;
      return `data:image/jpeg;base64,${s}`;
    }
    // common server key for remote image
    if (att.url && typeof att.url === "string") return att.url;
    if (att.path && typeof att.path === "string") return att.path;
    // sometimes backend returns { type, uri } or { type, url }
    if (att.uri && typeof att.uri === "string") return att.uri;
  }

  return null;
}

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

  // full screen image modal
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageModalUri, setImageModalUri] = useState<string | null>(null);

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

  const renderAttachments = (item: ChatMessage) => {
    const atts = item.attachments ?? null;
    if (!Array.isArray(atts) || atts.length === 0) return null;

    const uris: string[] = [];
    for (const a of atts) {
      const uri = getAttachmentUri(a);
      if (uri) uris.push(uri);
    }
    if (uris.length === 0) return null;

    return (
      <View style={styles.attachmentsContainer}>
        {uris.map((uri, i) => (
          <TouchableOpacity
            key={`att-${item.id}-${i}`}
            activeOpacity={0.85}
            onPress={() => {
              setImageModalUri(uri);
              setImageModalVisible(true);
            }}
            style={styles.attachmentTouchable}
          >
            <Image
              source={{ uri }}
              style={styles.attachmentImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
      <View key={`msg-${item.id}`}>
        {showDateSeparator && (
          <View key={`sep-${item.id}`} style={styles.dateSeparatorRow}>
            <Text style={styles.dateSeparatorText}>{thisDateStr}</Text>
          </View>
        )}

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
                {item?.reply_to?.message
                  ? item?.reply_to?.message
                  : " @Attachment"}
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
                {/* attachments (images) */}
                {renderAttachments(item)}

                {/* text */}
                {item.message ? (
                  <Text
                    style={[
                      styles.chatText,
                      isAdminMessage ? styles.adminText : styles.userText,
                    ]}
                    selectable
                  >
                    {item.message}
                  </Text>
                ) : null}
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
              {item.created_at
                ? new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </View>
        </View>
      </View>
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

      {/* Image modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <Pressable
            style={modalStyles.backdrop}
            onPress={() => setImageModalVisible(false)}
          />
          <View style={modalStyles.content}>
            {imageModalUri ? (
              <Image
                source={{ uri: imageModalUri }}
                style={modalStyles.fullImage}
                resizeMode="contain"
              />
            ) : null}
            <TouchableOpacity
              onPress={() => setImageModalVisible(false)}
              style={modalStyles.closeBtn}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    width: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  fullImage: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.8,
  },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

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
  },
  adminText: {
    backgroundColor: "#53CAFE",
    color: "#fff",
    borderBottomLeftRadius: 0,
    marginRight: 10,
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

  /* Attachment styles */
  attachmentsContainer: {
    marginBottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  attachmentTouchable: {
    marginBottom: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  attachmentImage: {
    width: 160,
    height: 100,
    borderRadius: 8,
  },
});
