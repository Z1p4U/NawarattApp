import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAuth from "@/redux/hooks/auth/useAuth";
import GoBack from "@/components/ui/GoBack";
import { ScrollView } from "react-native-gesture-handler";
import AlertBox from "@/components/ui/AlertBox";

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams();
  const phone = params.phone as string;

  const { verifyOtp, resendOtp } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);

  const handleNext = async () => {
    if (otp.length < 4) {
      // Alert.alert("Error", "Please enter the 4-digit OTP.");
      setAlertMessage("Please enter the 4-digit OTP.");
      setResendModalVisible(true);
      return;
    }
    try {
      const res = await verifyOtp(phone, otp);
      // Alert.alert("OTP Verification", res?.message);

      setAlertMessage(res?.message);
      setAlertModalVisible(true);
    } catch (error: any) {
      // Alert.alert(
      //   "OTP Verification Failed",
      //   error?.message || "Something went wrong."
      // );
      setAlertMessage(error?.message || "OTP Verification Failed.");
      setResendModalVisible(true);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp(phone);
      // Alert.alert("OTP", res?.message);

      setAlertMessage(res?.message);
      setResendModalVisible(true);
    } catch (error: any) {
      // Alert.alert(
      //   "Resend OTP Failed",
      //   error?.message || "Something went wrong."
      // );
      setAlertMessage(error?.message || "OTP Verification Failed.");
      setResendModalVisible(true);
    }
  };

  const onClose = async () => {
    router.push("/login");
    setAlertModalVisible(false);
    setAlertMessage("");
  };

  const onResendClose = async () => {
    setResendModalVisible(false);
    setAlertMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#54CAFF", "#275AE8"]} style={styles.header}>
        <View style={styles.headerDiv}>
          <Text style={styles.headerTitle}>Welcome to</Text>
          <Text style={styles.headerBrand}>Nawarratt</Text>
          <Text style={styles.headerSubtitle}>Medical Distribution</Text>
        </View>
      </LinearGradient>

      <GoBack />

      {/* Verify OTP Section */}
      <ScrollView style={styles.formContainer}>
        <Text style={styles.verifyTitle}>Enter OTP</Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <TextInput
            style={styles.otpInput}
            placeholder="----"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
            textAlign="center"
          />
        </View>

        {/* NEXT Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>NEXT</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>If you didn’t receive an OTP,</Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>REQUEST AGAIN</Text>
          </TouchableOpacity>
          <Text style={styles.resendText}>in 60s</Text>
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    height: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "185%",
    marginTop: "-120%",
    borderRadius: 10000,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  backText: {
    color: "#fff",
    marginLeft: 5,
    fontFamily: "Saira-Medium",
  },
  headerDiv: {
    transform: [{ translateY: -40 }],
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  headerBrand: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  verifyTitle: {
    fontSize: 22,
    fontFamily: "Saira-Medium",
    textAlign: "center",
    marginBottom: 40,
  },
  otpContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  otpInput: {
    fontSize: 24,
    width: "60%",
    height: 50,
    borderBottomWidth: 2,
    borderColor: "#E0E0E0",
    fontFamily: "Saira-Regular",
  },
  nextButton: {
    marginBottom: 20,
  },
  gradientButton: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Saira-Medium",
  },
  resendContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  resendText: {
    color: "#666",
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  resendLink: {
    color: "#275AE8",
    fontFamily: "Saira-Medium",
  },
});
