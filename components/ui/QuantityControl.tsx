import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface QuantityControlProps {
  count: number;
  setCount: (value: number) => void;
}

export default function QuantityControl({
  count,
  setCount,
}: QuantityControlProps) {
  // keep a local string state so editing doesn't fight numeric coercion
  const [input, setInput] = useState(String(count));

  // Keep input synced when parent `count` changes (e.g. external updates)
  useEffect(() => {
    setInput(String(count));
  }, [count]);

  const onChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    setInput(digits);

    // update parent if the number is >= 1 (avoid forcing 1 while user is editing)
    if (digits !== "") {
      const n = parseInt(digits, 10);
      if (!isNaN(n) && n >= 1) {
        setCount(n);
      }
    }
  };

  const onBlur = () => {
    // if empty or invalid, fallback to 1
    if (!input || input.trim() === "") {
      setCount(1);
      setInput("1");
      return;
    }
    const n = parseInt(input, 10);
    if (isNaN(n) || n < 1) {
      setCount(1);
      setInput("1");
    } else {
      // normalize (remove leading zeros)
      setCount(n);
      setInput(String(n));
    }
  };

  const decrement = () => {
    const next = Math.max(1, count - 1);
    setCount(next);
    setInput(String(next));
  };

  const increment = () => {
    const next = count + 1;
    setCount(next);
    setInput(String(next));
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={decrement} accessibilityRole="button">
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
        <TextInput
          value={input}
          onChangeText={onChange}
          onBlur={onBlur}
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
          returnKeyType="done"
          maxLength={6}
          style={styles.quantityText}
          underlineColorAndroid="transparent"
          accessible
          accessibilityLabel="Quantity"
          textAlign="center"
        />
      </View>

      <TouchableOpacity onPress={increment} accessibilityRole="button">
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityText: {
    backgroundColor: "#F2F3F4",
    width: 55,
    paddingVertical: 3,
    borderRadius: 10,
    color: "#00000080",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
    padding: 0,
    minHeight: 20,
  },
});
