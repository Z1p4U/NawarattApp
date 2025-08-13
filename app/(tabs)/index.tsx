import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  ListRenderItemInfo,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import HeadLine from "@/components/ui/HeadLine";
import ImageCarousel from "@/components/Home/ImageCarousel";
import DiscoverCarousel from "@/components/Home/DiscoverCarousel";
import ProductSlider from "@/components/ui/ProductSlider";
import BrandList from "@/components/Home/BrandList";
import { Link, useRouter } from "expo-router";
import useAuth from "@/redux/hooks/auth/useAuth";
import useUser from "@/redux/hooks/user/useUser";
import useCategory from "@/redux/hooks/category/useCategory";
import useSpecialCategory from "@/redux/hooks/category/useSpecialCategory";
import useBrand from "@/redux/hooks/brand/useBrand";
import { SpecialCategory } from "@/constants/config";
import useAppBanner from "@/redux/hooks/app-banner/useAppBanner";

const male: number = require("../../assets/images/user.png");
const female: number = require("../../assets/images/userFemale.png");

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { isAuthenticated } = useAuth();
  const { profileDetail, handleLoadOrderProfile } = useUser();
  const { banners, handleLoadBannerList } = useAppBanner();
  const {
    categories,
    loading: categoryLoading,
    handleLoadCategory,
  } = useCategory();
  const {
    specialCategories,
    loading: specialCategoryLoading,
    handleLoadSpecialCategory,
  } = useSpecialCategory();
  const { brands, loading: brandLoading, handleLoadBrandList } = useBrand();
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      handleLoadOrderProfile(),
      handleLoadBannerList(),
      handleLoadCategory(),
      handleLoadSpecialCategory(),
      handleLoadBrandList(),
    ]).finally(() => setRefreshing(false));
  }, [
    handleLoadOrderProfile,
    handleLoadBannerList,
    handleLoadCategory,
    handleLoadSpecialCategory,
    handleLoadBrandList,
  ]);

  // memoized header
  const HeaderComponent = useMemo(() => {
    return (
      <>
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <View style={styles.row}>
            <Image
              source={
                profileDetail?.data?.user_data?.gender == "male" ? male : female
              }
              style={styles.avatar}
            />
            <View style={styles.center}>
              {isAuthenticated ? (
                <>
                  <Text style={styles.name}>{profileDetail?.data?.name}</Text>
                  <Text style={styles.address}>
                    {profileDetail?.data?.phone}
                  </Text>
                </>
              ) : (
                <Link style={styles.name} href="/login">
                  Login
                </Link>
              )}
            </View>
            <TouchableOpacity
              onPress={() => router.replace("/notifications")}
              style={styles.notificationButton}
            >
              <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
                <Defs>
                  <ClipPath id="clip0">
                    <Rect width={30} height={30} fill="white" />
                  </ClipPath>
                </Defs>
                <G clipPath="url(#clip0)">
                  <Path
                    d="M15 5.625C15 5.275 14.725 5 14.375 5C14.025 5 13.75 5.275 13.75 5.625V7.5375C10.9375 7.85 8.75 10.225 8.75 13.125V20.5125L6.7625 22.5H21.9875L20 20.5125V13.125C20 10.225 17.8125 7.85 15 7.5375V5.625ZM14.375 3.75C15.4125 3.75 16.25 4.5875 16.25 5.625V6.5125C19.1375 7.325 21.25 10 21.25 13.125V20L25 23.75H3.75L7.5 20V13.125C7.5 10 9.6125 7.325 12.5 6.5125V5.625C12.5 4.5875 13.3375 3.75 14.375 3.75ZM14.375 27.5C12.8625 27.5 11.6 26.425 11.3125 25H12.6125C12.8625 25.725 13.5625 26.25 14.375 26.25C15.1875 26.25 15.8875 25.725 16.1375 25H17.4375C17.15 26.425 15.8875 27.5 14.375 27.5Z"
                    fill="black"
                  />
                </G>
              </Svg>
              {profileDetail?.data?.noti_stats?.total_unread ? (
                <View style={styles?.iconCount}>
                  <Text style={styles?.iconCountText} allowFontScaling={false}>
                    {profileDetail?.data?.noti_stats?.total_unread}
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ImageCarousel banners={banners} />

        <View style={styles.discover}>
          <View style={styles.discoverHead}>
            <Text style={styles.discoverName}>Discover</Text>
            <Text style={styles.discoverText}>
              Essential Medicines & Health Solutions
            </Text>
          </View>
          <View style={styles.discoverCarousel}>
            <DiscoverCarousel
              categories={categories}
              loading={categoryLoading}
            />
          </View>
        </View>
      </>
    );
  }, [
    isAuthenticated,
    profileDetail,
    router,
    banners,
    categories,
    categoryLoading,
  ]);

  // memoized footer
  const FooterComponent = useMemo(() => {
    return (
      <View style={styles.productSliderSection}>
        <View style={styles.productSliderHead}>
          <Text style={styles.productSliderName}>Top Brands</Text>
        </View>
        <View style={styles.brandList}>
          <BrandList brands={brands} loading={brandLoading} />
        </View>
      </View>
    );
  }, [brands, brandLoading]);

  // render each special category
  const renderSpecialCategory = useCallback(
    ({ item }: ListRenderItemInfo<SpecialCategory>) => (
      <View style={styles.productSliderSection} key={item.id}>
        <View style={styles.productSliderHead}>
          <Text style={styles.productSliderName}>{item.name}</Text>
          <Link href={`/productListByCategory?id=${item.id}&name=${item.name}`}>
            <Text style={styles.productSliderSeeAll}>See All</Text>
          </Link>
        </View>
        <View style={styles.productSliderCarousel}>
          <ProductSlider
            products={item.products}
            loading={specialCategoryLoading}
          />
        </View>
      </View>
    ),
    [specialCategoryLoading]
  );

  const keyExtractor = useCallback(
    (spc: SpecialCategory) => spc.id.toString(),
    []
  );

  return (
    <>
      <HeadLine />

      <FlatList<SpecialCategory>
        data={specialCategories}
        style={{ flex: 1, backgroundColor: "#fff" }}
        keyExtractor={keyExtractor}
        renderItem={renderSpecialCategory}
        ListHeaderComponent={HeaderComponent}
        ListFooterComponent={FooterComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 120,
    backgroundColor: "#fff",
  },

  // ————— HEAD SECTION —————
  banner: {
    minHeight: 200,
    justifyContent: "flex-start",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 15,
  },
  row: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 20,
  },
  center: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "Saira-Medium",
  },
  address: {
    fontSize: 12,
    color: "#FFFFFFCC",
    fontFamily: "Saira-Regular",
  },
  notificationButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#FFFFFFB2",
  },
  iconCount: {
    position: "absolute",
    backgroundColor: "#ff0000",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCountText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#fff",
    fontFamily: "Saira-Medium",
  },

  // ————— DISCOVER —————
  discover: { marginTop: 30 },
  discoverHead: { paddingHorizontal: 18 },
  discoverName: {
    fontSize: 26,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  discoverText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Saira-Regular",
  },
  discoverCarousel: {
    marginTop: 15,
    width: "100%",
    paddingLeft: 18,
  },

  // ————— PRODUCT SLIDERS —————
  productSliderSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  productSliderHead: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  productSliderName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Saira-Bold",
  },
  productSliderSeeAll: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  productSliderCarousel: {
    marginTop: 15,
    width: "100%",
    paddingLeft: 18,
  },

  // ————— BRANDS —————
  brandList: {
    marginTop: 15,
    width: "100%",
    marginBottom: Platform.select({ ios: 50, android: 10 }),
  },
});
