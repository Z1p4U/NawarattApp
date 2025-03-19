import ExpandableDescription from "@/components/ProductDetail/ExpandableDescription";
import HeadLine from "@/components/ui/HeadLine";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import {
  Dimensions,
  Image,
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
  const productId = searchParams.get("id");

  // Mock Data (In real case, fetch using productId)
  const data = {
    id: 1,
    images: [
      "https://s3-alpha-sig.figma.com/img/babc/b836/3b4fbd2ac384f3c5c117246d04670b03?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=kzIANlbrcW8l0na95HSPPzmVAGw0mD8AnzuvUYUV56jsTTkyxTqK4gXMAFR30YmFShibvRgOD86JdyPjPi9LVG6nwFKuk~~XsJcW1fjqjzMmNRFzV5tOo3wiAaJXdoaQqA4~C8ghF-5qesmww2X9T2Pd~9AlFD4Va5zq48ep2-~clL22ULdpT2K6I4~RD9mQjbfg7J7iO8lgN9f0X1TUTqoIrByM2xKRqRQXYoQkf0X76WezF80qwe8dNOEHAWS0M0DJSvg1aIBUxAcXfZeQfxRTMowXYmIFNU0B8mXnWH3RQFHd6maJ-pC7B0qehoLcCeEx452fdUt64gPoyCfZaA__",
    ],
    name: "Wireless Headphones",
    price: 1299.99,
    category: ["Electronics", "Audio"],
    description:
      "Experience unmatched sound quality with these high-quality wireless headphones, engineered with advanced noise cancellation technology. Designed to block out distractions, they let you immerse yourself in crisp, clear audio whether you're commuting, working, or relaxing at home. The ergonomic design ensures long-lasting comfort for extended listening sessions, and the intuitive touch controls make managing your music and calls effortless. With deep bass, balanced mids, and pristine highs, these headphones deliver a rich audio experience. Plus, with a long-lasting battery, you can enjoy up to 30 hours of uninterrupted playback on a single charge. Discover the perfect blend of style, performance, and convenience.",
    shop: {
      name: "Tech Haven",
      logo: "https://s3-alpha-sig.figma.com/img/6449/997c/91743c8a9bbbc66e72808fa57daf619a?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Vfr2zZFB75VpZFKvegQYSSz3oH5tGwIMWixlp7CkUrtcbp3O9KkON2JJ67KPmcVPEDPfMIw3hX5lnXyLI0E81Wp7f1kiSRmx-8tLN1S8amR7qY6SbyiT1W7gvPHkITc2~3JW~kifw-2zV0zhpbS~1l8Hm78rtP50l5Tk3TxCjEnEV18DGaAC92UhRmi5KpkOC0~Cmxjvl2xx0K7jJUDTDLDvaU5Ewp1gFy9K9Sp21krbhiWyooG5YqQ3XtHY14UYP0dcBz9DslGaXqaMni6NINw4HS7jxb~AD-mmZnhM4V6jGvLTJZvFjdXv7M18hB7q~SLtAWK3bUIO5rEvH3m4BA__",
    },
  };

  const addedInWishlist = true;

  const renderItem = ({ item }: any) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <Carousel
          loop
          width={width}
          height={300}
          data={data.images}
          renderItem={renderItem}
          autoPlay
          autoPlayInterval={5000}
        />

        <View style={styles.productDetailInfoContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.productNameText}>{data?.name}</Text>
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
            {data?.price?.toLocaleString()} Ks
          </Text>

          <View style={styles.row}>
            <Text style={styles.productCategoryText}>Category : </Text>
            {data?.category?.map((cat, index) => (
              <Text style={styles.productCategoryActiveText} key={index}>
                {cat}
                {index !== data.category.length - 1 ? " , " : ""}
              </Text>
            ))}
          </View>

          <View style={styles.row}>
            <Image source={{ uri: data?.shop?.logo }} style={styles.shopImg} />
            <Text style={styles.productCategoryText}> {data?.shop?.name}</Text>
          </View>

          <ExpandableDescription description={data.description} />

          <View style={styles.rowBetween}>
            <Image source={{ uri: data?.shop?.logo }} style={styles.shopImg} />
            <Text style={styles.totalText}>Total : {data?.price} Ks</Text>
          </View>

          <LinearGradient
            colors={["#54CAFF", "#275AE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chat}
          >
            <Link
              href={{
                pathname: "/cart",
              }}
              style={styles.chatText}
            >
              Add To Cart
            </Link>
          </LinearGradient>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: "#fff",
  },
  rowBetween: {
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
    paddingVertical: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  chatText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
