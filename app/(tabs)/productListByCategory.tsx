import HeadLine from "@/components/ui/HeadLine";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "@/components/ui/ProductCard";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import useSpecialCategoryProducts from "@/redux/hooks/product/useSpecialCategoryProducts";
import { useSearchParams } from "expo-router/build/hooks";
import { Product } from "@/constants/config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductListByCategory() {
  const categoryId = useSearchParams().get("id") ?? "";
  const categoryName = useSearchParams().get("name") ?? "";
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { specialCategoriesProducts, loadMore, loading } =
    useSpecialCategoryProducts(categoryId);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onEndReached = () => {
    if ((specialCategoriesProducts?.length ?? 0) < 20) return;
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
        key={refreshKey}
        data={specialCategoriesProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={() => (
          <View style={styles.headerWrapper}>
            <HeadLine />
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text style={styles.headText} allowFontScaling={false}>
                {categoryName}
              </Text>
            </LinearGradient>
          </View>
        )}
        renderItem={({ item }) => <ProductCard product={item} />}
        style={styles.flatList}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListEmptyComponent={() => {
          return (
            <View style={styles.bodyCentered}>
              <Text style={styles.messageText} allowFontScaling={false}>
                Your category product is empty.
              </Text>
            </View>
          );
        }}
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
  flatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
    paddingHorizontal: 15,
  },
  headerWrapper: {
    marginHorizontal: -15, // cancel the container's horizontal padding
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
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
  bodyCentered: {
    flex: 1,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "Saira-Medium",
  },
});
