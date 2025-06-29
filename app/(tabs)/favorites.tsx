import React, { useCallback, useRef, useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import HeadLine from "@/components/ui/HeadLine";
import ProductCard from "@/components/ui/ProductCard";
import useAuth from "@/redux/hooks/auth/useAuth";
import useWishlist from "@/redux/hooks/wishlist/useWishlist";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Favorites() {
  const [refreshing, setRefreshing] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { wishlists, loading, loadMore, reset, hasMore } = useWishlist();
  const { isAuthenticated } = useAuth();

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
        data={wishlists}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
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
              Favorites
            </Text>
          </LinearGradient>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ProductCard product={item.product} />
          </View>
        )}
        ListEmptyComponent={() =>
          !isAuthenticated ? (
            <View style={styles.bodyCentered}>
              <Text style={styles.messageText} allowFontScaling={false}>
                Please
                <Link href="/login" style={styles.linkText}>
                  {" "}
                  log in{" "}
                </Link>
                to view your favorites.
              </Text>
            </View>
          ) : loading ? (
            <View style={styles.bodyCentered}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.bodyCentered}>
              <Text style={styles.messageText} allowFontScaling={false}>
                Your wishlist is empty.
              </Text>
            </View>
          )
        }
        style={styles.flatList}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          hasMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : null
        }
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
    minHeight: (3 * SCREEN_HEIGHT) / 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "Saira-Medium",
  },
  linkText: {
    color: "#52C5FE",
  },
});
