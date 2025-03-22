import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export default function SearchComponent({ onchange }) {
  return (
    <>
      <View style={styles.searchBar}>
        <Svg width={23} height={23} viewBox="0 0 25 25" fill="none">
          <Path
            d="M19.036 17.386l4.997 4.996-1.65 1.65-4.996-4.996a10.454 10.454 0 01-6.554 2.297c-5.796 0-10.5-4.704-10.5-10.5s4.704-10.5 10.5-10.5 10.5 4.704 10.5 10.5a10.453 10.453 0 01-2.297 6.553zm-2.34-.865A8.143 8.143 0 0019 10.833a8.165 8.165 0 00-8.167-8.166 8.165 8.165 0 00-8.166 8.166A8.165 8.165 0 0010.833 19a8.143 8.143 0 005.688-2.304l.175-.175z"
            fill="#000"
            fillOpacity={0.5}
          />
        </Svg>
        <TextInput
          style={styles.input}
          placeholder="Search for Products"
          placeholderTextColor="#888"
          onChangeText={onchange}
        />
        <TouchableOpacity style={{ display: "none" }}>
          <Svg width={24} height={24} viewBox="0 0 28 24" fill="none">
            <Path
              d="M4.083 12V.667m19.834 22.666v-4.25m-19.834 4.25v-5.666m19.834-4.25V.667M14 4.917V.667m0 22.666v-12.75M4.083 17.667a2.833 2.833 0 100-5.667 2.833 2.833 0 000 5.667zM14 10.583a2.833 2.833 0 100-5.666 2.833 2.833 0 000 5.666zM23.917 19.083a2.833 2.833 0 100-5.666 2.833 2.833 0 000 5.666z"
              stroke="#000"
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: "#fff",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily: "Saira-Regular",
  },
});
