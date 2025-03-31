import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllProductList } from "@/redux/services/product/productSlice";

const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((state: RootState) => state.product);
  const [name, setName] = useState("");
  const [pagination, setPagination] = useState({ page: 1, size: 20 });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch products when pagination or name changes
  useEffect(() => {
    const fetchAllProducts = async () => {
      // if (loading) return; // Prevent multiple calls
      setLoading(true);
      await dispatch(handleFetchAllProductList({ name, pagination }));
      setLoading(false);
    };

    fetchAllProducts();
  }, [dispatch, pagination, name]);

  const loadMoreProducts = () => {
    if (status !== "loading") {
      setLoading(true);
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    pagination,
    setPagination,
    name,
    setName,
    loadMoreProducts, // ✅ Use this in FlatList `onEndReached`
  };
};

export default useProduct;
