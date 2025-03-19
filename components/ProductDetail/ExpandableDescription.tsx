import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ExpandableDescriptionProps {
  description: string;
  numberOfLines?: number;
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  description,
  numberOfLines = 2,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={expanded ? undefined : numberOfLines}
        style={styles.description}
      >
        {description}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.seeMoreText}>
          {expanded ? "See Less" : "See More"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExpandableDescription;

const styles = StyleSheet.create({
  container: {},
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    textAlign: "justify",
  },
  seeMoreText: {
    marginTop: 5,
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
