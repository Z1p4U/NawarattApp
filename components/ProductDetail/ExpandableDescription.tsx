import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ExpandableDescriptionProps {
  description: string | undefined;
  numberOfLines?: number;
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  description,
  numberOfLines = 1,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setExpanded(!expanded)}
    >
      <Text
        numberOfLines={expanded ? undefined : numberOfLines}
        style={styles.description}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
};

export default ExpandableDescription;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#F2F3F4",
    padding: 13,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    textAlign: "justify",
  },
});
