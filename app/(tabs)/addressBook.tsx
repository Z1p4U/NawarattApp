import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HeadLine from "@/components/ui/HeadLine";
import GoBack from "@/components/ui/GoBack";
import { useRouter } from "expo-router";
import useAddress from "@/redux/hooks/address/useAddress";
import useAuth from "@/redux/hooks/auth/useAuth";
import AddressLoader from "@/components/ui/AddressLoader";
import Svg, { Path } from "react-native-svg";

export default function AddressBook() {
  const router = useRouter();
  const { addresses, loading, reset } = useAddress();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Pull‑to‑refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await reset();
    } catch {}
    setRefreshing(false);
  }, [reset]);

  // Render each address
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.addressCardWrapper}>
      <View style={styles.addressCard}>
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
        <View style={styles.addressCardDiv}>
          <Text style={styles.addressCardHead} allowFontScaling={false}>
            Address {item.id}{" "}
            {(item.is_default === true ||
              item.is_default === 1 ||
              item.is_default === "1") &&
              "(Default)"}
          </Text>
          <Text
            style={styles.addressCardText}
            numberOfLines={2}
            allowFontScaling={false}
          >
            {item.address}, {item.city.name_en}, {item.state.name_en},{" "}
            {item.country.name_en}
          </Text>
          {item.additional_info ? (
            <Text
              style={styles.addressCardText}
              numberOfLines={2}
              allowFontScaling={false}
            >
              Info: {item.additional_info}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <>
      <HeadLine />

      <FlatList
        style={styles.flatList}
        data={addresses}
        keyExtractor={(a) => a.id.toString()}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={["#53CAFE", "#2555E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <Text style={styles.headText} allowFontScaling={false}>
                Address Book
              </Text>
            </LinearGradient>
            <GoBack to="/account" />
            <TouchableOpacity
              style={styles.addButtonWrapper}
              onPress={() => router.push("/addressCreate")}
            >
              <LinearGradient
                colors={["#54CAFF", "#275AE8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.newAddress}
              >
                <Text style={styles.chatText} allowFontScaling={false}>
                  Add New Address
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        }
        renderItem={renderItem}
        contentContainerStyle={[
          styles.contentContainer, // <-- only padding & flexGrow
          addresses.length === 0 && !loading && styles.containerEmpty,
        ]}
        ListEmptyComponent={
          loading ? (
            <AddressLoader count={6} />
          ) : (
            <View style={styles.bodyCentered}>
              <Text style={styles.messageText}>No addresses found.</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  // FlatList itself must flex to fill parent if you want scrolling
  flatList: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // The content container: padding and flexGrow (so empty state can center)
  contentContainer: {
    paddingBottom: 120,
    backgroundColor: "#fff",
    flexGrow: 1,
  },

  // Only applied when empty & not loading: center content
  containerEmpty: {
    justifyContent: "center",
  },

  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  headText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Saira-Medium",
  },

  addButtonWrapper: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  newAddress: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },

  addressCardWrapper: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  addressCard: {
    backgroundColor: "#F8F8F8",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    gap: 20,
  },
  addressCardDiv: {
    flex: 1,
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

  bodyCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },
});
