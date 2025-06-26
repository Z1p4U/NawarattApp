import "react-native-gesture-handler";
import { AppRegistry, Platform, Alert } from "react-native";
import React, { useEffect } from "react";

import * as Notifications from "expo-notifications";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
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

// 0️⃣ Grab your default Firebase App & Messaging instance
const app = getApp();
const messaging = getMessaging(app);

// Tell Expo how to display notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Background handler (outside React) for messages when app is backgrounded/killed
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  const data = (remoteMessage.data ?? {}) as Record<string, string>;
  const title = data.title;
  const body = data.description;
  console.log("BG handler got data:", data);
  console.log("BG title:", title);
  console.log("BG body:", body);

  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: "default" },
    trigger: null,
  });
});

export default function RootLayout() {
  usePushTokenSync();

  SplashScreen.preventAutoHideAsync();
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      // 1️⃣ Android channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
        });
      }

      // 2️⃣ Foreground messages
      const unsubscribeOnMessage = onMessage(
        messaging,
        async (remoteMessage) => {
          const data = (remoteMessage.data ?? {}) as Record<string, string>;
          const title = remoteMessage.notification?.title ?? data.title;
          const body = remoteMessage.notification?.body ?? data.description;

          await Notifications.scheduleNotificationAsync({
            content: { title, body, data, sound: "default" },
            trigger: null,
          });
        }
      );

      // 3️⃣ Notification taps
      const subscription =
        Notifications.addNotificationResponseReceivedListener(
          ({ notification }) => {
            const tappedData = notification.request.content.data as Record<
              string,
              string
            >;
            console.log("Notification tapped:", tappedData);
          }
        );

      return () => {
        unsubscribeOnMessage();
        subscription.remove();
      };
    })();
  }, []);

  useEffect(() => {
    registerAuthInterceptor(() => {
      store.dispatch(logout());
    });
  }, []);

  useEffect(() => {
    registerAuthInterceptor(() => {
      store.dispatch(logout());
    });
  }, []);

  const [loaded] = useFonts({
    "Saira-Bold": require("../assets/fonts/Saira-Bold.ttf"),
    "Saira-Medium": require("../assets/fonts/Saira-Medium.ttf"),
    "Saira-Regular": require("../assets/fonts/Saira-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
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
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </LinearGradient>
    </Provider>
  );
}

AppRegistry.registerComponent("main", () => RootLayout);
