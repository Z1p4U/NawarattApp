import HeadLine from "@/components/ui/HeadLine";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductCard from "@/components/ui/ProductCard";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useRef, useState } from "react";
import useTagProducts from "@/redux/hooks/product/useTagProducts";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function productListByTag() {
  const tagId = useSearchParams().get("id") ?? "";
  const tagName = useSearchParams().get("name") ?? "Anonymous Tag";

  const [refreshing, setRefreshing] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { tagProducts, loading, loadMore, reset, hasMore } =
    useTagProducts(tagId);

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

    reset();

    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <>
      <HeadLine />
      <FlatList
        data={tagProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text
                style={styles.headText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tagName}
              </Text>
            </LinearGradient>
            <View style={styles.menu}>
              <Text
                style={styles.menuText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Showing : {tagName} Products{" "}
              </Text>
              <View style={{ display: "none" }}>
                <Text style={styles.menuText} allowFontScaling={false}>
                  Sort
                </Text>
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
          </>
        )}
        renderItem={({ item }) => (
          <View key={item?.id} style={styles.item}>
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
              <Text style={styles.messageText} allowFontScaling={false}>
                Your {tagName} product list is empty.
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
        // Pull-to-refresh props:
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - 15 * 2 - 10) / 2;

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
    paddingHorizontal: 15,
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    justifyContent: "flex-end",
    marginBottom: 20,
    marginHorizontal: -15,
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
    gap: 10,
    marginBottom: 20,
  },
  menuText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#000000",
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
    // minHeight: (3 * SCREEN_HEIGHT) / 5,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fff",
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
