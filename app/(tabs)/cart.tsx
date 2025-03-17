import HeadLine from "@/components/ui/HeadLine";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function Cart() {
  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <Text>Cart</Text>
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
