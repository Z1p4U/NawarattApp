import { useState, useEffect } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// 0️⃣ Tell Expo how to display notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] =
    useState<Notifications.Notification>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      // 1️⃣ Create a channel with your noti sound
      Notifications.setNotificationChannelAsync("nawaratt", {
        name: "Nawaratt",
        importance: Notifications.AndroidImportance.MAX,
        sound: "nawaratt", // must match your bundled file
        vibrationPattern: [0], // no vibration
      }).then(() => {
        // then list channels so you can see it
        Notifications.getNotificationChannelsAsync().then(setChannels);
      });
    }

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      (n) => {
        setNotification(n);
      }
    );
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((r) => {
        console.log("Tapped notification:", r);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#fff",
      }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>Channels: {channels.map((c) => c.id).join(", ")}</Text>
      <View>
        <Text>Title: {notification?.request.content.title}</Text>
        <Text>Body: {notification?.request.content.body}</Text>
        <Text>Data: {JSON.stringify(notification?.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          // 2️⃣ Schedule on your channel
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "You've got mail! 📬",
              body: "This is the notification body",
              data: { foo: "bar" },
              sound: "nawaratt", // iOS, and fallback
            },
            trigger: { seconds: 0, channelId: "nawaratt" },
          });
        }}
      />
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token");
      return;
    }
    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Token:", token);
    } catch (e) {
      console.error(e);
    }
  } else {
    alert("Must use physical device");
  }
  return token;
}
