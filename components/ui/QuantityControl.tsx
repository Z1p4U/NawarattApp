import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface QuantityControlProps {
  count: number;
  setCount: (value: number) => void;
}

export default function QuantityControl({
  count,
  setCount,
}: QuantityControlProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => setCount(Math.max(1, count - 1))}>
        <LinearGradient
          colors={["#54CAFF", "#275AE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.quantityControlBtn}
        >
          <Svg width={8} height={3} viewBox="0 0 8 3" fill="none">
            <Path d="M.512 2.574V.036h6.831v2.538H.512z" fill="#fff" />
          </Svg>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.quantityTextContainer}>
        <Text style={styles.quantityText} allowFontScaling={false}>
          {count}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setCount(count + 1)}>
        <LinearGradient
          colors={["#54CAFF", "#275AE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.quantityControlBtn}
        >
          <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
            <Path
              d="M5.129 11.596V7.33H.89V5.035h4.239V.796h2.295v4.239h4.266V7.33H7.424v4.266H5.129z"
              fill="#fff"
            />
          </Svg>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityControlBtn: {
    borderRadius: 100000,
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityTextContainer: {
    backgroundColor: "#F2F3F4",
    width: 55,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  quantityText: {
    color: "#00000080",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
