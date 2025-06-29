import { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import useOrderAction from "@/redux/hooks/order/useOrderAction";
import useOrderDetail from "@/redux/hooks/order/useOrderDetail";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";

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

  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera roll permissions to select a slip image."
        );
      }
    })();
  }, []);

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
        Alert.alert(
          "Error",
          "Couldn't read image data. Please try a different image."
        );
      }
    }
    setImageLoading(false);
  };

  const handleSubmit = useCallback(async () => {
    if (!orderDetail) return;
    if (!imageBase64) {
      Alert.alert("Validation", "Please select a slip image.");
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
      Alert.alert("Success", "Order payment processed successfully!");
      router.push("/orderHistory");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to process payment. Please try again.");
    }
  }, [payOrder, orderDetail, orderId, imageBase64, caption, router]);

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
            <ActivityIndicator size="large" color="#0000ff" />
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
                <ActivityIndicator size="large" color="#0000ff" />
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
      </ScrollView>
    </>
  );
}

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
    fontSize: 14,
    color: "#000",
    fontFamily: "Saira-Medium",
    fontWeight: 500,
  },
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
});
