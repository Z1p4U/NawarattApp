import HeadLine from "@/components/ui/HeadLine";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SearchComponent from "@/components/ui/SearchComponent";
import ProductCard from "@/components/ui/ProductCard";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import useProduct from "@/redux/hooks/product/useProduct";
import { useRef } from "react";

export default function Catalog() {
  const { products, setName, loadMoreProducts, loading } = useProduct();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      if (!debounceRef.current) {
        debounceRef.current = setTimeout(() => {
          loadMoreProducts();
          debounceRef.current = null;
        }, 500);
      }
    }
  };

  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container} onScroll={handleScroll}>
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
          {products?.map((product) => (
            <View
              key={product?.id}
              style={products?.length <= 1 ? styles.singleItem : styles.item}
            >
              <ProductCard product={product} />
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              animating={true}
              size="large"
              color="#0000ff"
              style={styles.loadingProcess}
            />
          </View>
        ) : (
          <></>
        )}
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
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 30,
    rowGap: 20,
    columnGap: 15,
  },
  item: {
    width: "47%",
    marginHorizontal: "auto",
  },
  singleItem: {
    width: "47%",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  loadingProcess: {
    marginBottom: Platform.select({
      ios: 100,
      android: 0, // Adjust this value if needed for Android
    }),
  },
});
