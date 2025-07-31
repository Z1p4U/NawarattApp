import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import { useEvent } from "expo";

type Props = { onDone: () => void };

const VIDEO_SRC: VideoSource = require("../assets/videos/splash.mp4");
const IMAGE_FALLBACK = require("../assets/images/placeholder.png");

export default function VideoSplash({ onDone }: Props) {
  const [phase, setPhase] = useState<"loading" | "playing" | "fallback">(
    "loading"
  );

  // 1️⃣ Prevent auto‐hide, preload video asset
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    Asset.loadAsync(VIDEO_SRC)
      .then(() => setPhase("playing"))
      .catch(() => setPhase("fallback"));
  }, []);

  const player = useVideoPlayer(VIDEO_SRC);

  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });

  useEffect(() => {
    if (phase === "playing" && status?.isLoaded && !status.isPlaying) {
      player.play();
    }
  }, [phase, status, player]);

  useEffect(() => {
    if (status?.didJustFinish && phase === "playing") {
      endSplash();
    }
    if (phase === "playing") {
      const t = setTimeout(() => setPhase("fallback"), 5000);
      return () => clearTimeout(t);
    }
  }, [status, phase]);

  function endSplash() {
    SplashScreen.hideAsync().finally(onDone);
  }

  // 6️⃣ Render
  if (phase === "loading") {
    return null; // keep native splash
  }

  return (
    <View style={styles.container}>
      {phase === "fallback" ? (
        <Image
          source={IMAGE_FALLBACK}
          style={styles.fullscreen}
          resizeMode="cover"
          onLoadEnd={endSplash}
        />
      ) : (
        <VideoView
          player={player}
          style={styles.fullscreen}
          contentFit="cover"
          nativeControls={false}
          onError={() => setPhase("fallback")}
        />
      )}
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  fullscreen: { width, height },
});
