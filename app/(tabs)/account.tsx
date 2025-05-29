import HeadSection from "@/components/Account/HeadSection";
import HeadLine from "@/components/ui/HeadLine";
import useAuth from "@/redux/hooks/auth/useAuth";
import useUser from "@/redux/hooks/user/useUser";
import RouteGuard from "@/utils/RouteGuard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Account() {
  const { profileDetail } = useUser();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  return (
    <>
      <RouteGuard>
        <HeadLine />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={styles.container}>
            {/* Head Section Start */}
            <HeadSection data={profileDetail} />
            {/* Head Section End */}

            {/* Body Section Start */}
            <View style={styles.bodyContent}>
              <Text style={styles.headText}>My Orders</Text>

              <View style={styles.iconList}>
                <TouchableOpacity
                  style={styles.iconBlock}
                  onPress={() => router.push("/orderHistory")}
                >
                  <View style={styles.icon}>
                    <Svg width={22} height={27} viewBox="0 0 25 27" fill="none">
                      <Path
                        d="M18.25 26.5c-1.73 0-3.203-.61-4.421-1.829C12.61 23.452 12 21.978 12 20.25c0-1.728.609-3.202 1.829-4.421C15.049 14.609 16.523 14 18.25 14c1.727 0 3.202.61 4.422 1.829 1.221 1.219 1.83 2.693 1.828 4.421-.003 1.728-.612 3.203-1.829 4.422-1.216 1.22-2.69 1.83-4.421 1.828zm2.094-3.281l.875-.875L18.875 20v-3.5h-1.25v4l2.719 2.719zM3.25 25.25a2.407 2.407 0 01-1.765-.734A2.412 2.412 0 01.75 22.75V5.25c0-.688.245-1.276.735-1.765A2.413 2.413 0 013.25 2.75h5.219c.229-.73.677-1.328 1.344-1.796A3.732 3.732 0 0112 .25a3.75 3.75 0 012.235.704c.657.469 1.1 1.068 1.328 1.796h5.187c.688 0 1.276.245 1.766.735s.735 1.078.734 1.765v7.813c-.375-.271-.77-.5-1.188-.688a12.235 12.235 0 00-1.312-.5V5.25h-2.5V9H5.75V5.25h-2.5v17.5h6.625c.146.458.313.896.5 1.313.188.416.417.812.688 1.187H3.25zm8.75-20c.354 0 .651-.12.891-.36s.36-.537.359-.89c0-.353-.12-.65-.36-.89s-.536-.36-.89-.36-.65.12-.89.36-.36.537-.36.89.12.65.36.891.538.36.89.359z"
                        fill="#363636"
                      />
                    </Svg>
                    <View style={styles?.iconCount}>
                      <Text style={styles?.iconCountText}>
                        {profileDetail?.data?.order_stats?.submitted}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.iconText}>Submitted</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBlock}
                  onPress={() => router.push("/orderHistory")}
                >
                  <View style={styles.icon}>
                    <Svg width={22} height={30} viewBox="0 0 27 30" fill="none">
                      <Path
                        d="M19.5 9.375H12V7.5h7.5v1.875zM12 15h7.5v1.875H12V15zm1.919 13.125L15.794 30H.75V0h22.5v18.794l-1.875 1.875V1.875H2.625v26.25h11.294zm-3.135-21.84l-3.472 3.47-2.534-2.533 1.319-1.319L7.312 7.12l2.154-2.153 1.318 1.318zm0 7.5l-3.472 3.47-2.534-2.533 1.319-1.319 1.215 1.216 2.154-2.153 1.318 1.318zm-3.472 8.334l2.154-2.153 1.318 1.318-3.472 3.472-2.534-2.534 1.319-1.319 1.215 1.216zm19.41-.835l-8.16 8.174-3.94-3.955 1.318-1.318 2.623 2.607 6.84-6.826 1.319 1.318z"
                        fill="#363636"
                      />
                    </Svg>
                    <View style={styles?.iconCount}>
                      <Text style={styles?.iconCountText}>
                        {profileDetail?.data?.order_stats?.confirmed}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.iconText}>Confirmed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBlock}
                  onPress={() => router.push("/orderHistory")}
                >
                  <View style={styles.icon}>
                    <Svg width={22} height={25} viewBox="0 0 26 25" fill="none">
                      <Path
                        d="M4.5.75C3.875.75 3.375 1 3 1.5l-1.625 2C1 4 .75 4.5.75 5.125V20.75c0 1.375 1.125 2.5 2.5 2.5h10.375c-.25-.75-.375-1.625-.375-2.5 0-4.125 3.375-7.5 7.5-7.5.875 0 1.75.125 2.5.375v-8.5C23.25 4.5 23 4 22.625 3.5l-1.75-2.125C20.625 1 20.125.75 19.5.75h-15zM4.375 2h15L20.5 3.25H3.375l1-1.25zM4.5 15.75H12v3.75H4.5v-3.75zm19.125 1l-4.5 4.5-2-2-1.375 1.5 3.5 3.75 6-6-1.625-1.75z"
                        fill="#363636"
                      />
                    </Svg>
                    <View style={styles?.iconCount}>
                      <Text style={styles?.iconCountText}>
                        {profileDetail?.data?.order_stats?.delivered}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.iconText}>Delivered</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBlock}
                  onPress={() => router.push("/orderHistory")}
                >
                  <View style={styles.icon}>
                    <Svg width={20} height={27} viewBox="0 0 24 27" fill="none">
                      <Path
                        d="M10.225 23a8.41 8.41 0 001.075 2.5H2.5A2.491 2.491 0 010 23V3A2.5 2.5 0 012.5.5h15A2.5 2.5 0 0120 3v10.225A8.733 8.733 0 0018.125 13c-.212 0-.413 0-.625.037V3h-6.25v10l-3.125-2.813L5 13V3H2.5v20h7.725zm13.525-1.875c0 3.125-2.5 5.625-5.625 5.625a5.602 5.602 0 01-5.625-5.625C12.5 18 15 15.5 18.125 15.5s5.625 2.5 5.625 5.625zM20 24.35l-5.1-5.1a3.462 3.462 0 00-.525 1.875 3.745 3.745 0 003.75 3.75c.7 0 1.35-.188 1.875-.525zm1.875-3.225a3.745 3.745 0 00-3.75-3.75c-.7 0-1.35.188-1.875.525l5.1 5.1a3.462 3.462 0 00.525-1.875z"
                        fill="#363636"
                      />
                    </Svg>
                    <View style={styles?.iconCount}>
                      <Text style={styles?.iconCountText}>
                        {profileDetail?.data?.order_stats?.canceled}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.iconText}>Cancelled</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{ marginTop: 20, marginBottom: 30 }}
                onPress={() => {
                  console.log("Modal Visible:", modalVisible);
                  setModalVisible(true);
                }}
              >
                <LinearGradient
                  colors={["#54CAFF", "#275AE8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.chat}
                >
                  <Svg width={22} height={24} viewBox="0 0 26 24" fill="none">
                    <Path
                      d="M13 .75c6.875 0 12.5 4.475 12.5 10s-5.625 10-12.5 10c-1.55 0-3.037-.225-4.412-.625C4.938 23.25.5 23.25.5 23.25c2.913-2.913 3.375-4.875 3.438-5.625C1.812 15.838.5 13.412.5 10.75c0-5.525 5.625-10 12.5-10z"
                      fill="#fff"
                    />
                  </Svg>
                  <Text style={styles.chatText}>Chat with Admin</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {/* Body Section End */}

            <Modal transparent animationType="fade" visible={modalVisible}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Chat system will be Coming Soon!
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </SafeAreaView>
      </RouteGuard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bodyContent: {
    marginTop: 25,
    gap: 10,
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 70,
    padding: 15,
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headText: {
    fontSize: 22,
    fontWeight: 500,
    color: "#000000",
    fontFamily: "Saira-Medium",
    textAlign: "center",
  },
  iconList: {
    marginTop: 18,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  iconBlock: {
    gap: 8,
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
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
  icon: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
  },
  iconText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#000000",
    fontFamily: "Saira-Medium",
  },

  chat: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 1000,
    marginTop: 20,
    marginHorizontal: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    paddingHorizontal: 40,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
  modalText: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
