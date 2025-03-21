import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#54CAFF", "#275AE8"]} style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to</Text>
        <Text style={styles.headerBrand}>Nawarratt</Text>
        <Text style={styles.headerSubtitle}>Medical Distribution</Text>
      </LinearGradient>

      {/* Login Section */}
      <View style={styles.formContainer}>
        <Text style={styles.loginText}>Login to your Account</Text>

        {/* Email / Phone Input */}
        <TextInput
          style={styles.input}
          placeholder="EMAIL / PHONE NO"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

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
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

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
        <Text style={styles.orText}>or</Text>
        <Text style={styles.loginWithText}>Login With</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              // source={require("@/assets/google.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              // source={require("@/assets/facebook.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
  },
  headerBrand: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPin: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPinText: {
    color: "#666",
  },
  loginButton: {
    backgroundColor: "#275AE8",
    width: "100%",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 15,
    color: "#666",
  },
  registerLink: {
    color: "#275AE8",
    fontWeight: "bold",
  },
  orText: {
    marginTop: 15,
    color: "#666",
  },
  loginWithText: {
    color: "#666",
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
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
