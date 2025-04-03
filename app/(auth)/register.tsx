import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "@/redux/hooks/auth/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [credential, setCredential] = useState("");
  const [username, setUsername] = useState("");
  const [shopName, setShopName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !credential ||
      !username ||
      !shopName ||
      !gender ||
      !password ||
      !retypePassword
    ) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== retypePassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(
        username,
        shopName,
        gender,
        credential,
        password
      );
      Alert.alert("Success", res?.message);
      router.push({ pathname: "/otp", params: { phone: credential } });
    } catch (error: any) {
      Alert.alert("Register Failed", error || "Something went wrong.");
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

      {/* Register Section */}
      <ScrollView style={styles.formContainer}>
        <Text style={styles.registerText}>Register Your Account</Text>

        {/* Email / Phone Input */}
        <TextInput
          style={styles.input}
          placeholder="EMAIL / PHONE NO"
          placeholderTextColor="#888"
          value={credential}
          onChangeText={setCredential}
          autoCapitalize="none"
        />

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="USER NAME"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Shop Name Input */}
        <TextInput
          style={styles.input}
          placeholder="SHOP NAME"
          placeholderTextColor="#888"
          value={shopName}
          onChangeText={setShopName}
        />

        {/* Gender */}
        <View style={styles.genderContainer}>
          <Text style={styles.genderText}>GENDER : </Text>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender("male")}
          >
            <View
              style={[
                styles.radioCircle,
                gender === "male" && styles.radioSelected,
              ]}
            />
            <Text style={styles.genderLabel}>MALE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender("female")}
          >
            <View
              style={[
                styles.radioCircle,
                gender === "female" && styles.radioSelected,
              ]}
            />
            <Text style={styles.genderLabel}>FEMALE</Text>
          </TouchableOpacity>
        </View>

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter any 6 digits Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            keyboardType="number-pad"
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

        {/* Retype Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Retype Your Password"
            placeholderTextColor="#888"
            value={retypePassword}
            onChangeText={setRetypePassword}
            secureTextEntry={!showRetypePassword}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowRetypePassword(!showRetypePassword)}
          >
            <Ionicons
              name={showRetypePassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>REGISTER</Text>
          )}
        </TouchableOpacity>

        {/* If you already have an account */}
        <Text style={styles.loginLinkText}>
          If you already have an Account ,{" "}
          <Text style={styles.loginLink} onPress={() => router.push("/login")}>
            Login Here!
          </Text>
        </Text>
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
    width: "100%",
  },
  registerText: {
    fontSize: 22,
    marginBottom: 35,
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F2F2F2",
    height: 50,
    borderRadius: 1000,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: "Saira-Regular",
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  genderText: {
    fontSize: 14,
    fontFamily: "Saira-Medium",
    marginRight: 10,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
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
  radioSelected: {
    backgroundColor: "#275AE8",
  },
  genderLabel: {
    fontSize: 14,
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
  registerButton: {
    backgroundColor: "#275AE8",
    width: "100%",
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Saira-Medium",
  },
  loginLinkText: {
    marginTop: 15,
    color: "#666",
    fontFamily: "Saira-Regular",
    textAlign: "center",
  },
  loginLink: {
    color: "#275AE8",
    fontFamily: "Saira-Medium",
  },
});
