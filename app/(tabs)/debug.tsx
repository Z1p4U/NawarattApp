import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button } from "react-native";
import messaging from "@react-native-firebase/messaging";

export default function App() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 1. Request notification permissions (iOS shows prompt; Android auto-grants)
      const authStatus = await messaging().requestPermission();
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        // 2. Get the FCM registration token
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log("🔑 FCM Token:", token);
        // TODO: send `token` to your Laravel backend
      } else {
        Alert.alert(
          "Permission denied",
          "Cannot get FCM token without permissions"
        );
      }
    })();

    // Optional: listen for incoming messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("FCM Message:", remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title ?? "",
        remoteMessage.notification?.body ?? ""
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text>FCM registration token:</Text>
      <Text selectable>{fcmToken ?? "Fetching..."}</Text>
      <Button
        title="Refresh Token"
        onPress={async () => {
          const newToken = await messaging().getToken();
          setFcmToken(newToken);
          console.log("🔄 New FCM Token:", newToken);
        }}
      />
    </View>
  );
}
