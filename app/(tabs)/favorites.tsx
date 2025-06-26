import React, { useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 15 * 2 - 10) / 2;

export default function Favorites() {
  const { wishlists, loading, loadMoreWishlists } = useWishlist();
  const { isAuthenticated } = useAuth();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const onEndReached = () => {
    if ((wishlists?.length ?? 0) < 20) return;
    if (!debounceRef.current) {
      debounceRef.current = setTimeout(() => {
        loadMoreWishlists();
        debounceRef.current = null;
      }, 500);
    }
  };

  return (
    <FlatList
      data={wishlists}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      // HEADER: HeadLine + Banner
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
              Favorites
            </Text>
          </LinearGradient>
        </View>
      )}
      // EMPTY: not logged in or empty wishlist
      ListEmptyComponent={() => {
        if (!isAuthenticated) {
          return (
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
          );
        }
        return (
          <View style={styles.bodyCentered}>
            <Text style={styles.messageText} allowFontScaling={false}>
              Your wishlist is empty.
            </Text>
          </View>
        );
      }}
      // ITEM RENDERER
      renderItem={({ item }) => (
        <View style={styles.item}>
          <ProductCard product={item.product} />
        </View>
      )}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      // INFINITE SCROLL
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      // FOOTER: loading spinner
      ListFooterComponent={
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
    paddingHorizontal: 15,
    minHeight: "100%",
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
  },
  linkText: {
    color: "#52C5FE",
  },
});
