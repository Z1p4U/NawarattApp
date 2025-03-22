import HeadLine from "@/components/ui/HeadLine";
import ProductCard from "@/components/ui/ProductCard";
import useProduct from "@/redux/hooks/product/useProduct";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Favorites() {
  const { products } = useProduct();

  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <Text style={styles.headText}>Favorites</Text>
        </LinearGradient>

        <View style={styles.row}>
          {products?.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#000000",
    fontFamily: "Saira-Medium",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginHorizontal: 15,
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
});
