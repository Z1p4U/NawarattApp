import HeadLine from "@/components/ui/HeadLine";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductCard from "@/components/ui/ProductCard";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import useSpecialCategoryProducts from "@/redux/hooks/product/useSpecialCategoryProducts";
import { useSearchParams } from "expo-router/build/hooks";
import { Product } from "@/constants/config";

export default function ProductListByCategory() {
  const categoryName = useSearchParams().get("name") ?? "";
  const [data, setData] = useState<Product[] | null>(null);

  const {
    newArrivalProducts,
    topPickProducts,
    topSellingProducts,
    loadMore,
    loading,
  } = useSpecialCategoryProducts();

  useEffect(() => {
    if (categoryName === "Top Selling") {
      setData(topSellingProducts);
    } else if (categoryName === "New Arrivals") {
      setData(newArrivalProducts);
    } else {
      setData(topPickProducts);
    }
  }, [categoryName, newArrivalProducts, topPickProducts, topSellingProducts]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleScroll = ({ nativeEvent }: any) => {
    if ((data?.length ?? 0) < 20) return;
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      if (!debounceRef.current) {
        debounceRef.current = setTimeout(() => {
          loadMore();
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
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Text style={styles.headText}>
            {categoryName || "Special"} Category Products
          </Text>
        </LinearGradient>

        <View style={styles.menu}>
          <Text style={styles.menuText}>
            Showing: {categoryName || "Top Picks"}
          </Text>
        </View>

        <View style={styles.row}>
          {data?.map((product) => (
            <View key={product.id} style={styles.item}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating size="large" color="#0000ff" />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 100,
    padding: 15,
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    rowGap: 20,
    columnGap: 15,
  },
  item: {
    width: "47%",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
});
