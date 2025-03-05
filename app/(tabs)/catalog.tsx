import { ScrollView, StyleSheet, Text } from "react-native";

export default function Catalog() {
  return (
    <ScrollView style={styles.container}>
      <Text>Catalog</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});
