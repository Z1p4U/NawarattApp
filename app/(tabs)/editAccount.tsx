import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import useUser from "@/redux/hooks/user/useUser";
import { PinPayload, ProfilePayload } from "@/constants/config";
import useAuth from "@/redux/hooks/auth/useAuth";
import { router } from "expo-router";
import GoBack from "@/components/ui/GoBack";

export default function EditAccount() {
  const { profileDetail, updateProfile } = useUser();
  const { logout } = useAuth();

  const [formData, setFormData] = useState<ProfilePayload>({
    name: profileDetail?.data?.name || "",
    shop_name: profileDetail?.data?.user_data?.shop_name || "",
    phone: profileDetail?.data?.phone || "",
    email: profileDetail?.data?.email || "",
    gender: profileDetail?.data?.user_data?.gender || "male",
  });

  const [pinData, setPinData] = useState<PinPayload>({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });

  const handleChange = <K extends keyof ProfilePayload>(
    key: K,
    value: ProfilePayload[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePinChange = <K extends keyof PinPayload>(
    key: K,
    value: PinPayload[K]
  ) => {
    setPinData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateProfile = useCallback(async () => {
    try {
      const response = await updateProfile(formData);

      if (response) {
        alert("Profile updated successfully!");
        router.push("/account");
      }
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  }, [updateProfile, formData]);

  const handleUpdatePin = () => {
    if (pinData.newPin !== pinData.confirmPin) {
      alert("New PINs do not match!");
      return;
    }
    // console.log("Submitting pin data", pinData);
    alert("This feature will coming soon");
    // dispatch update pin action here
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();

            router.replace("/");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <HeadLine />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <Text style={styles.headText} allowFontScaling={false}>
            Edit Account
          </Text>
        </LinearGradient>

        <GoBack to={"/account"} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name ..."
            placeholderTextColor="#888"
            value={formData.name}
            defaultValue={
              profileDetail?.data?.name ? profileDetail?.data?.name : ""
            }
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your shop name ..."
            defaultValue={
              profileDetail?.data?.user_data?.shop_name
                ? profileDetail?.data?.user_data?.shop_name
                : ""
            }
            placeholderTextColor="#888"
            value={formData.shop_name}
            onChangeText={(text) => handleChange("shop_name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number ..."
            defaultValue={
              profileDetail?.data?.phone ? profileDetail?.data?.phone : ""
            }
            placeholderTextColor="#888"
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email address ..."
            defaultValue={
              profileDetail?.data?.email ? profileDetail?.data?.email : ""
            }
            placeholderTextColor="#888"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 25,
              paddingHorizontal: 20,
              marginTop: 15,
            }}
          >
            <Text style={styles.radioText} allowFontScaling={false}>
              Gender :{" "}
            </Text>
            {["male", "female"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioRow}
                onPress={() =>
                  handleChange("gender", option as "male" | "female")
                }
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.gender === option && styles.selected,
                  ]}
                />
                <Text style={styles.radioText} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={handleUpdateProfile}
          >
            <LinearGradient
              colors={["#54CAFF", "#275AE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chat}
            >
              <Text style={styles.chatText} allowFontScaling={false}>
                Update Account
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.centerText} allowFontScaling={false}>
            Change Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Type Old Pin ..."
            placeholderTextColor="#888"
            value={pinData.oldPin}
            onChangeText={(text) => handlePinChange("oldPin", text)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Enter any 6 digits pin ..."
            placeholderTextColor="#888"
            value={pinData.newPin}
            onChangeText={(text) => handlePinChange("newPin", text)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Retype Your Pin ..."
            placeholderTextColor="#888"
            value={pinData.confirmPin}
            onChangeText={(text) => handlePinChange("confirmPin", text)}
            secureTextEntry
          />

          <TouchableOpacity style={{ marginTop: 20 }} onPress={handleUpdatePin}>
            <LinearGradient
              colors={["#54CAFF", "#275AE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chat}
            >
              <Text style={styles.chatText} allowFontScaling={false}>
                Update Pin
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 30 }} onPress={handleLogout}>
            <View style={styles.outline}>
              <Text style={styles.outlineText} allowFontScaling={false}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
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
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },

  inputContainer: {
    gap: 15,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily: "Saira-Regular",
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 200,
    backgroundColor: "#F2F3F4",
    gap: 10,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },

  centerText: {
    fontSize: 17,
    textTransform: "uppercase",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },

  chat: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 1000,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  outline: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 1000,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    borderColor: "#ff0000",
    borderWidth: 2,
  },
  outlineText: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
