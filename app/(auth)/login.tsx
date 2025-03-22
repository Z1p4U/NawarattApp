import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "@/redux/hooks/auth/useAuth"; // Import useAuth
import Svg, { Path } from "react-native-svg";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!credential || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(credential, password);
      Alert.alert("Success", res?.message);
      router.push("/");
    } catch (error: any) {
      const errorMessage = error?.message || "Something went wrong.";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
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

      {/* Login Section */}
      <ScrollView style={styles.formContainer}>
        <Text style={styles.loginText}>Login to your Account</Text>

        {/* Email / Phone Input */}
        <View style={styles.emailContainer}>
          <TextInput
            style={styles.input}
            placeholder="EMAIL / PHONE NO"
            placeholderTextColor="#888"
            value={credential}
            onChangeText={setCredential}
            autoCapitalize="none"
          />
        </View>

        {/* PIN Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="PIN"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity style={styles.forgotPin}>
          <Text style={styles.forgotPinText}>Forgot Pin?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <Text style={styles.registerText}>
          If you don’t have an Account yet,{" "}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("/register")}
          >
            Register Now!
          </Text>
        </Text>

        {/* Social Login */}
        <View style={styles.row}>
          <Svg width={102} height={1} viewBox="0 0 102 1" fill="none">
            <Path stroke="#000" strokeOpacity={0.1} d="M0 0.5L102 0.5" />
          </Svg>
          <View>
            <Text style={styles.orText}>or</Text>
            <Text style={styles.loginWithText}>Login With</Text>
          </View>
          <Svg width={102} height={1} viewBox="0 0 102 1" fill="none">
            <Path stroke="#000" strokeOpacity={0.1} d="M0 0.5L102 0.5" />
          </Svg>
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("@/assets/images/google.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("@/assets/images/facebook.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
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
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  header: {
    height: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "185%",
    marginTop: "-115%",
    borderRadius: 10000,
  },
  headerDiv: {
    transform: "translateY(-50%)",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Saira-Regular",
  },
  headerBrand: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Saira-Medium",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Saira-Regular",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 25,
  },
  loginText: {
    fontSize: 22,
    marginBottom: 35,
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F2F2F2",
    height: 50,
    borderRadius: 1000,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: "Saira-Regular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 1000,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontFamily: "Saira-Regular",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPin: {
    alignSelf: "flex-end",
    marginBottom: 15,
    marginRight: 25,
  },
  forgotPinText: {
    color: "#666",
    fontFamily: "Saira-Medium",
  },
  loginButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#275AE8",
    width: "100%",
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Saira-Medium",
  },
  registerText: {
    marginTop: 15,
    color: "#666",
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  registerLink: {
    color: "#275AE8",
    fontFamily: "Saira-Medium",
  },
  orText: {
    color: "#666",
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  loginWithText: {
    color: "#666",
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  socialButton: {
    backgroundColor: "#F2F2F2",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});
