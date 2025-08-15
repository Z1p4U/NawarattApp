import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { Brand, Category } from "@/constants/config";
import { LinearGradient } from "expo-linear-gradient";

export type FilterSheetRef = {
  open: () => void;
  close: () => void;
};

export interface FilterSheetProps {
  categories: Category[] | null;
  brands: Brand[] | null;
  initialCatId: string | null;
  initialBrandId: string | null;
  initialMinPrice: number | null;
  initialMaxPrice: number | null;
  onApply: (
    catId: string | null,
    brandId: string | null,
    minPrice: number | null,
    maxPrice: number | null
  ) => void;
}

const FilterModal = forwardRef<FilterSheetRef, FilterSheetProps>(
  (
    {
      categories,
      brands,
      initialCatId,
      initialBrandId,
      initialMinPrice,
      initialMaxPrice,
      onApply,
    },
    ref
  ) => {
    const sheetRef = React.useRef<any>(null);

    // local state so user can cancel
    const [catId, setCatId] = useState<string | null>(initialCatId);
    const [brandId, setBrandId] = useState<string | null>(initialBrandId);
    const [minPrice, setMinPrice] = useState<number | null>(initialMinPrice);
    const [maxPrice, setMaxPrice] = useState<number | null>(initialMaxPrice);

    useEffect(() => {
      setCatId(initialCatId);
      setBrandId(initialBrandId);
      setMinPrice(initialMinPrice);
      setMaxPrice(initialMaxPrice);
    }, [initialCatId, initialBrandId, initialMinPrice, initialMaxPrice]);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const _handleApply = () => {
      onApply(catId, brandId, minPrice, maxPrice);
      sheetRef.current?.close();
    };

    return (
      <RBSheet
        ref={sheetRef}
        height={400}
        openDuration={250}
        customStyles={{
          container: styles.sheetContainer,
        }}
      >
        <ScrollView>
          {/* Categories */}
          <Text style={styles.section}>Categories</Text>
          <View style={styles.row}>
            {categories?.map((c) => {
              const sel = catId === String(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.btn, sel && styles.btnSel]}
                  onPress={() => setCatId(sel ? null : String(c.id))}
                >
                  <View style={[styles.radio, sel && styles.radioSel]} />
                  <Text style={styles.btnText}>{c.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Brands */}
          {brands && (
            <>
              <Text style={styles.section}>Brands</Text>
              <View style={styles.row}>
                {brands.map((b) => {
                  const sel = brandId === String(b.id);
                  return (
                    <TouchableOpacity
                      key={b.id}
                      style={[styles.btn, sel && styles.btnSel]}
                      onPress={() => setBrandId(sel ? null : String(b.id))}
                    >
                      <View style={[styles.radio, sel && styles.radioSel]} />
                      <Text style={styles.btnText}>{b.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Price */}
          <Text style={styles.section}>Price Range</Text>
          <View
            style={[
              styles.row,
              {
                marginVertical: 20,
              },
            ]}
          >
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={minPrice?.toString() ?? ""}
              placeholder="100"
              onChangeText={(t) => setMinPrice(Number(t) || 0)}
            />
            <Text
              style={{
                marginHorizontal: 8,
                color: "#00000080",
                fontFamily: "Saira-Medium",
              }}
            >
              to
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={maxPrice?.toString() ?? ""}
              placeholder="10,000"
              onChangeText={(t) => setMaxPrice(Number(t) || 0)}
            />
          </View>

          <TouchableOpacity
            style={styles.addButtonWrapper}
            onPress={_handleApply}
          >
            <LinearGradient
              colors={["#275AE8", "#54CAFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newAddress}
            >
              <Text style={styles.chatText} allowFontScaling={false}>
                Done
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </RBSheet>
    );
  }
);

export default FilterModal;

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  section: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 10,
    fontFamily: "Saira-Medium",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#275AE8",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  btnSel: {
    backgroundColor: "#2555E7",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Saira-Medium",
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginRight: 6,
  },
  radioSel: {
    borderColor: "#fff",
    backgroundColor: "#275AE8",
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#EDEDED",
    paddingHorizontal: 15,
  },

  addButtonWrapper: {
    marginTop: 10,
    marginBottom: 20,
  },
  newAddress: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Saira-Medium",
  },
});
