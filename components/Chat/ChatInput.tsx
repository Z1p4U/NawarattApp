import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ChatMessage, ChatMessagePayload } from "@/constants/config";
import Svg, { Path } from "react-native-svg";

export interface ChatInputProps {
  replyTo: ChatMessage | null;
  onSend: (payload: ChatMessagePayload) => void;
  clearReply: () => void;
}

type Attachment = {
  type: "image";
  uri?: string;
  name?: string;
  dataUri: string; // data:<mime>;base64,xxxx
};

export default function ChatInput({
  replyTo,
  onSend,
  clearReply,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          console.warn("Image library permission not granted");
        }
      } catch (err) {
        console.warn("Failed to request image permission", err);
      }
    })();
  }, []);

  // clear draft when reply cleared
  useEffect(() => {
    if (replyTo === null) setText("");
  }, [replyTo]);

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        base64: true,
      });

      // res: { canceled, assets }
      if (!res.canceled && res.assets?.length) {
        const asset = res.assets[0];
        if (!asset.base64) {
          Alert.alert(
            "Error",
            "Couldn't read image data as base64. Please try a different image."
          );
          return;
        }

        // guess mime from extension in uri, fallback to jpeg
        const ext = asset.uri?.split(".").pop()?.toLowerCase() ?? "";
        const mime = ext === "png" ? "image/png" : "image/jpeg";
        const dataUri = `data:${mime};base64,${asset.base64}`;

        setAttachments((prev) => [
          ...prev,
          {
            type: "image",
            uri: asset.uri,
            name: asset.fileName ?? undefined,
            dataUri,
          },
        ]);
      }
    } catch (err) {
      console.error("Image pick error", err);
    }
  };

  const handleRemoveAttachment = (index: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;

    const attachmentsAsStrings = attachments
      .map((a) => a.dataUri ?? a.uri ?? "")
      .filter(Boolean);

    const payload: ChatMessagePayload = {
      reply_to: replyTo ? Number(replyTo.id) : null,
      message: text.trim(),
      attachments: attachmentsAsStrings,
    };

    onSend(payload);
    setText("");
    setAttachments([]);
    clearReply();
  };

  const renderAttachmentPreview = () => {
    if (attachments.length === 0) return null;
    return (
      <View style={styles.attachmentsRow}>
        {attachments.map((att, idx) => (
          <View key={idx} style={styles.attachmentPreview}>
            <Image
              source={{ uri: att.dataUri }}
              style={styles.attachmentImage}
            />
            <TouchableOpacity
              onPress={() => handleRemoveAttachment(idx)}
              style={styles.removeAttachmentBtn}
              accessibilityLabel="Remove image"
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.wrapper}
    >
      {replyTo !== null && (
        <View style={styles.replyPreview}>
          <Text style={styles.replyText}>
            Replying to:
            {replyTo?.message ? replyTo?.message : " @Attachment"}
          </Text>
          <TouchableOpacity onPress={clearReply}>
            <Text style={styles.cancelReply}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderAttachmentPreview()}

      <View style={styles.inputBar}>
        {/* Left button: image only */}
        <View style={styles.leftButtons}>
          <TouchableOpacity
            onPress={handlePickImage}
            style={styles.iconButton}
            accessibilityLabel="Pick image"
          >
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Path
                d="M2 18c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 010 16V2C0 1.45.196.98.588.588A1.93 1.93 0 012 0h14c.55 0 1.021.196 1.413.588.392.392.588.863.587 1.412v14c0 .55-.196 1.021-.587 1.413A1.92 1.92 0 0116 18H2zm1-4h12l-3.75-5-3 4L6 10l-3 4z"
                fill="#000"
                fillOpacity={0.4}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          returnKeyType="send"
          onSubmitEditing={handleSend}
          multiline={false}
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

  attachmentsRow: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
    alignItems: "center",
  },
  attachmentPreview: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  attachmentImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeAttachmentBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00000088",
    alignItems: "center",
    justifyContent: "center",
  },

  inputBar: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  leftButtons: {
    flexDirection: "row",
    marginRight: 0,
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F3F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
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
