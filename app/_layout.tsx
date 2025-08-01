import "react-native-gesture-handler";
import { AppRegistry, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
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
import VideoSplash from "@/components/VideoSplash";
import { useAppReady } from "@/hooks/useAppReady";

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

// Notifications.addNotificationReceivedListener((notification) => {
//   console.log("Received notification:", JSON.stringify(notification, null, 2));
// });

///////////////////////////////////////////////////////////////////////////////
// 2️⃣ Background handler — always schedule a local notification
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  const data = (remoteMessage.data ?? {}) as Record<string, string>;
  const title = remoteMessage.notification?.title ?? data.title ?? "";
  const body = remoteMessage.notification?.body ?? data.description ?? "";

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: "nawaratt",
      vibrate: [0],
    },
    trigger: { seconds: 0, channelId: "nawaratt" },
  });
});

export default function RootLayout() {
  const router = useRouter();
  const { isReady, fontsLoaded, handleVideoDone, videoDone } = useAppReady();

  usePushTokenSync();

  useEffect(() => {
    // Auth interceptor
    registerAuthInterceptor(() => store.dispatch(logout()));

    (async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("nawaratt", {
          name: "Nawaratt",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0],
          sound: "nawaratt",
        });
      }
    })();

    // Foreground handler — always schedule
    const unsubscribeOnMessage = onMessage(messaging, async (msg) => {
      const data = (msg.data ?? {}) as Record<string, string>;
      const title = msg.notification?.title ?? data.title ?? "";
      const body = msg.notification?.body ?? data.description ?? "";

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          vibrate: [0],
          sound: "nawaratt",
        },
        trigger: { seconds: 0, channelId: "nawaratt" },
      });
    });

    // Tap handler — routing
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      ({ notification }) => {
        const data = notification.request.content.data as Record<
          string,
          string
        >;
        console.log("Notification tapped:", JSON.stringify(data));

        if (data.type === "order" && data.order_id) {
          router.push(`/orderDetail?id=${data.order_id}`);
        } else if (data.type === "promotion" && data.discountable_id) {
          router.push(
            `/productListByCampaign?id=${data.discountable_id}&name=${data.title}&image=${data?.image}&expire=${data?.end_date}`
          );
        } else {
          router.push(`/`);
        }
      }
    );

    return () => {
      unsubscribeOnMessage();
      tapSub.remove();
    };
  }, [router]);

  if (!fontsLoaded) {
    return null;
  }
  if (!videoDone) {
    return <VideoSplash onDone={handleVideoDone} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <StatusBar style="dark" />
          </ThemeProvider>
        </LinearGradient>
      </Provider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent("main", () => RootLayout);
