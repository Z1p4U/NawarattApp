import HeadLine from "@/components/ui/HeadLine";
import ProductCard from "@/components/ui/ProductCard";
import useWishlist from "@/redux/hooks/wishlist/useWishlist";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
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
          <Text style={styles.headText}>Favorites</Text>
        </LinearGradient>

        <View style={styles.row}>
          {wishlists?.map((item) => (
            <View key={item?.id} style={styles.item}>
              <ProductCard product={item?.product} />
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
    marginBottom: Platform.select({ ios: 50, android: 10 }),
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
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
