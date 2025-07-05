import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

import ExpandableDescription from "@/components/ProductDetail/ExpandableDescription";
import QuantityConfirmModal from "@/components/ProductDetail/QuantityConfirmModal";
import HeadLine from "@/components/ui/HeadLine";
import QuantityControl from "@/components/ui/QuantityControl";

import useAuth from "@/redux/hooks/auth/useAuth";
import useProductDetail from "@/redux/hooks/product/useProductDetail";
import useWishlist from "@/redux/hooks/wishlist/useWishlist";
import useWishlistProcess from "@/redux/hooks/wishlist/useWishlistProcess";

export default function ProductDetail() {
  const { width } = Dimensions.get("window");
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("id")) || 0;
  const router = useRouter();

  const {
    productDetail,
    relatedProducts,
    loading: detailLoading,
  } = useProductDetail(productId);
  const { toggleWishlist } = useWishlistProcess();
  const { isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [payload, setPayload] = useState({
    productId,
    count: 1,
    total: Number(productDetail?.price || 0),
    option: "Order မှဖယ်ရှားပေးပါ",
    pdData: {
      name: productDetail?.name,
      price: productDetail?.price,
      category: productDetail?.category?.name,
      thumbnail: productDetail?.thumbnail,
    },
  });

  useEffect(() => {
    if (!productDetail) return;
    setPayload({
      productId,
      count: 1,
      total: Number(productDetail?.price),
      option: "Order မှဖယ်ရှားပေးပါ",
      pdData: {
        name: productDetail?.name,
        price: Number(productDetail?.price),
        category: productDetail?.category?.name,
        thumbnail: productDetail?.thumbnail,
      },
    });
  }, [productDetail, productId]);

  useEffect(() => {
    const checkCart = async () => {
      const cartData = await AsyncStorage.getItem("cart");
      const cart = cartData ? JSON.parse(cartData) : [];
      setAlreadyInCart(cart.some((item: any) => item.productId === productId));
    };
    checkCart();
  }, [productId]);

  const addedInWishlist = isInWishlist(productId);

  // enforce limited_qty_per_customer here
  const updateQuantity = (requestedCount: number) => {
    const max = productDetail?.limited_qty_per_customer ?? Infinity;
    let newCount = requestedCount;
    if (newCount > max) {
      Alert.alert(
        "Quantity Limit",
        `You can only order up to ${max} of this item.`
      );
      newCount = max;
    }
    setPayload((prev) => ({
      ...prev,
      count: newCount,
      total: newCount * Number(productDetail?.price || 0),
    }));
  };

  const handleConfirm = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      const cart: Array<any> = cartData ? JSON.parse(cartData) : [];

      const incomingCount = payload.count;
      const incomingOption = payload.option;
      const price = Number(productDetail?.price || 0);

      const idx = cart.findIndex((item) => item.productId === productId);
      if (idx !== -1) {
        const existing = cart[idx];
        const newCount = existing.count + incomingCount;
        cart[idx] = {
          ...existing,
          count: newCount,
          total: newCount * price,
          option: incomingOption,
        };
      } else {
        cart.push({
          productId,
          count: incomingCount,
          total: incomingCount * price,
          option: incomingOption,
          pdData: payload.pdData,
        });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      setModalVisible(false);
      setPayload((prev) => ({
        ...prev,
        count: 1,
        total: price,
        option: "Order မှဖယ်ရှားပေးပါ",
      }));
      setAlreadyInCart(true);
      router.push("/cart");
    } catch (error) {
      console.error("Error saving to cart:", error);
    }
  };

  const imageData: { uri: string }[] = productDetail?.images?.length
    ? productDetail.images.map((img: any) => ({ uri: img.url }))
    : [{ uri: "" }];

  const renderItem = ({ item }: { item: { uri: string } }) => (
    <ImageBackground
      source={require("@/assets/images/placeholder.png")}
      style={styles.carouselImage}
      imageStyle={styles.imageStyle}
    >
      <Image
        source={item.uri ? item : require("@/assets/images/placeholder.png")}
        style={[styles.carouselImage, styles.imageStyle]}
      />
    </ImageBackground>
  );

  const hasDiscount = productDetail?.discount_price != null;

  if (detailLoading) {
    return (
      <>
        <HeadLine />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </>
    );
  }

  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <Carousel
          loop
          width={width}
          height={width}
          data={imageData}
          renderItem={renderItem}
          autoPlay
          autoPlayInterval={5000}
        />

        <View style={styles.productDetailInfoContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.productNameText} allowFontScaling={false}>
              {productDetail?.name}
            </Text>
            {isAuthenticated && (
              <TouchableOpacity
                style={styles.favButton}
                onPress={() => toggleWishlist(productId)}
              >
                <Svg width={20} height={20} viewBox="0 0 22 20" fill="none">
                  <Path
                    d="M16.087.25C13.873.25 11.961 1.547 11 3.438 10.04 1.547 8.127.25 5.913.25C2.738.25.167 2.912.167 6.188s1.968 6.279 4.512 8.746C7.222 17.4 11 19.75 11 19.75s3.655-2.31 6.321-4.816c2.844-2.672 4.512-5.46 4.512-8.746 0-3.286-2.571-5.938-5.746-5.938z"
                    fill={addedInWishlist ? "#FF4B84" : "#000"}
                  />
                </Svg>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Text
                style={[styles.productPriceText, styles.originalPrice]}
                allowFontScaling={false}
              >
                {Number(productDetail.price).toLocaleString()} Ks
              </Text>
            )}

            <Text
              style={[
                styles.productPriceText,
                hasDiscount && styles.discountPrice,
              ]}
              allowFontScaling={false}
            >
              {Number(
                hasDiscount
                  ? productDetail?.discount_price!
                  : productDetail?.price
              ).toLocaleString()}{" "}
              Ks
            </Text>
          </View>

          <View style={styles.row}>
            {productDetail?.category && (
              <>
                <Text
                  style={styles.productCategoryText}
                  allowFontScaling={false}
                >
                  Category :{" "}
                </Text>
                <Link
                  style={styles.productCategoryActiveText}
                  allowFontScaling={false}
                  href={`/productListByCategory?id=${productDetail.category?.id}&name=${productDetail.category?.name}`}
                >
                  {productDetail.category.name}
                </Link>
              </>
            )}
          </View>

          <View style={styles.row}>
            {productDetail?.brand && (
              <ImageBackground
                source={require("@/assets/images/placeholder.png")}
                style={styles.shopImg}
                imageStyle={styles.imageStyle}
              >
                <Image
                  source={
                    productDetail.brand.image
                      ? { uri: productDetail.brand.image }
                      : require("@/assets/images/placeholder.png")
                  }
                  style={[styles.shopImg, styles.imageStyle]}
                />
              </ImageBackground>
            )}
            {productDetail?.brand && (
              <Link
                href={`/productListByBrand?id=${productDetail.brand.id}&name=${productDetail.brand.name}`}
                style={styles.brandName}
                allowFontScaling={false}
              >
                {productDetail.brand.name}
              </Link>
            )}
          </View>

          {productDetail?.type === "combo" &&
            (productDetail.combo_items ?? []).length > 0 && (
              <View style={styles.comboContainer}>
                <Text style={styles.comboTitle} allowFontScaling={false}>
                  Combo Items
                </Text>
                <View style={styles.comboRelatedContainer}>
                  {productDetail?.combo_items?.map((ci) =>
                    ci.product ? (
                      <View key={ci.id} style={styles.comboItemRow}>
                        <ImageBackground
                          source={require("@/assets/images/placeholder.png")}
                          style={styles.comboItemImage}
                          imageStyle={styles.imageStyle}
                        >
                          <Image
                            source={{ uri: ci.product.thumbnail }}
                            style={[styles.comboItemImage, styles.imageStyle]}
                          />
                        </ImageBackground>
                        <Text
                          style={styles.comboItemText}
                          allowFontScaling={false}
                        >
                          {ci.product.name} × {ci.qty}
                        </Text>
                      </View>
                    ) : null
                  )}
                </View>
              </View>
            )}

          {(relatedProducts ?? []).length > 0 && (
            <View style={styles.comboContainer}>
              <Text style={styles.comboTitle} allowFontScaling={false}>
                Related Products
              </Text>
              <View style={styles.comboRelatedContainer}>
                {relatedProducts?.map((product) =>
                  product ? (
                    <View key={product.id} style={styles.comboItemRow}>
                      <ImageBackground
                        source={require("@/assets/images/placeholder.png")}
                        style={styles.comboItemImage}
                        imageStyle={styles.imageStyle}
                      >
                        <Image
                          source={{ uri: product?.thumbnail }}
                          style={[styles.comboItemImage, styles.imageStyle]}
                        />
                      </ImageBackground>
                      <Text
                        style={styles.comboItemText}
                        allowFontScaling={false}
                      >
                        {product?.name}
                      </Text>
                    </View>
                  ) : null
                )}
              </View>
            </View>
          )}

          <ExpandableDescription description={productDetail?.description} />

          <View style={styles.rowBetween}>
            <QuantityControl count={payload.count} setCount={updateQuantity} />
            <Text style={styles.totalText} allowFontScaling={false}>
              Total:{" "}
              {(
                payload.count * Number(productDetail?.price || 0)
              ).toLocaleString()}{" "}
              Ks
            </Text>
          </View>

          <TouchableOpacity
            style={{ marginTop: 30 }}
            onPress={() => setModalVisible(true)}
          >
            <LinearGradient
              colors={["#54CAFF", "#275AE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chat}
            >
              <Text style={styles.chatText} allowFontScaling={false}>
                {alreadyInCart ? "Add More" : "Add to cart"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <SafeAreaView style={{ flex: 1 }}>
          <QuantityConfirmModal
            modalVisible={modalVisible}
            selectedOption={payload.option}
            onSelect={(option) => setPayload((prev) => ({ ...prev, option }))}
            onConfirm={handleConfirm}
            onClose={() => setModalVisible(false)}
          />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#fff",
    position: "relative",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageStyle: {
    // borderRadius: 20,
    // borderWidth: 1,
    // borderColor: "#0000001A",
  },
  productDetailInfoContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    marginTop: -50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 10,
  },
  productNameText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Saira-Regular",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productPriceText: {
    fontSize: 24,
    fontFamily: "Saira-Medium",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#888888",
    fontSize: 14,
    marginRight: 6,
  },
  discountPrice: {
    color: "#D32F2F",
    fontSize: 24,
  },
  productCategoryText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Saira-Regular",
  },
  productCategoryActiveText: {
    fontSize: 14,
    color: "#275AE8",
    fontFamily: "Saira-Regular",
  },
  brandName: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Saira-Regular",
    marginLeft: 15,
  },
  shopImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  totalText: {
    fontSize: 16,
    color: "#00000080",
    fontFamily: "Saira-Medium",
  },
  favButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#F2F3F4",
  },
  chat: {
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chatText: {
    width: "100%",
    height: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  comboContainer: {
    gap: 15,
  },
  comboTitle: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Bold",
    color: "#3173ED",
    marginTop: 10,
  },
  comboRelatedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  comboItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 15,
    backgroundColor: "#0000000D",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  comboItemImage: {
    width: 25,
    height: 25,
    borderRadius: 5,
    resizeMode: "cover",
  },
  comboItemText: { fontSize: 12, color: "#333", flexShrink: 1 },
});
