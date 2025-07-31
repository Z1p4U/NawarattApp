// components/ui/AlertBox.tsx

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  SafeAreaView,
} from "react-native";

type AlertBoxProps = {
  visible: boolean;
  message: string;
  buttonText?: string;
  onClose: (event: GestureResponderEvent) => void;
};

export default function AlertBox({
  visible,
  message,
  buttonText = "OK",
  onClose,
}: AlertBoxProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText} allowFontScaling={false}>
              {message}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle} allowFontScaling={false}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099", // semi‑transparent black
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
