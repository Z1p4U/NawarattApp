import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";

interface QuantityConfirmModalProps {
  modalVisible: boolean;
  selectedOption: string;
  onSelect: (option: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const QuantityConfirmModal: React.FC<QuantityConfirmModalProps> = ({
  modalVisible,
  selectedOption,
  onSelect,
  onConfirm,
  onClose,
}) => {
  const options = [
    "Order မှဖယ်ရှားပေးပါ",
    "Phone ဆက်အကြောင်းကြားပေးပါ",
    "ရနိုင်သလောက်သာထည့်ပေးပါ",
  ];

  return (
    <Modal transparent visible={modalVisible} animationType="fade">
      {/* Close modal when clicking outside */}
      <SafeAreaView style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title} allowFontScaling={false}>
            ယခုမှာယူသောပစ္စည်းအား မရနိုင်ပါက (သို့မဟုတ်) အရေအတွက်
            အတိအကျမရနိုင်ပါက မည်သို့ ပြုလုပ်ပေးရမည်နည်း??
          </Text>

          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioRow}
              onPress={() => onSelect(option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === option && styles.selected,
                ]}
              />
              <Text style={styles.radioText} allowFontScaling={false}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Confirm Button */}
          <TouchableOpacity style={{ marginTop: 20 }} onPress={onConfirm}>
            <LinearGradient
              colors={["#54CAFF", "#275AE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButton}
            >
              <Text style={styles.buttonText} allowFontScaling={false}>
                Confirm
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default QuantityConfirmModal;

const styles = StyleSheet.create({
  modalBackground: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    inset: 1,
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "white",
    paddingVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    lineHeight: 34,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "95%",
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 1000,
    borderWidth: 4,
    borderColor: "#D9D9D9",
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },
  selected: {
    backgroundColor: "#275AE8",
  },
  radioText: {
    fontSize: 16,
  },
  confirmButton: {
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    width: "100%",
    height: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
