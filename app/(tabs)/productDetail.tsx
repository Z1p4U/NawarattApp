import ExpandableDescription from "@/components/ProductDetail/ExpandableDescription";
import QuantityConfirmModal from "@/components/ProductDetail/QuantityConfirmModal";
import HeadLine from "@/components/ui/HeadLine";
import QuantityControl from "@/components/ui/QuantityControl";
import useProductDetail from "@/redux/hooks/product/useProductDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Svg, { Path } from "react-native-svg";

export default function ProductDetail() {
  const { width } = Dimensions.get("window");
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("id")) || 0;
  const router = useRouter();
  const { productDetail } = useProductDetail(productId);

  const [modalVisible, setModalVisible] = useState(false);
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

  const addedInWishlist = true;

  const updateQuantity = (newCount: number) => {
    setPayload((prev) => ({
      ...prev,
      count: newCount,
      total: newCount * Number(productDetail?.price || 0),
    }));
  };

  const handleConfirm = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      const cart = cartData ? JSON.parse(cartData) : [];

      const updatedPayload = {
        productId,
        count: payload.count,
        total: payload.count * Number(productDetail?.price || 0),
        option: payload.option,
        pdData: {
          name: productDetail?.name,
          category: productDetail?.category?.name,
          thumbnail: productDetail?.thumbnail,
          price: productDetail?.price,
        },
      };

      cart.push(updatedPayload);

      await AsyncStorage.setItem("cart", JSON.stringify(cart));

      // Reset modal and payload state
      setModalVisible(false);
      setPayload((prev) => ({
        ...prev,
        count: 1,
        total: Number(productDetail?.price || 0),
        option: "Order မှဖယ်ရှားပေးပါ",
      }));

      router.push("/cart");
    } catch (error) {
      console.error("Error saving to cart:", error);
    }
  };

  const renderItem = ({ item }: any) => {
    const imageSource =
      typeof item === "string" && item.startsWith("http")
        ? { uri: item }
        : require("@/assets/images/placeholder.jpg");

    return <Image source={imageSource} style={styles?.carouselImage} />;
  };

  const imageData =
    Array.isArray(productDetail?.images) && productDetail?.images.length > 0
      ? productDetail.images
      : [require("@/assets/images/placeholder.jpg")]; // Fallback image

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
            <Text style={styles.productNameText}>{productDetail?.name}</Text>
            <TouchableOpacity style={styles.favButton}>
              <Svg width={20} height={20} viewBox="0 0 22 20" fill="none">
                <Path
                  d="M16.087.25C13.873.25 11.961 1.547 11 3.438 10.04 1.547 8.127.25 5.913.25 2.738.25.167 2.912.167 6.188s1.968 6.279 4.512 8.746C7.222 17.4 11 19.75 11 19.75s3.655-2.31 6.321-4.816c2.844-2.672 4.512-5.46 4.512-8.746 0-3.286-2.571-5.938-5.746-5.938z"
                  fill={addedInWishlist ? "#FF4B84" : "#000"}
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <Text style={styles.productPriceText}>
            {productDetail?.price
              ? productDetail.price.toLocaleString()
              : "N/A"}{" "}
            Ks
          </Text>

          <View style={styles.row}>
            <Text style={styles.productCategoryText}>Category : </Text>
            <Text style={styles.productCategoryActiveText}>
              {productDetail?.brand?.name}
            </Text>
          </View>

          <View style={styles.row}>
            <Image
              source={
                productDetail?.brand?.image
                  ? { uri: productDetail.brand.image }
                  : require("@/assets/images/placeholder.jpg")
              }
              style={styles.shopImg}
            />

            <Text style={styles.productCategoryText}>
              {productDetail?.brand?.name}
            </Text>
          </View>

          {/* ExpandableDescription */}
          <ExpandableDescription description={productDetail?.description} />
          {/* ExpandableDescription */}

          <View style={styles.rowBetween}>
            {/* QuantityControl */}
            <QuantityControl count={payload?.count} setCount={updateQuantity} />
            {/* QuantityControl */}

            <Text style={styles.totalText}>
              Total :{" "}
              {(
                payload?.count * Number(productDetail?.price || 0)
              ).toLocaleString()}{" "}
              Ks
            </Text>
          </View>

          <TouchableOpacity
            style={{ marginTop: 30 }}
            onPress={() => {
              console.log("Modal Visible:", modalVisible); // Check if this is updating
              setModalVisible(true);
            }}
          >
            <LinearGradient
              colors={["#54CAFF", "#275AE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.chat}
            >
              <Text style={styles.chatText}>Add To Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* QuantityConfirmModal */}
        <SafeAreaView style={{ flex: 1 }}>
          <QuantityConfirmModal
            modalVisible={modalVisible}
            selectedOption={payload?.option}
            onSelect={(option) => setPayload((prev) => ({ ...prev, option }))}
            onConfirm={handleConfirm}
            onClose={() => setModalVisible(false)}
          />
        </SafeAreaView>
        {/* QuantityConfirmModal */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    position: "relative",
  },
  rowBetween: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    color: "#000000",
    fontFamily: "Saira-Regular",
  },
  productPriceText: {
    fontSize: 20,
    color: "#000000",
    fontFamily: "Saira-Medium",
  },
  productCategoryText: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "Saira-Regular",
    marginLeft: 15,
  },
  productCategoryActiveText: {
    fontSize: 14,
    color: "#275AE8",
    fontFamily: "Saira-Regular",
  },
  shopImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
    boxShadow: "0px 0px 1px #00000060",
  },
  totalText: {
    fontSize: 16,
    color: "#00000080",
    fontFamily: "Saira-Medium",
  },
  favButton: {
    width: 35,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#F2F3F4",
  },
  chat: {
    borderRadius: 18,
    display: "flex",
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
});
