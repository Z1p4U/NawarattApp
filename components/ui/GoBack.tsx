import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

type RouterHref = Parameters<typeof router.replace>[0];

interface GoBackProps {
  to?: RouterHref;
}

const GoBack: React.FC<GoBackProps> = ({ to = "/" }) => {
  const handlePress = () => {
    router.replace(to);
  };

  return (
    <TouchableOpacity style={styles.goBackContainer} onPress={handlePress}>
      <Svg width={12} height={12} viewBox="0 0 20 20" fill="none">
        <Path
          d="M9.297 18.438L.859 10l8.438-8.438M2.03 10h17.11"
          stroke="#121212"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.goBackText} allowFontScaling={false}>
        Go back
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  goBackText: {
    color: "#666",
    fontFamily: "Saira-Regular",
    fontSize: 14,
  },
});

export default GoBack;
