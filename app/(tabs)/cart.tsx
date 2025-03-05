import { ScrollView, StyleSheet, Text } from "react-native";

export default function Cart() {
  return (
    <ScrollView style={styles.container}>
      <Text>Cart</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});
