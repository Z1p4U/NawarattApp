import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

// const ImageCarousel: React.FC<lProps> = ({ data }) => {
const HeadSection = ({ data }: any) => {
  return (
    <>
      <LinearGradient
        colors={["#53CAFE", "#2555E7"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 0.0 }}
        style={styles.banner}
      >
        <Text style={styles.headText}>Profile</Text>
        <View style={styles.center}>
          <Image
            source={{
              uri: "https://s3-alpha-sig.figma.com/img/ab78/ba80/99f577a1233d4c10a9529f8a84c9c584?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=dJfu3wy4m7Bl84altipFK-W2ihxyShNYD91Hgi6pqLMpHsxntOqcnzN7triL74lqr8Z~OgNPq1eWzXyl4LeqaYYLkf6X86uHOGOw29JmXdKJ5xdph2U46JX5eZ6y9rZnmWEAWO9sgGwrTiQHyGUjEM14nygQFQ5ZeOT6TKYpeYFgSvwQCurixXJec~sK0GItTI3HSyUNWoi7M8sciz3jkU9im9j0VMzpO7h3omfwJcN-cW~Rd-rqvotmE1CbL0WE~wM1ktvU41ZPiheCnfqH14PRtskjClAblfsAzlBRDivrtVXO-9Qfmghf37lfs1y1ljvcBSwjBYJPxmIXHbqH6w__",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{data?.data?.name}</Text>
          <Text style={styles.phone}>{data?.data?.phone}</Text>
        </View>

        <View style={styles.amountBar}>
          <View style={styles.barBlock}>
            <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
              <Path
                d="M4.625 11.5c0-4.714 0-7.071 1.465-8.535C7.555 1.501 9.911 1.5 14.625 1.5H16.5c4.714 0 7.071 0 8.535 1.465C26.499 4.43 26.5 6.786 26.5 11.5v5c0 4.714 0 7.071-1.465 8.535C23.57 26.499 21.214 26.5 16.5 26.5h-1.875c-4.714 0-7.071 0-8.535-1.465-1.464-1.465-1.465-3.821-1.465-8.535v-5z"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.063 11.5v3.125a1.875 1.875 0 103.75 0V14a6.25 6.25 0 10-2.5 5M4.624 6.5H1.5M4.625 14H1.5m3.125 7.5H1.5M18.063 14a2.5 2.5 0 11-5.001 0 2.5 2.5 0 015 0z"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.barText}>Address Book</Text>
          </View>
          <Svg width={1} height={71} viewBox="0 0 1 71" fill="none">
            <Path stroke="#fff" d="M0.5 2.18557e-8L0.499997 71" />
          </Svg>
          <View style={styles.barBlock}>
            <Text style={styles.barNumber}>75</Text>
            <Text style={styles.barText}>Order in Total</Text>
          </View>
          <Svg width={1} height={71} viewBox="0 0 1 71" fill="none">
            <Path stroke="#fff" d="M0.5 2.18557e-8L0.499997 71" />
          </Svg>
          <View style={styles.barBlock}>
            <Text style={styles.barNumber}>126</Text>
            <Text style={styles.barText}>Wishlist</Text>
          </View>
        </View>

        <View style={styles.sideBtn}>
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
          <TouchableOpacity style={styles.notificationButton}>
            <Svg width={27} height={26} viewBox="0 0 27 26" fill="none">
              <Path
                d="M23.875 13.825a1.25 1.25 0 010-1.65l1.6-1.8a1.25 1.25 0 00.15-1.463l-2.5-4.325a1.25 1.25 0 00-1.337-.6l-2.35.475A1.25 1.25 0 0118 3.637l-.762-2.287A1.25 1.25 0 0016.05.5h-5a1.25 1.25 0 00-1.25.85l-.7 2.287a1.25 1.25 0 01-1.438.825L5.25 3.987a1.25 1.25 0 00-1.25.6L1.5 8.912a1.25 1.25 0 00.125 1.463l1.587 1.8a1.25 1.25 0 010 1.65l-1.587 1.8a1.25 1.25 0 00-.125 1.462L4 21.413a1.25 1.25 0 001.337.6l2.35-.476a1.25 1.25 0 011.438.826l.762 2.287a1.25 1.25 0 001.25.85h5a1.25 1.25 0 001.188-.85l.762-2.287a1.25 1.25 0 011.438-.825l2.35.474a1.25 1.25 0 001.337-.6l2.5-4.325a1.25 1.25 0 00-.15-1.462l-1.687-1.8zM22.012 15.5l1 1.125-1.6 2.775-1.474-.3a3.75 3.75 0 00-4.313 2.5L15.15 23h-3.2l-.45-1.425a3.75 3.75 0 00-4.313-2.5l-1.475.3-1.625-2.762 1-1.125a3.75 3.75 0 000-5l-1-1.126 1.6-2.75 1.475.3a3.75 3.75 0 004.313-2.5L11.95 3h3.2l.475 1.425a3.75 3.75 0 004.313 2.5l1.475-.3 1.6 2.775-1 1.125a3.75 3.75 0 000 4.975zM13.55 8a5 5 0 100 10 5 5 0 000-10zm0 7.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                fill="#000"
                stroke="#C1D4F9"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

export default HeadSection;

const styles = StyleSheet.create({
  banner: {
    height: 350,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 15,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 500,
    color: "#ffffff",
    fontFamily: "Saira-Medium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    gap: 7,
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
  },
  name: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 10000,
    color: "#FFFFFF",
    fontFamily: "Saira-Regular",
    backgroundColor: "#285CE8",
  },
  phone: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Saira-Regular",
  },
  amountBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    gap: 5,
  },
  barBlock: {
    gap: 5,
    alignItems: "center",
    width: 100,
    paddingHorizontal: 5,
    justifyContent: "flex-end",
  },
  barNumber: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Saira-Medium",
  },
  barText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Saira-Medium",
  },
  sideBtn: {
    gap: 10,
    position: "absolute",
    top: "10%",
    right: 15,
  },
  notificationButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 1000,
    backgroundColor: "#FFFFFFB2",
  },
});
