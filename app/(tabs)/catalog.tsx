import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import SearchComponent from "@/components/ui/SearchComponent";
import ProductCard from "@/components/ui/ProductCard";
import useProduct from "@/redux/hooks/product/useProduct";
import FilterModal, { FilterSheetRef } from "@/components/Catalog/FilterModal";
import useCatalogCategory from "@/redux/hooks/category/useCatalogCategory";
import useCatalogBrand from "@/redux/hooks/brand/useCatalogBrand";
import useCatalogTag from "@/redux/hooks/tag/useCatalogTag";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 15 * 2 - 10) / 2;

export default function Catalog() {
  const [refreshing, setRefreshing] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const filterRef = useRef<FilterSheetRef>(null);

  const {
    products,
    loading,
    hasMore,
    name,
    catId,
    brandId,
    tagId,
    minPrice,
    maxPrice,
    loadMore,
    reset,
    setName,
    handleSearch,
    handleFilterSubmit,
  } = useProduct();
  const { categories } = useCatalogCategory();
  const { brands } = useCatalogBrand();
  const { tags } = useCatalogTag();

  const onFilterPress = useCallback(() => {
    filterRef.current?.open();
  }, []);

  const onEndReached = () => {
    if (!debounceRef.current) {
      debounceRef.current = setTimeout(() => {
        loadMore();
        debounceRef.current = null;
      }, 500);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setName("");
    reset();
    setTimeout(() => setRefreshing(false), 800);
  }, [reset]);

  return (
    <>
      <HeadLine />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <SearchComponent
                searched={name}
                onchange={handleSearch}
                filterClicked={onFilterPress}
              />
            </LinearGradient>
          </>
        }
        renderItem={({ item }) => (
          <View key={item.id} style={styles.item}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={() =>
          loading ? (
            <View style={styles.bodyCentered}>
              <ActivityIndicator size="large" color="#2555E7" />
            </View>
          ) : (
            <View style={styles.bodyCentered}>
              <Text style={styles.messageText}>
                Your product list is empty.
              </Text>
            </View>
          )
        }
        style={styles.flatList}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ flexGrow: 1, ...styles.container }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2555E7" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <SafeAreaView>
        <FilterModal
          ref={filterRef}
          categories={categories}
          brands={brands}
          tags={tags}
          initialCatId={catId}
          initialBrandId={brandId}
          initialTagId={tagId}
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          onApply={(c, b, t, min, max) => {
            handleFilterSubmit(c, b, t, min, max);
          }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingBottom: Platform.select({
      ios: 50,
      android: 10,
    }),
    paddingHorizontal: 15,
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 100,
    padding: 15,
    justifyContent: "flex-end",
    marginBottom: 20,
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
  bodyCentered: {
    flex: 1,
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
