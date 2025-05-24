import HeadLine from "@/components/ui/HeadLine";
import ProductCard from "@/components/ui/ProductCard";
import useAuth from "@/redux/hooks/auth/useAuth";
import useWishlist from "@/redux/hooks/wishlist/useWishlist";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Favorites() {
  const { wishlists, loading, loadMoreWishlists } = useWishlist();
  const { isAuthenticated } = useAuth();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = ({ nativeEvent }: any) => {
    if ((wishlists?.length ?? 0) < 20) return;
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      if (!debounceRef.current) {
        debounceRef.current = setTimeout(() => {
          loadMoreWishlists();
          debounceRef.current = null;
        }, 500);
      }
    }
  };

  // useEffect(() => {
  //   if (!loading && !isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [loading, isAuthenticated, router]);

  return (
    <>
      {/* <RouteGuard> */}
      <HeadLine />
      <ScrollView style={styles.container} onScroll={handleScroll}>
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <Text style={styles.headText}>Favorites</Text>
        </LinearGradient>

        {!isAuthenticated ? (
          <View style={styles.bodyCentered}>
            <Text style={styles.messageText}>
              Please
              <Link href={`/login`} style={{ color: "#52C5FE" }}>
                {" "}
                log in{" "}
              </Link>
              to view your favorites.
            </Text>
          </View>
        ) : wishlists?.length === 0 ? (
          <View style={styles.bodyCentered}>
            <Text style={styles.messageText}>Your wishlist is empty.</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            onScroll={handleScroll}
          >
            <View style={styles.row}>
              {wishlists.map((item) => (
                <View key={item.id} style={styles.item}>
                  <ProductCard product={item.product} />
                </View>
              ))}
            </View>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  animating
                  size="large"
                  color="#0000ff"
                  style={styles.loadingProcess}
                />
              </View>
            )}
          </ScrollView>
        )}
      </ScrollView>
      {/* </RouteGuard> */}
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: Platform.select({ ios: 50, android: 10 }),
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
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
  loadingProcess: {
    marginBottom: Platform.select({ ios: 100, android: 0 }),
  },
  bodyCentered: {
    flex: 1,
    height: 500,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 20,
    color: "#333",
    fontWeight: 500,
    fontFamily: "Saira-Bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
