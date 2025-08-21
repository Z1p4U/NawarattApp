import { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import useOrderAction from "@/redux/hooks/order/useOrderAction";
import useOrderDetail from "@/redux/hooks/order/useOrderDetail";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";
import AlertBox from "@/components/ui/AlertBox";
import usePayment from "@/redux/hooks/payment/usePayment";
import Clipboard from "@react-native-clipboard/clipboard";

interface SlipImage {
  image: string;
  caption: string;
}
interface OrderPayPayload {
  amount: number;
  slip_images: SlipImage[];
}

export default function orderPay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("id")) || 0;
  const { payOrder } = useOrderAction();
  const { orderDetail, loading: detailLoading } = useOrderDetail(orderId);
  const { payments, loading: paymentMethodLoading } = usePayment();

  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);

  // modal & payment selection states
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        // Alert.alert(
        //   "Permission required",
        //   "We need camera roll permissions to select a slip image."
        // );
        setAlertMessage("We need permissions to select a slip image.");
        setResendModalVisible(true);
      }
    })();
  }, []);

  // When modal opens, default to first payment if available
  useEffect(() => {
    if (paymentModalVisible && payments && payments.length > 0) {
      setSelectedPaymentIndex(0);
    }
  }, [paymentModalVisible, payments]);

  // launch picker
  const pickImage = async () => {
    setImageLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImageBase64(asset.base64);
      } else {
        // Alert.alert(
        //   "Error",
        //   "Couldn't read image data. Please try a different image."
        // );
        setAlertMessage(
          "Couldn't read image data. Please try a different image."
        );
        setResendModalVisible(true);
      }
    }
    setImageLoading(false);
  };

  const handleSubmit = useCallback(async () => {
    if (!orderDetail) return;
    if (!imageBase64) {
      // Alert.alert("Validation", "Please select a slip image.");
      setAlertMessage("Please select a slip image.");
      setResendModalVisible(true);
      return;
    }

    const payload: OrderPayPayload = {
      amount: orderDetail?.total_amount,
      slip_images: [
        { image: `data:image/jpeg;base64,${imageBase64}`, caption },
      ],
    };

    try {
      const res = await payOrder(orderId, payload);
      // console.log(res);
      // Alert.alert("Success", "Order payment processed successfully!");
      setAlertMessage(res?.message || "Order payment proceed successfully!");
      setAlertModalVisible(true);
    } catch (err) {
      console.error(err);
      // Alert.alert("Error", "Failed to process payment. Please try again.");
      setAlertMessage("Failed to process payment. Please try again.");
      setResendModalVisible(true);
    } finally {
      setImageBase64("");
      setCaption("");
    }
  }, [payOrder, orderDetail, orderId, imageBase64, caption, router]);

  const onClose = async () => {
    router.push("/orderHistory");
    setAlertModalVisible(false);
    setAlertMessage("");
  };

  const onResendClose = async () => {
    setResendModalVisible(false);
    setAlertMessage("");
  };

  // helper: get the currently selected payment object
  const selectedPayment =
    selectedPaymentIndex !== null &&
    payments &&
    payments.length > selectedPaymentIndex
      ? payments[selectedPaymentIndex]
      : null;

  return (
    <>
      <HeadLine />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Text style={styles.headText} allowFontScaling={false}>
            Pay For Order
          </Text>
        </LinearGradient>

        <GoBack to={"/orderHistory"} />

        {detailLoading || !orderDetail ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2555E7" />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label} allowFontScaling={false}>
              Total Amount
            </Text>
            <Text style={styles.value} allowFontScaling={false}>
              Ks {orderDetail.total_amount.toLocaleString()}
            </Text>

            <Text style={styles.label} allowFontScaling={false}>
              Slip Image
            </Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImage}
              disabled={imageLoading}
            >
              {imageLoading ? (
                <ActivityIndicator size="large" color="#2555E7" />
              ) : imageBase64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                  style={styles.preview}
                />
              ) : (
                <Text style={styles.pickText} allowFontScaling={false}>
                  Tap to choose image
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.label} allowFontScaling={false}>
              Caption
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kpay 3 သိန်း"
              value={caption}
              onChangeText={setCaption}
            />

            {/* NEW: Button to open payment selector modal */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setPaymentModalVisible(true)}
            >
              <Text style={styles.secondaryButtonText}>
                View Payment Methods
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <LinearGradient
                colors={["#54CAFF", "#275AE8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText} allowFontScaling={false}>
                  Submit Payment
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment selection modal */}
        <Modal
          visible={paymentModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setPaymentModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Payment Methods</Text>

              {paymentMethodLoading ? (
                <ActivityIndicator size="large" color="#2555E7" />
              ) : !payments || payments.length === 0 ? (
                <Text style={{ marginTop: 20 }}>
                  No payment methods available.
                </Text>
              ) : (
                <>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.iconsRow}
                  >
                    {payments.map((p: any, idx: number) => {
                      const uri = p.icon || p.image || null;
                      const isActive = selectedPaymentIndex === idx;
                      return (
                        <TouchableOpacity
                          key={p.id ?? idx}
                          style={[
                            styles.paymentIconWrapper,
                            isActive && styles.paymentIconActive,
                          ]}
                          onPress={() => setSelectedPaymentIndex(idx)}
                        >
                          {uri ? (
                            <Image
                              source={{ uri }}
                              style={styles.paymentIcon}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.paymentIconPlaceholder}>
                              <Text style={styles.paymentIconPlaceholderText}>
                                {p.name?.charAt(0) ?? "P"}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* show details of active payment */}
                  <View style={styles.paymentDetails}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <Text style={styles.detailValue}>
                      {selectedPayment ? selectedPayment.name : ""}
                    </Text>

                    <Text style={styles.detailLabel}>Account</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedPayment?.account) {
                          Clipboard.setString(selectedPayment.account);
                        }
                      }}
                    >
                      <Text style={styles.detailValue}>
                        {selectedPayment ? selectedPayment.account : ""}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.copyContainer}>
                      <Text style={styles.detailValue}>
                        {selectedPayment ? selectedPayment.account : ""}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (selectedPayment?.account) {
                            Clipboard.setString(selectedPayment.account);
                          }
                        }}
                        style={styles.copyBtn}
                      >
                        <Text style={styles.copyText}>Copy</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.detailLabel}>QR</Text>
                    <View style={styles.qrBox}>
                      {selectedPayment && selectedPayment.qr ? (
                        <Image
                          source={{
                            uri: selectedPayment.qr,
                          }}
                          style={styles.qrImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={{ color: "#666" }}>No QR available</Text>
                      )}
                    </View>
                  </View>
                </>
              )}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setPaymentModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <AlertBox
          visible={alertModalVisible}
          message={alertMessage}
          onClose={onClose}
        />

        <AlertBox
          visible={resendModalVisible}
          message={alertMessage}
          onClose={onResendClose}
        />
      </ScrollView>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
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
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  form: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Saira-Medium",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#F2F3F4",
    width: "100%",
    padding: 10,
    fontFamily: "Saira-Medium",
    borderRadius: 8,
  },
  imagePicker: {
    backgroundColor: "#F2F3F4",
    borderRadius: 8,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  pickText: {
    color: "#666",
  },
  input: {
    backgroundColor: "#F2F3F4",
    borderRadius: 8,
    padding: 10,
    color: "#000",
    fontSize: 13,
    fontFamily: "Saira-Medium",
    fontWeight: "500" as any,
  },
  // main submit button
  button: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  // new secondary button to open modal
  secondaryButton: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#E8F5FF",
    borderWidth: 1,
    borderColor: "#CDEEFF",
  },
  secondaryButtonText: {
    color: "#2555E7",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  iconsRow: {
    paddingHorizontal: 8,
    paddingBottom: 12,
    alignItems: "center",
  },
  paymentIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  paymentIconActive: {
    borderColor: "#2555E7",
  },
  paymentIcon: {
    width: "100%",
    height: "100%",
  },
  paymentIconPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
  },
  paymentIconPlaceholderText: {
    color: "#555",
    fontWeight: "600",
    fontFamily: "Saira-Medium",
  },
  paymentDetails: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  detailLabel: {
    fontSize: 14,
    color: "#1E3A8A",
    marginTop: 8,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  detailValue: {
    fontSize: 15,
    color: "#222",
    marginTop: 4,
    fontFamily: "Saira-Medium",
  },
  copyContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  copyBtn: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: "1/1",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#222",
    borderStyle: "solid",
  },
  copyText: {
    fontSize: 10,
    color: "#222",
    fontFamily: "Saira-Medium",
  },
  qrBox: {
    width: "100%",
    marginTop: 8,
    maxHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    padding: 8,
    borderRadius: 8,
  },
  qrImage: {
    width: "100%",
    height: 200,
    objectFit: "contain",
  },
  modalButtonsRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  modalCloseText: {
    color: "#2555E7",
    fontWeight: "600",
    fontFamily: "Saira-Medium",
  },
});
