import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import { AddressPayload } from "@/constants/config";
import useCountries from "@/redux/hooks/location/useCountries";
import useStates from "@/redux/hooks/location/useStates";
import useCities from "@/redux/hooks/location/useCities";
import useAddressAction from "@/redux/hooks/address/useAddressAction";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import GoBack from "@/components/ui/GoBack";
import AlertBox from "@/components/ui/AlertBox";

export default function AddressCreate() {
  const router = useRouter();

  const { createAddress, status } = useAddressAction();
  const { countries, loading: countryLoading } = useCountries();

  const [formData, setFormData] = useState<AddressPayload>({
    country_id: null,
    state_id: null,
    city_id: null,
    address: "",
    phone_no: "",
    is_default: true,
    additional_info: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [resendModalVisible, setResendModalVisible] = useState(false);

  const { states, loading: stateLoading } = useStates({
    countryId: formData?.country_id,
  });
  const { cities, loading: cityLoading } = useCities({
    countryId: formData?.country_id,
    stateId: formData?.state_id,
  });

  const handleChange = useCallback(
    <K extends keyof AddressPayload>(key: K, value: AddressPayload[K]) => {
      setFormData((f) => ({ ...f, [key]: value }));
    },
    []
  );

  const getSetter = useCallback(
    <K extends keyof AddressPayload>(key: K) =>
      (value: AddressPayload[K]) =>
        setFormData((f) => ({ ...f, [key]: value })),
    []
  );

  const handleSubmit = useCallback(async () => {
    try {
      const res = await createAddress(formData);

      setFormData({
        country_id: null,
        state_id: null,
        city_id: null,
        address: "",
        phone_no: "",
        is_default: true,
        additional_info: "",
      });

      setAlertMessage(res?.message || "Address created successfully!");
      setAlertModalVisible(true);
    } catch {
      // Alert.alert("Error", "Failed to create address. Please try again.");
      setAlertMessage("Failed to create address. Please try again.");
      setResendModalVisible(true);
    }
  }, [createAddress, formData]);

  useEffect(() => {
    setFormData((f) => ({ ...f, state_id: null, city_id: null }));
  }, [formData.country_id]);

  const isFormValid = Boolean(
    formData.country_id &&
      formData.state_id &&
      formData.city_id &&
      formData.address.trim() &&
      formData.phone_no.trim()
  );

  const onClose = () => {
    router.push("/addressBook");
    setAlertModalVisible(false);
    setAlertMessage("");
  };

  const onResendClose = () => {
    setResendModalVisible(false);
    setAlertMessage("");
  };

  return (
    <>
      <HeadLine />
      <SafeAreaView style={{ flex: 1 }}>
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
              Create Address
            </Text>
          </LinearGradient>
          <GoBack to={"/addressBook"} />
          <View style={styles.inputContainer}>
            {/* Country */}
            <Text style={styles.label} allowFontScaling={false}>
              Country
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.country_id}
                // onValueChange={(v) => handleChange("country_id", v)}
                onValueChange={getSetter("country_id")}
              >
                <Picker.Item label="Select country…" value={null} />
                {countries?.map((c, index) => (
                  <Picker.Item key={index} label={c.name_en} value={c.id} />
                ))}
              </Picker>
            </View>

            {/* State */}
            <Text style={styles.label} allowFontScaling={false}>
              State
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                enabled={formData.country_id !== null}
                selectedValue={formData.state_id}
                // onValueChange={(v) => handleChange("state_id", v)}
                onValueChange={getSetter("state_id")}
              >
                <Picker.Item label="Select state…" value={null} />
                {states?.map((s, index) => (
                  <Picker.Item key={index} label={s.name_en} value={s.id} />
                ))}
              </Picker>
            </View>

            {/* City */}
            <Text style={styles.label} allowFontScaling={false}>
              City
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                enabled={formData.state_id !== null}
                selectedValue={formData.city_id}
                // onValueChange={(v) => handleChange("city_id", v)}
                onValueChange={getSetter("city_id")}
              >
                <Picker.Item label="Select city…" value={null} />
                {cities?.map((c, index) => (
                  <Picker.Item key={index} label={c.name_en} value={c.id} />
                ))}
              </Picker>
            </View>

            {/* Street Address */}
            <Text style={styles.label} allowFontScaling={false}>
              Street Address
            </Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main St., Apt 4B"
              value={formData.address}
              onChangeText={(t) => handleChange("address", t)}
            />

            {/* Phone */}
            <Text style={styles.label} allowFontScaling={false}>
              Phone No.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0912345678"
              keyboardType="phone-pad"
              value={formData.phone_no}
              onChangeText={(t) => handleChange("phone_no", t)}
            />

            {/* Additional Info */}
            <Text style={styles.label}>Additional Info</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write an additional information ..."
              multiline
              numberOfLines={3}
              value={formData.additional_info}
              onChangeText={(t) => handleChange("additional_info", t)}
            />

            {/* Submit */}
            <TouchableOpacity
              onPress={() => {
                if (isFormValid) {
                  handleSubmit();
                } else {
                  setAlertMessage("Please fill in all required fields.");
                  setResendModalVisible(true);
                }
              }}
              disabled={status === "loading"}
            >
              <LinearGradient
                colors={["#54CAFF", "#275AE8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Save Address</Text>
              </LinearGradient>
            </TouchableOpacity>
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
      </SafeAreaView>
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
  },

  inputContainer: {
    paddingHorizontal: 15,
    gap: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  pickerWrapper: {
    borderRadius: 10,
    backgroundColor: "#F2F3F4",
    overflow: "hidden",
  },
  input: {
    backgroundColor: "#F2F3F4",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
  textArea: {
    textAlignVertical: "top",
    height: 80,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
