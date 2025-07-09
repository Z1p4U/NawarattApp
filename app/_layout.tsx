import "react-native-gesture-handler";
import { AppRegistry, Platform } from "react-native";
import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { LinearGradient } from "expo-linear-gradient";
import { logout } from "@/redux/services/auth/authSlice";
import { registerAuthInterceptor } from "@/constants/axios";
import usePushTokenSync from "@/hooks/usePushTokenSync";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

///////////////////////////////////////////////////////////////////////////////
// 0️⃣ FCM setup
const app = getApp();
const messaging = getMessaging(app);

///////////////////////////////////////////////////////////////////////////////
// 1️⃣ Configure Expo Notifications display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

///////////////////////////////////////////////////////////////////////////////
// 2️⃣ Background handler — always schedule a local notification
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  const data = (remoteMessage.data ?? {}) as Record<string, string>;
  const title = remoteMessage.notification?.title ?? data.title ?? "";
  const body = remoteMessage.notification?.body ?? data.description ?? "";

  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: "default" },
    trigger: null,
  });
});

export default function RootLayout() {
  const router = useRouter();

  // sync token & IMEI
  usePushTokenSync();
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    // Auth interceptor
    registerAuthInterceptor(() => store.dispatch(logout()));

    // Android notification channel
    (async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
        });
      }
    })();

    // Foreground handler — always schedule
    const unsubOnMessage = onMessage(messaging, async (remoteMessage) => {
      const data = (remoteMessage.data ?? {}) as Record<string, string>;
      const title = remoteMessage.notification?.title ?? data.title ?? "";
      const body = remoteMessage.notification?.body ?? data.description ?? "";

      await Notifications.scheduleNotificationAsync({
        content: { title, body, data, sound: "default" },
        trigger: null,
      });
    });

    // Tap handler — routing
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      ({ notification }) => {
        const data = notification.request.content.data as Record<
          string,
          string
        >;
        // console.log("Notification tapped:", JSON.stringify(data));

        if (data.type === "order" && data.order_id) {
          router.push(`/orderDetail?id=${data.order_id}`);
        } else if (data.type === "promotion" && data.discountable_id) {
          router.push(
            `/productListByCampaign?id=${data.discountable_id}&name=${data.title}`
          );
        } else {
          router.push(`/`);
        }
      }
    );

    return () => {
      unsubOnMessage();
      tapSub.remove();
    };
  }, [router]);

  // Load fonts
  const [loaded] = useFonts({
    "Saira-Bold": require("../assets/fonts/Saira-Bold.ttf"),
    "Saira-Medium": require("../assets/fonts/Saira-Medium.ttf"),
    "Saira-Regular": require("../assets/fonts/Saira-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Hide splash
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={["#53CAFE", "#2555E7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </LinearGradient>
    </Provider>
  );
}

AppRegistry.registerComponent("main", () => RootLayout);
