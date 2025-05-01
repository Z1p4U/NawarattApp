import React from "react";
import { ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import Svg, { Path } from "react-native-svg";

export default function Checkout() {
  return (
    <>
      <HeadLine />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <Text style={styles.headText}>Checkout</Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 15 }}>
          <Text style={styles.deliAddress}>Choose Delivery Address</Text>

          <View style={{ gap: 10, marginTop: 20 }}>
            <View style={styles?.addressCard}>
              <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
                <Path
                  d="M23.75 22.75H1.25m0-12.375l4.57-3.656m17.93 3.656l-9.142-7.313a3.375 3.375 0 00-4.216 0l-.88.704m6.925.421v-2.25A.563.563 0 0117 1.375h2.813a.562.562 0 01.562.563v5.625M3.5 22.75V8.687m18 0v4.5m0 9.563v-5.063"
                  stroke="#000"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
                <Path
                  d="M15.875 22.75v-5.625c0-1.59 0-2.386-.495-2.88-.493-.495-1.288-.495-2.88-.495-1.592 0-2.386 0-2.88.495m-.495 8.505v-5.625"
                  stroke="#000"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M14.75 8.688a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  stroke="#000"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                />
              </Svg>

              <View style={styles?.addressCardDiv}>
                <Text style={styles?.addressCardHead}>Address 1</Text>
                <Text style={styles?.addressCardText}>
                  Ka Na-105, Kannar St, Oh Tan Ward
                </Text>
                <Text style={styles?.addressCardText}>
                  Township : Hlaing Thar Yar
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.orderSummary}>Order Summary</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 120, // ensure space for bottom checkout bar
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
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
  deliAddress: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
  },

  addressCard: {
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    gap: 20,
  },
  addressCardDiv: {
    gap: 10,
  },
  addressCardHead: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
  },
  addressCardText: {
    fontSize: 14,
    color: "#0000004D",
    fontFamily: "Saira-Medium",
  },

  orderSummary: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Saira-Medium",
    marginTop: 20,
  },
});
