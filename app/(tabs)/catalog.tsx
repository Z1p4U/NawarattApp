import HeadLine from "@/components/ui/HeadLine";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SearchComponent from "@/components/ui/SearchComponent";

export default function Catalog() {
  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <SearchComponent />

        <LinearGradient
          colors={["#54CAFF", "#275AE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.chat}
        >
          <Link
            href={{
              pathname: "/searchedProductList",
            }}
            style={styles.chatText}
          >
            Go to Product Listing Page
          </Link>
        </LinearGradient>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  chat: {
    marginTop: 300,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 1000,
    marginHorizontal: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
