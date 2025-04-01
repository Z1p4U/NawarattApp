import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllProductList } from "@/redux/services/product/productSlice";

const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((state: RootState) => state.product);
  const [name, setName] = useState("");
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    dispatch(handleFetchAllProductList({ name, pagination }));
  }, [dispatch, pagination, name]);

  // ✅ Loading will be true if Redux status is "loading"
  const loading = status === "loading";

  const loadMoreProducts = () => {
    if (!loading) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
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
