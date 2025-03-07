import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // For Expo projects
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import ImageCarousel, {
  ImageCarouselItem,
} from "@/components/Home/ImageCarousel"; // adjust path if needed
import DiscoverCarousel, {
  DiscoverCarouselItem,
} from "@/components/Home/DiscoverCarousel"; // adjust path if needed
import ProductSlider, {
  ProductSliderItem,
} from "@/components/ui/ProductSlider";
import BrandList from "@/components/Home/BrandList";

export default function HomeScreen() {
  const carouselData: ImageCarouselItem[] = [
    {
      id: "1",
      image:
        "https://s3-alpha-sig.figma.com/img/5701/eaa6/7957e114a49c57d80fb2842e5294598f?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uCXV1lt8BkxI3kok5PTNYzR07nkerlFJcZTm71PkG75NzQhl1mpeySTcLraSfLgOKzaeScBEohu3wOwKHhvBhGNf0gKAZ~9wZC0gsM5gNM3WeKzsiIKbAndy7g71gXXS6ErdYnbT4XaJ-cc5fT5MEoCbOpSBOmxdHVD7bi5MlzWZiHyB7o7~GaAuHM-ooxikOEwsK-qBbJSM8KtlhOeaSoIHWptY~modV~cJFH9vVs006xHh8qoBm5Xk0moJSHzQ9nU2RaG-N4PhkFk-Qj0mrINTBukxWO6u2WsEa134XHu7twzIDeudWxNgiiDDzQkesEN-NpqOzK-omfe6u5XMQw__",
      bgContain: true,
    },
    {
      id: "2",
      image:
        "https://s3-alpha-sig.figma.com/img/5701/eaa6/7957e114a49c57d80fb2842e5294598f?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uCXV1lt8BkxI3kok5PTNYzR07nkerlFJcZTm71PkG75NzQhl1mpeySTcLraSfLgOKzaeScBEohu3wOwKHhvBhGNf0gKAZ~9wZC0gsM5gNM3WeKzsiIKbAndy7g71gXXS6ErdYnbT4XaJ-cc5fT5MEoCbOpSBOmxdHVD7bi5MlzWZiHyB7o7~GaAuHM-ooxikOEwsK-qBbJSM8KtlhOeaSoIHWptY~modV~cJFH9vVs006xHh8qoBm5Xk0moJSHzQ9nU2RaG-N4PhkFk-Qj0mrINTBukxWO6u2WsEa134XHu7twzIDeudWxNgiiDDzQkesEN-NpqOzK-omfe6u5XMQw__",
      bgContain: true,
    },
    {
      id: "3",
      image:
        "https://s3-alpha-sig.figma.com/img/5701/eaa6/7957e114a49c57d80fb2842e5294598f?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uCXV1lt8BkxI3kok5PTNYzR07nkerlFJcZTm71PkG75NzQhl1mpeySTcLraSfLgOKzaeScBEohu3wOwKHhvBhGNf0gKAZ~9wZC0gsM5gNM3WeKzsiIKbAndy7g71gXXS6ErdYnbT4XaJ-cc5fT5MEoCbOpSBOmxdHVD7bi5MlzWZiHyB7o7~GaAuHM-ooxikOEwsK-qBbJSM8KtlhOeaSoIHWptY~modV~cJFH9vVs006xHh8qoBm5Xk0moJSHzQ9nU2RaG-N4PhkFk-Qj0mrINTBukxWO6u2WsEa134XHu7twzIDeudWxNgiiDDzQkesEN-NpqOzK-omfe6u5XMQw__",
      bgContain: true,
    },
  ];

  const discoverCarouselData: DiscoverCarouselItem[] = [
    { id: "1", title: "Pain Relief & Fever", target: "Page1" },
    { id: "2", title: "Cough & Flu", target: "Page2" },
    { id: "3", title: "Digestive Health", target: "Page3" },
    { id: "4", title: "Eye & Ear Care", target: "Page4" },
    { id: "5", title: "Pain Relief & Fever", target: "Page5" },
  ];

  const productSliderProps: ProductSliderItem[] = [
    {
      id: "1",
      image:
        "https://s3-alpha-sig.figma.com/img/5be1/4f4b/520092b46167e350401d6bc0b8f7127d?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Wyu508NoF3xgsGlpxkItXp086c90EIzposfiPaJhZICac1Lxaq6t0HivmO4aRQrIjGI6ufEaO8Gt4zSZ2rOuiz55a1l~FX9Rl1FZ8IkF29osyeNNQlHHHT7h9lM2AiO6FBQDWQViA40Tn-hIIUzkYAn6UNwdh94qdQkEEXoA65YSzINKPw4T3Vh6HrloydmhRL-LXAU7jtpc5xufe1bJzKtkb0x2gK3txInFCQYr4FZj1MdefnHs-BevSwFZWqn7tYm~rCNUWsGcpPMPdI-9yCEAK68gweM13Ld6MvpNDKjyKDl9BwhrocjCMLmfdAd78hwj1Ti35NPy8VHY50gUIg__",
      name: "Pain Relief & Fever",
      price: 100,
    },
    {
      id: "2",
      image:
        "https://s3-alpha-sig.figma.com/img/03e3/44fb/af1264ea5d44ac450658c44fed356a66?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MHJCVyB9JYnnbJSZN6uK788~ss49Je47xadcR7HrzSO9Oso7Xd-As0zRYeJZrd3BTfcpbRDhD8En4DObr18yCdYHKzWCwggkSPeyX0odX-Vf~BKDAFJZWv3xPkwPxmbbXNWfUYhxN3IIPO9S5-tbOP2C6oso81XeHmYebXefhBb7g8XZtwrpR4BL1zAOmnIuMTOngRnElQXXJODXnMBgSAgu3u9yfITNHToZaYUjAmQh3r-ZBUfOTiy8fAKZZOcjKI09MtENo-RLDorCYmC589yWkiG7U9hgdCC3v~uEG-Ft7D3DvonsEe-8SUKvG7Gp7s6-X263Ic7anoOcWwO5uw__",
      name: "Cough & Flu",
      price: 2000,
    },
    {
      id: "3",
      image:
        "https://s3-alpha-sig.figma.com/img/4e4c/c9da/0a2bdaf4fbf209160018419537e1bea2?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qtgPwONMhFLmIbJAfWwd3MMZ6Hg4VPVQuwKXKiQ~tiQ6ei3oZkf8q4WNtQzWDrt0U3wZb6d4srtPN3vqFY8TAwpueYyIpQAdBCrSh3-KETTca-UNJf1-j4pXvB3qijKG7uEJwOD-5CR9rBn8k5L19F7R1-EHheAxKoyqhmltE-WA-RvvFmoGTyicRQa3R5mgQHqaEvGs7zJ~8oU9JWNptbtCe-fT7g0IU5eHntK37ymRYQU6ens~rCSh-CYVYQiyVWah8M3nIsR8uerdJuKlhIABEiSgcXzsXv0~8LBqfVgWwgIqROUUueszUaCjAf7nndPsM65bF8Hqj86ivdZjEA__",
      name: "Digestive Health",
      price: 300,
    },
    {
      id: "4",
      image:
        "https://s3-alpha-sig.figma.com/img/136f/09b6/e422345889b653ecd0ad8351ba3b74e4?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pVbzxdtef18k6QX1JcXAUpI-00L2oQUu8~Ga1LADzxtemGUjJsDD4G042IQdxLT9FQ9OMYirRE09~-Camh33heEvcnhMhFKG01LgJxcXAl1o-s9DWg73t0L2nsokGRs9YlLLQfLJ95JpPbiwgUjKoBrRqEy9SGjGlrAhovY37lXEqajJJvEbBWgs9ffhLqpON~Gj5Ht~-bWyXV6IoZqo2uqAZPM64M3vVxawUAC1Twse8CVngrwPrBlJLHAjH9TKL9bqITZl8SkwHJ72Pts-szKW9B12VRipklt8s5JWONxOWhD0OKyb719pOTbmG~m~jv109Y1rikqyMawLT1PmfA__",
      name: "Eye & Ear Care",
      price: 400,
    },
    {
      id: "5",
      image:
        "https://s3-alpha-sig.figma.com/img/a5e8/9d24/2d4faae0ef56cf33478b32a955a5d636?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=acwexTlKx3OzSEbUngACWZz3BUpFbA2XXqqd4Is-tiZBb8v86m7~UbcIC0oitt7jiBguPu3hOvGMHYiJGjJBPmWZsbX7P9L2sGknEhExC~R3jGGMeQvdwFsGKmqYi4OM-YMItYh2VWfPoY0e9sjvKBU~aDSZ~UNwKVyfFMPIkO6vRq~vdnoSsqLFflGmw25hrh2-mVPBCp4mJWgxckn1rvaWEypqoX5uMRsJcfQdMpexSe312a7fzLJM0Y~EWXJeLK30KMML-7qtk4dc9PwYf2ItID3ZJtn4Ujsoru-0z4QmPQq9Lu6Ck0Ll36yFdLGRfNMUr5J8wYxjUD3etW7UzQ__",
      name: "Pain Relief & Fever",
      price: 500,
    },
  ];

  return (
    <>
      <LinearGradient
        colors={["#53CAFE", "#2555E7"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={styles.headLine}
      ></LinearGradient>
      <ScrollView style={styles.container}>
        {/* Head Section Start */}
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <View style={styles.row}>
            <Image
              source={{
                uri: "https://s3-alpha-sig.figma.com/img/866d/ff79/56041d2614d60e18b56b870aaf94a1c4?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gqpc3MRztAouxFDWqP3tEZvDPEkZzNfvDqc687d5VX3LaBYQR2NOiZwVcLeTCKYU1RI5FrngvHLkcTAwokbclVMxqd-omle3yhOWX1OHwqNsQ6YQXquwsur1sRw1udKcREF5z3Si2OsFR13B9l1sNLV7H-b~UdIbvxAbB05ReqbgPnXzhnxUbEG5oXp9YdwVqeorFqOCm3pEe17gdVtVK1u8cX9gIF2xxghvVAEMvFht7p8EPGYh5p1sepvNQ6Ei6mf-k-s0sHpCnwrRDFAkOwJ8vkHZyFMHNQ09k02iVWWJedKd4pr9tuxbErdYr0Amjv9howSs1wGuTOejQEIWlw__",
              }}
              style={styles.avatar}
            />
            <View style={styles.center}>
              <Text style={styles.name}>Thant Zin</Text>
              <Text style={styles.address}>No. 123, 4th Cross, 5th Main</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
                <Defs>
                  <ClipPath id="clip0_68_292">
                    <Rect width={30} height={30} fill="white" />
                  </ClipPath>
                </Defs>
                <G clipPath="url(#clip0_68_292)">
                  <Path
                    d="M15 5.625C15 5.275 14.725 5 14.375 5C14.025 5 13.75 5.275 13.75 5.625V7.5375C10.9375 7.85 8.75 10.225 8.75 13.125V20.5125L6.7625 22.5H21.9875L20 20.5125V13.125C20 10.225 17.8125 7.85 15 7.5375V5.625ZM14.375 3.75C15.4125 3.75 16.25 4.5875 16.25 5.625V6.5125C19.1375 7.325 21.25 10 21.25 13.125V20L25 23.75H3.75L7.5 20V13.125C7.5 10 9.6125 7.325 12.5 6.5125V5.625C12.5 4.5875 13.3375 3.75 14.375 3.75ZM14.375 27.5C12.8625 27.5 11.6 26.425 11.3125 25H12.6125C12.8625 25.725 13.5625 26.25 14.375 26.25C15.1875 26.25 15.8875 25.725 16.1375 25H17.4375C17.15 26.425 15.8875 27.5 14.375 27.5Z"
                    fill="black"
                  />
                </G>
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Use the ImageCarousel component */}
          <ImageCarousel data={carouselData} />
        </LinearGradient>
        {/* Head Section End */}

        {/* Discover Section Start */}
        <View style={styles.discover}>
          <View style={styles.discoverHead}>
            <Text style={styles.discoverName}>Discover</Text>
            <Text style={styles.discoverText}>
              Essential Medicines & Health Solutions
            </Text>
          </View>
          <View style={styles.discoverCarousel}>
            <DiscoverCarousel data={discoverCarouselData} />
          </View>
        </View>
        {/* Discover Section End */}

        {/* Top Selling Section Start */}
        <View style={styles.productSliderSection}>
          <View style={styles.productSliderHead}>
            <Text style={styles.productSliderName}>Top Selling Items</Text>
            <TouchableOpacity>
              <Text style={styles.productSliderSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productSliderCarousel}>
            <ProductSlider data={productSliderProps} />
          </View>
        </View>
        {/* Top Selling Section End */}

        {/* New Arrivals Section Start */}
        <View style={styles.productSliderSection}>
          <View style={styles.productSliderHead}>
            <Text style={styles.productSliderName}>New Arrivals</Text>
            <TouchableOpacity>
              <Text style={styles.productSliderSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productSliderCarousel}>
            <ProductSlider data={productSliderProps} />
          </View>
        </View>
        {/* New Arrivals Section End */}

        {/* Top Picks for You Section Start */}
        <View style={styles.productSliderSection}>
          <View style={styles.productSliderHead}>
            <Text style={styles.productSliderName}>Top Picks for You</Text>
            <TouchableOpacity>
              <Text style={styles.productSliderSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productSliderCarousel}>
            <ProductSlider data={productSliderProps} />
          </View>
        </View>
        {/* Top Picks for You Section End */}

        {/* Top Brands Section Start */}
        <View style={styles.productSliderSection}>
          <View style={styles.productSliderHead}>
            <Text style={styles.productSliderName}>Top Brands</Text>
          </View>
          <View style={styles.productSliderCarousel}>
            <BrandList data={productSliderProps} />
          </View>
        </View>
        {/* Top Brands Section End */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Head Section
  headLine: {
    height: 40,
    position: "fixed",
    top: 0,
    zIndex: 100,
    marginBottom: -40,
  },
  banner: {
    minHeight: 220,
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  carouselContainer: {
    borderRadius: 30,
    width: "100%",
    aspectRatio: "2/1",
    alignSelf: "center",
    overflow: "hidden",
    marginTop: 30,
    marginBottom: -150,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // Head Section

  // Discover Section
  discover: {
    marginTop: 80,
  },
  discoverHead: {
    paddingHorizontal: 18,
  },
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
  // Discover Section

  // Product Slider Sections
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
  // Product Slider Sections
});
