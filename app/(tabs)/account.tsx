import { ScrollView, StyleSheet, Text } from "react-native";

export default function Account() {
  return (
    <ScrollView style={styles.container}>
      <Text>Account</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});
