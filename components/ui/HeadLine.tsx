import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function HeadLine() {
  return (
    <>
      <LinearGradient
        colors={["#53CAFE", "#2555E7"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={styles.headLine}
      ></LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headLine: {
    height: 40,
    position: "fixed",
    top: 0,
    zIndex: 100,
    marginBottom: -40,
  },
});
