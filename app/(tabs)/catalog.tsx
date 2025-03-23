import HeadLine from "@/components/ui/HeadLine";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SearchComponent from "@/components/ui/SearchComponent";
import ProductCard from "@/components/ui/ProductCard";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import useProduct from "@/redux/hooks/product/useProduct";

export default function Catalog() {
  const { products, pagination, setPagination, setName } = useProduct();

  return (
    <>
      <HeadLine />
      <ScrollView
        style={styles.container}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 200
          ) {
            console.log(pagination?.size);
            setTimeout(() => {
              setPagination({ page: 1, size: pagination?.size + 20 });
            }, 100);
          }
        }}
      >
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <SearchComponent onchange={setName} />
        </LinearGradient>

        <View style={styles.menu}>
          <Text style={styles.menuText}>All Products</Text>
          <View style={styles.menu}>
            <Text style={styles.menuText}>Sort</Text>
            <Svg width={12} height={14} viewBox="0 0 12 14" fill="none">
              <Path
                d="M3.333 12.333V5.667m0 6.666l-2-2m2 2l2-2m3.334-8.666v6.666m0-6.666l2 2m-2-2l-2 2"
                stroke="#000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

        <View style={styles.row}>
          {products?.map((product, index) => (
            <View key={index} style={{ width: "45%" }}>
              <ProductCard item={product} />
            </View>
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
    minHeight: 100,
    padding: 15,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
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
