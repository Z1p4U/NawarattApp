import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductState,
  handleFetchAllProductList,
} from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function useProduct(name: string | null) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, totalProduct } = useSelector(
    (s: RootState) => s.product
  );
  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  // useEffect(() => {
  //   dispatch(clearProductState());
  //   setPagination({ page: 1, size: 20 });
  // }, [dispatch]);

  useEffect(() => {
    dispatch(
      handleFetchAllProductList({
        name,
        pagination,
      })
    );
  }, [dispatch, name, pagination]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status, products.length, totalProduct]);

  const reset = useCallback(() => {
    dispatch(clearProductState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = products.length < totalProduct;

  return {
    products,
    loading: status === "loading",
    hasMore,
    loadMore,
    reset,
  };
}
