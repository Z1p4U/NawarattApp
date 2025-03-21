import HeadLine from "@/components/ui/HeadLine";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SearchComponent from "@/components/ui/SearchComponent";
import ProductCard from "@/components/ui/ProductCard";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

export default function Catalog() {
  const data = [
    {
      id: "1",
      image:
        "https://s3-alpha-sig.figma.com/img/cf1b/2973/baaa58c8d3a605e4d4135b6cdf7ecf13?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mXk93Dq4Sb7kd6RhFcUEVwkRO2wZqvJo1cOEwXI0KjfjAcODlH38dApw5cevPDW2ZxQMjfIIcB5iIFJQlGoJMZ3X7D42enVQbzrelPpN95LnYaQX~wmTeS7Kv2AtOWPIbmO9JvuvdU3yvlI4VtnGFGiE3eUzEcU9m~yEG7mjcM5mIwvLlR~4-XZBsQZRmz-oUUk2wv5gUDCDDtJ7nwAC9yIxvox083iRvl2~aWLqvpaOzuK5M88FDX0rVBMYcLxov8SLnMolIcPEcok0kBoyC~R-4RE0QkCCD6Dv1BYAaHtQ6UPFmZ0mxvaPLMxnUarNr2rr39ElHpsMZ1HcHYPDKQ__",
      name: "Pain Relief & Fever",
      price: 100,
    },
    {
      id: "2",
      image:
        "https://s3-alpha-sig.figma.com/img/34db/7459/3dc089a1c8a6e8c15b8ae658b4b70552?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=g0Mc~cblo6fRTn3v0ZfA5gFITwL2B1Ls34O24OGSF77m8j55bC-qE5yDnHSFRyRToCUd-d33YcXkiw5~RxrFYDcCDEl4sR7rzZYi6sjvN-3xVfWV2VQ3cwgurLA~apEGDUGz~D8hbii62aNar~GZWFuK9qQo3u4tyaCl2y~-8DhYqINv5l3GjSSFCuzD7~0~FrkI6NgOljDZTw8~QAqaGScrP2yY84E9wo8hUUeuCLzIv9yZQCof9djhoShf8Qn5yCWPFENpS0Vk1O9IYbRIBplcEdqZVad0iiOJD5RLtznRnmMlrZ5XPE1yIThtrYPTV1ALWOv-nmR8fQJb~kJ6nw__",
      name: "Cough & Flu",
      price: 2000,
    },
    {
      id: "3",
      image:
        "https://s3-alpha-sig.figma.com/img/2068/cb96/cd30d2fbd923a0fd4198a43b6b68da8c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=r6627m-nymZty7lWWSwJB7aJ6U6CR9Z5Y6fS0RrBaCkizohOrLb4L~x~NGUDXVZQ0hJhdtkKDLPcYJ5NAimvqMsIJL4r77Uxbw88ukaXjAuqwAp9S4CINZr9feH00VJTrvO2m6ATu-xu44ipiCbHdmo-AfdvSsQZUKtmKQznVSIIVQfiHz1F5E7NQWCeQHK5c55r9CiYOjr~IyZve8Hz2u02X52xSNx-ho-WCtZjlEohO7lmXDAUQmhSr-SY~Knyh3bSItQIB4pk0BvPPcGYdj8VwzCTOFyRRSGgEFS48GmJw6la6b8lI-RzXd5BhMVFDYInt91QjuPaEGtp29~GaA__",
      name: "Digestive Health",
      price: 300,
    },
    {
      id: "4",
      image:
        "https://s3-alpha-sig.figma.com/img/c358/d078/a7112c3124474a68336eb4a5ac20cd40?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JDO5drhDvq65X~Rl~8vT63Cg0WoheyQaJwKfHuGfBQeZWAQnVDcB3WK4r4W1BpWtYzaEZ5-XLE3OzZO76snsTCnqliarDTn9Cb7AKsQBDJevXOU-EktAZG5cy6opWxuSWXZmJZUrl9AZ9yUzCYmFFcmbHp2qBi9T5FHkr~dPVdZGRNS1lQXmgl3z-FPOFfpcmaBw7JNNZdF7lMwtJuWNf39l1kpW-FgO1ldLo88n~7ULGWp6UecBkV5tXEeblx351cK4HP7QVSC5zb6kR-c7j9tFysq63CkLaCkw4ow2fIqWgTYALujw8sYd~BbTnjSbVMZiL6YyfjE5uCaScOjmtg__",
      name: "Eye & Ear Care",
      price: 400,
    },
    {
      id: "5",
      image:
        "https://s3-alpha-sig.figma.com/img/30f1/6d93/580cae69a28e667457cc3713da2860ee?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cWod1Hi8B995XATEu-WwpNzKzDu~uugUefW7IIO7Hc3ncF76Fzybx33yKSQjmnLpyvsDnkAR0zxvo5gocYtT5R16NhieFmqia8FJNrL2lXyJbwN~y7ATw-FnWEmCZpqW1qq4DLuBdMD53WCsPzdV2xRZPPf~QV9-LJ~k1GNYNwKpuq22RmCA4ustsVLzEqQAgoEe7GOuR9Kv-gNKzuamRLLvXavrLn9xgGYKE92GmMS19xMVHhLCfCr4yMwAQXZkDXeNt24xJPpiVISPeOOAM08Yf1UKRZ1FtBd3ChVhm2K8OFyUHThVRkzee5NYunitYIKXp~M3644UP~0sh2~~lQ__",
      name: "Pain Relief & Fever",
      price: 500,
    },
  ];

  return (
    <>
      <HeadLine />
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["#53CAFE", "#2555E7"]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 0.0 }}
          style={styles.banner}
        >
          <SearchComponent />
        </LinearGradient>

        <View style={styles.menu}>
          <Text style={styles.menuText}>All Products</Text>
          <View style={styles.menu}>
            <Text style={styles.menuText}>Sort</Text>
            <Svg width={12} height={14} viewBox="0 0 12 14" fill="none">
              <Path
                d="M3.333 12.333V5.667m0 6.666l-2-2m2 2l2-2m3.334-8.666v6.666m0-6.666l2 2m-2-2l-2 2"
                stroke="#000"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

        <View style={styles.row}>
          {data.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    minHeight: 100,
    padding: 15,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    gap: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: 500,
    color: "#000000",
    fontFamily: "Saira-Medium",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginHorizontal: 15,
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
});
