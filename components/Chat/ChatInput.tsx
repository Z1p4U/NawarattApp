import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { ChatMessage, ChatMessagePayload } from "@/constants/config";

export interface ChatInputProps {
  replyTo: ChatMessage | null;
  onSend: (payload: ChatMessagePayload) => void;
  clearReply: () => void;
}

export default function ChatInput({
  replyTo,
  onSend,
  clearReply,
}: ChatInputProps) {
  const [text, setText] = useState("");

  // Whenever replyTo is cleared, also clear any draft
  useEffect(() => {
    if (replyTo === null) setText("");
  }, [replyTo]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend({
      reply_to: Number(replyTo?.id),
      message: text.trim(),
      attachments: [],
    });
    setText("");
    clearReply();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.wrapper}
    >
      {replyTo !== null && (
        <View style={styles.replyPreview}>
          <Text style={styles.replyText}>Replying to #{replyTo?.message}</Text>
          <TouchableOpacity onPress={clearReply}>
            <Text style={styles.cancelReply}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  replyPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    backgroundColor: "#f0f0f0",
  },
  replyText: { fontStyle: "italic", color: "#555" },
  cancelReply: { fontWeight: "bold", paddingHorizontal: 8 },

  inputBar: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    fontSize: 14,
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
});
