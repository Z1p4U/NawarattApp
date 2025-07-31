import HeadLine from "@/components/ui/HeadLine";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductCard from "@/components/ui/ProductCard";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef, useState, useEffect } from "react";
import useCampaignProducts from "@/redux/hooks/product/useCampaignProducts";
import { useSearchParams } from "expo-router/build/hooks";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 15 * 2 - 10) / 2;

export default function productListByCampaign() {
  const campaignId = useSearchParams().get("id") ?? "";
  const campaignName = useSearchParams().get("name") ?? "Anonymous Campaign";
  const campaignImage = useSearchParams().get("image") ?? null;
  const expiresAt = useSearchParams().get("expire") ?? "2025-12-31T23:59:59Z";

  const [refreshing, setRefreshing] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { campaignProducts, loadMore, loading, reset, hasMore } =
    useCampaignProducts(campaignId);

  const [timeLeft, setTimeLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  }>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  // every-second tick
  useEffect(() => {
    const target = new Date(expiresAt).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(iv);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({ d, h, m, s });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [expiresAt]);

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
  }, [reset]);

  const placeholderImage = require("../../assets/images/banner-placeholder.png");
  const thumbnailSource =
    typeof campaignImage === "string"
      ? { uri: campaignImage }
      : placeholderImage;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <>
      <HeadLine />
      <FlatList
        data={campaignProducts}
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
                {campaignName}
              </Text>
            </LinearGradient>

            <View style={styles.imageContainer}>
              <ImageBackground
                source={placeholderImage}
                style={styles.imageBg}
                imageStyle={styles.imageStyle}
              >
                <Image
                  source={thumbnailSource}
                  style={[styles.imageOverlay, styles.imageStyle]}
                />
              </ImageBackground>
            </View>

            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>End in</Text>

              <View style={styles.countdownRow}>
                {[
                  { label: "Days", value: pad(timeLeft.d) },
                  { label: "Hours", value: pad(timeLeft.h) },
                  { label: "Min", value: pad(timeLeft.m) },
                  { label: "Sec", value: pad(timeLeft.s) },
                ].map((item) => (
                  <View key={item.label} style={styles.countdownBox}>
                    <View style={styles.countdownValueContainer}>
                      <Text style={styles.countdownValue}>{item.value}</Text>
                    </View>
                    <Text style={styles.countdownLabel}>{item.label}</Text>
                  </View>
                ))}
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
                Your {campaignName} product list is empty.
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
    </>
  );
}

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

  imageContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
  },
  imageBg: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
  },
  imageStyle: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0000001A",
  },

  countdownContainer: {
    marginTop: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  countdownRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.9,
    paddingVertical: 8,
    gap: 15,
  },
  countdownBox: {
    alignItems: "center",
  },
  countdownText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Saira-Bold",
    textAlign: "center",
  },
  countdownValueContainer: {
    borderRadius: 12,
    padding: 5,
    alignItems: "center",
    backgroundColor: "#1877f2",
    width: 30,
  },
  countdownValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Saira-Medium",
  },
  countdownLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
    marginTop: 2,
    fontFamily: "Saira-Regular",
  },
});
