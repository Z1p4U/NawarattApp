import { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

export function useAppReady() {
  const [fontsLoaded] = useFonts({
    "Saira-Bold": require("../assets/fonts/Saira-Bold.ttf"),
    "Saira-Medium": require("../assets/fonts/Saira-Medium.ttf"),
    "Saira-Regular": require("../assets/fonts/Saira-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [videoDone, setVideoDone] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (fontsLoaded && videoDone) {
      SplashScreen.hideAsync().catch(() => {});
      setIsReady(true);
    }
  }, [fontsLoaded, videoDone]);

  const handleVideoDone = useCallback(() => setVideoDone(true), []);

  return { isReady, fontsLoaded, videoDone, handleVideoDone };
}
