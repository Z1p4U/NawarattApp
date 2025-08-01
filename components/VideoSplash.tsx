import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { StatusBar } from "expo-status-bar";

type Props = {
  onDone: () => void;
};

export default function VideoSplash({ onDone }: Props) {
  const [hasHidden, setHasHidden] = useState(false);

  // Hide the native splash only once
  const hideSplashOnce = async () => {
    if (!hasHidden) {
      setHasHidden(true);
      await SplashScreen.hideAsync();
    }
  };

  // 1️⃣ Initialize the player
  let player;
  try {
    player = useVideoPlayer(require("../assets/videos/splash.mp4"), (p) => {
      p.loop = false;
      p.play();
    });
  } catch (e) {
    hideSplashOnce();
    onDone();
    return null;
  }

  // 2️⃣ Listen for statusChange → ready or error
  useEventListener(player, "statusChange", async (payload) => {
    const { status, error } = payload;
    if (status === "readyToPlay") {
      await hideSplashOnce();
    }
    if (status === "error") {
      console.warn("VideoSplash load/play error:", error);
      await hideSplashOnce();
      onDone();
    }
  });

  useEventListener(player, "playToEnd", () => {
    onDone();
  });

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.video}
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          contentFit="cover"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    flex: 1,
  },
});
