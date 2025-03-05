import { ScrollView, StyleSheet, Text } from "react-native";

export default function Favorites() {
  return (
    <ScrollView style={styles.container}>
      <Text>Favorites</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});
