import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import HeadLine from "@/components/ui/HeadLine";
import SearchComponent from "@/components/ui/SearchComponent";
import ProductCard from "@/components/ui/ProductCard";
import useProduct from "@/redux/hooks/product/useProduct";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Catalog() {
  const [search, setSearch] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { products, loading, loadMore } = useProduct(search, brandFilter, 20);

  useFocusEffect(
    React.useCallback(() => {
      // reset filters on focus
      setSearch(null);
      setBrandFilter(null);
    }, [])
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onEndReached = () => {
    if ((products?.length ?? 0) < 20) return;
    if (!debounceRef.current) {
      debounceRef.current = setTimeout(() => {
        loadMore();
        debounceRef.current = null;
      }, 500);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // bump key so FlatList fully remounts and useProduct re-fetches first page
    setRefreshKey((k) => k + 1);
    // give it a moment for the remount+fetch to start
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <>
      <FlatList
        key={refreshKey} // <-- force remount on refresh
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={
          <>
            <View style={{ marginHorizontal: -15 }}>
              <HeadLine />
            </View>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <SearchComponent onchange={setSearch} />
            </LinearGradient>
          </>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        columnWrapperStyle={styles.row} // style for each row
        contentContainerStyle={styles.container} // overall padding
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        }
        // Pull-to-refresh props:
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - 20 * 2 - 10) / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
    paddingHorizontal: 15,
    minHeight: "100%",
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 100,
    padding: 15,
    marginBottom: 20,
    justifyContent: "flex-end",
    marginHorizontal: -15,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  item: {
    width: CARD_WIDTH,
  },
  loadingContainer: {
    paddingVertical: 30,
  },
});
