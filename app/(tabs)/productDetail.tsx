import HeadLine from "@/components/ui/HeadLine";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function productDetail() {
  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <Text style={{ marginTop: 220, color: "black" }}>Hello</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});
