import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#CFCFCF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          ...styles.tabBar,
          ...Platform.select({
            ios: { position: "absolute" },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Svg width={24} height={28} viewBox="0 0 24 28" fill="none">
              <Defs>
                {focused && (
                  <SvgLinearGradient
                    id="paint0_linear_68_279"
                    x1="12"
                    y1="0"
                    x2="12"
                    y2="28"
                  >
                    <Stop stopColor="#52C5FE" />
                    <Stop offset="1" stopColor="#285CE8" />
                  </SvgLinearGradient>
                )}
              </Defs>
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.789919 9.30147C0.333252 10.2965 0.333252 11.4281 0.333252 13.6915V20.7581C0.333252 23.9031 0.333252 25.4748 1.30992 26.4498C2.19492 27.3365 3.57159 27.4165 6.16658 27.4248V19.0915C6.16658 18.2074 6.51778 17.3596 7.1429 16.7344C7.76802 16.1093 8.61586 15.7581 9.49992 15.7581H14.4999C15.384 15.7581 16.2318 16.1093 16.8569 16.7344C17.4821 17.3596 17.8333 18.2074 17.8333 19.0915V27.4248C20.4283 27.4165 21.8049 27.3348 22.6899 26.4481C23.6666 25.4715 23.6666 23.9015 23.6666 20.7581V13.6915C23.6666 11.4281 23.6666 10.2965 23.2099 9.30147C22.7516 8.30647 21.8933 7.57147 20.1749 6.09814L18.5083 4.66981C15.3999 2.00814 13.8499 0.674805 11.9999 0.674805C10.1499 0.674805 8.59825 2.00647 5.49159 4.66814L3.82492 6.09647C2.10825 7.56981 1.24825 8.3048 0.791585 9.2998M14.4999 27.4248V19.0915H9.49992V27.4248H14.4999Z"
                fill={focused ? "url(#paint0_linear_68_279)" : "#CFCFCF"}
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          tabBarIcon: ({ focused, color }) => (
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Defs>
                {focused && (
                  <SvgLinearGradient
                    id="iconGradient"
                    x1="12"
                    y1="0"
                    x2="12"
                    y2="24"
                  >
                    <Stop stopColor="#52C5FE" />
                    <Stop offset="1" stopColor="#285CE8" />
                  </SvgLinearGradient>
                )}
              </Defs>
              <Path
                d="M15.75 0.023L24 4.148v9.2l-1.5-.75V5.824l-6 3v3.024l-1.5.75V8.824l-6-3v2.66l-1.5-.75V4.148L15.75.023zM15.75 7.523l2.074-1.043-5.426-3.106-2.473 1.242 5.825 2.907zM19.441 5.684l2.133-1.066-5.824-2.918-1.746.879 5.437 3.105zM13.5 13.348l-1.5.75v-.012l-4.5 2.25v5.332l4.5-2.262v1.688l-5.25 2.625L0 20.332v-7.922l6.75-3.375 6.75 3.375v.938zM6 21.668v-5.332l-4.5-2.25v5.32L6 21.668zM6.75 15.035l4.324-2.156-4.324-2.168-4.324 2.168 4.324 2.156zM13.5 15.023l5.25-2.625 5.25 2.625v6.176l-5.25 2.625-5.25-2.625v-6.176zM18 21.773v-3.574l-3-1.5v3.574l3 1.5zM22.5 20.273v-3.574l-3 1.5v3.574l3-1.5zM18.75 16.898l2.824-1.418-2.824-1.406-2.824 1.406 2.824 1.418z"
                fill={focused ? "url(#iconGradient)" : "#CFCFCF"}
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }) => (
            <Svg width={28} height={25} viewBox="0 0 28 25" fill="none">
              <Defs>
                {focused && (
                  <SvgLinearGradient
                    id="activeGradientFavorites"
                    x1="14"
                    y1="0"
                    x2="14"
                    y2="25"
                  >
                    <Stop stopColor="#52C5FE" />
                    <Stop offset="1" stopColor="#285CE8" />
                  </SvgLinearGradient>
                )}
              </Defs>
              <Path
                d="M14.0001 24.9999L12.0668 23.2665C9.82231 21.2443 7.96675 19.4999 6.50008 18.0332C5.03342 16.5665 3.86675 15.2496 3.00008 14.0825C2.13342 12.9154 1.52808 11.8434 1.18408 10.8665C0.840081 9.88965 0.667637 8.88965 0.666748 7.86654C0.666748 5.77765 1.36675 4.0332 2.76675 2.6332C4.16675 1.2332 5.91119 0.533203 8.00008 0.533203C9.15564 0.533203 10.2556 0.777647 11.3001 1.26654C12.3445 1.75543 13.2445 2.44431 14.0001 3.3332C14.7556 2.44431 15.6556 1.75543 16.7001 1.26654C17.7445 0.777647 18.8445 0.533203 20.0001 0.533203C22.089 0.533203 23.8334 1.2332 25.2334 2.6332C26.6334 4.0332 27.3334 5.77765 27.3334 7.86654C27.3334 8.88876 27.1614 9.88876 26.8174 10.8665C26.4734 11.8443 25.8676 12.9163 25.0001 14.0825C24.1325 15.2488 22.9659 16.5656 21.5001 18.0332C20.0343 19.5008 18.1788 21.2452 15.9334 23.2665L14.0001 24.9999ZM14.0001 21.3999C16.1334 19.4888 17.889 17.8501 19.2668 16.4839C20.6445 15.1176 21.7334 13.9288 22.5334 12.9172C23.3334 11.9056 23.889 11.0052 24.2001 10.2159C24.5112 9.42654 24.6668 8.64342 24.6668 7.86654C24.6668 6.5332 24.2223 5.42209 23.3334 4.5332C22.4445 3.64431 21.3334 3.19987 20.0001 3.19987C18.9556 3.19987 17.989 3.49409 17.1001 4.08254C16.2112 4.67098 15.6001 5.4212 15.2668 6.3332H12.7334C12.4001 5.42209 11.789 4.67231 10.9001 4.08387C10.0112 3.49543 9.04453 3.20076 8.00008 3.19987C6.66675 3.19987 5.55564 3.64431 4.66675 4.5332C3.77786 5.42209 3.33342 6.5332 3.33342 7.86654C3.33342 8.64431 3.48897 9.42787 3.80008 10.2172C4.11119 11.0065 4.66675 11.9065 5.46675 12.9172C6.26675 13.9279 7.35564 15.1168 8.73342 16.4839C10.1112 17.851 11.8668 19.4896 14.0001 21.3999Z"
                fill={focused ? "url(#activeGradientFavorites)" : "#CFCFCF"}
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <Svg width={27} height={28} viewBox="0 0 27 28" fill="none">
              <Defs>
                {focused && (
                  <SvgLinearGradient
                    id="activeGradientCart"
                    x1="13.5"
                    y1="0"
                    x2="13.5"
                    y2="28"
                  >
                    <Stop stopColor="#52C5FE" />
                    <Stop offset="1" stopColor="#285CE8" />
                  </SvgLinearGradient>
                )}
              </Defs>
              <Path
                d="M21.6666 21.9998C20.1866 21.9998 18.9999 23.1865 18.9999 24.6665C18.9999 25.3738 19.2809 26.052 19.781 26.5521C20.2811 27.0522 20.9593 27.3332 21.6666 27.3332C22.3738 27.3332 23.0521 27.0522 23.5522 26.5521C24.0523 26.052 24.3333 25.3738 24.3333 24.6665C24.3333 23.9593 24.0523 23.281 23.5522 22.7809C23.0521 22.2808 22.3738 21.9998 21.6666 21.9998ZM0.333252 0.666504V3.33317H2.99992L7.79992 13.4532L5.98659 16.7198C5.78659 17.0932 5.66659 17.5332 5.66659 17.9998C5.66659 18.7071 5.94754 19.3854 6.44764 19.8855C6.94773 20.3856 7.62601 20.6665 8.33325 20.6665H24.3333V17.9998H8.89326C8.80485 17.9998 8.72007 17.9647 8.65755 17.9022C8.59504 17.8397 8.55992 17.7549 8.55992 17.6665C8.55992 17.5998 8.57325 17.5465 8.59992 17.5065L9.79992 15.3332H19.7333C20.7333 15.3332 21.6133 14.7732 22.0666 13.9598L26.8399 5.33317C26.9333 5.11984 26.9999 4.89317 26.9999 4.66651C26.9999 4.31288 26.8595 3.97374 26.6094 3.7237C26.3594 3.47365 26.0202 3.33317 25.6666 3.33317H5.94659L4.69325 0.666504M8.33325 21.9998C6.85325 21.9998 5.66659 23.1865 5.66659 24.6665C5.66659 25.3738 5.94754 26.052 6.44764 26.5521C6.94773 27.0522 7.62601 27.3332 8.33325 27.3332C9.0405 27.3332 9.71878 27.0522 10.2189 26.5521C10.719 26.052 10.9999 25.3738 10.9999 24.6665C10.9999 23.9593 10.719 23.281 10.2189 22.7809C9.71878 22.2808 9.0405 21.9998 8.33325 21.9998Z"
                fill={focused ? "url(#activeGradientCart)" : "#CFCFCF"}
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Defs>
                {focused && (
                  <SvgLinearGradient
                    id="activeGradientAccount"
                    x1="11"
                    y1="0"
                    x2="11"
                    y2="22"
                  >
                    <Stop stopColor="#52C5FE" />
                    <Stop offset="1" stopColor="#285CE8" />
                  </SvgLinearGradient>
                )}
              </Defs>
              <Path
                d="M10.9999 0.333496C12.4144 0.333496 13.771 0.895399 14.7712 1.89559C15.7713 2.89579 16.3333 4.25234 16.3333 5.66683C16.3333 7.08132 15.7713 8.43787 14.7712 9.43807C13.771 10.4383 12.4144 11.0002 10.9999 11.0002C9.58543 11.0002 8.22888 10.4383 7.22868 9.43807C6.22849 8.43787 5.66659 7.08132 5.66659 5.66683C5.66659 4.25234 6.22849 2.89579 7.22868 1.89559C8.22888 0.895399 9.58543 0.333496 10.9999 0.333496ZM10.9999 13.6668C16.8933 13.6668 21.6666 16.0535 21.6666 19.0002V21.6668H0.333252V19.0002C0.333252 16.0535 5.10659 13.6668 10.9999 13.6668Z"
                fill={focused ? "url(#activeGradientAccount)" : "#CFCFCF"}
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="productListByCategory"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="productListByCampaign"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="productListByBrand"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="productDetail"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
      <Tabs.Screen
        name="editAccount"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />

      <Tabs.Screen
        name="addressBook"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />

      <Tabs.Screen
        name="addressCreate"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />

      <Tabs.Screen
        name="orderHistory"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />

      <Tabs.Screen
        name="orderDetail"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />

      <Tabs.Screen
        name="orderPay"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />

      <Tabs.Screen
        name="debug"
        options={{
          href: null, // This hides the tab from the tab bar
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  tabBar: {
    backgroundColor: "#fff",
    boxShadow: "0px -4px 10px 0px #00000014",
    height: 70,
    paddingTop: 10,
    borderColor: "#fff",
    position: "fixed",
    bottom: 0,
  },
});
