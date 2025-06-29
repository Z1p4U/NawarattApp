import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCategoryProductState,
  handleFetchAllSpecialCategoryProducts,
} from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function useSpecialCategoryProducts(id: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { specialCategoriesProducts, status, totalSpecialCategoriesProducts } =
    useSelector((s: RootState) => s.product);
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  // ① Whenever the category id changes, clear out the old list and reset page
  useEffect(() => {
    dispatch(clearCategoryProductState());
    setPagination({ page: 1, size: 20 });
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(handleFetchAllSpecialCategoryProducts({ id, pagination }));
  }, [dispatch, id, pagination]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [
    status,
    specialCategoriesProducts.length,
    totalSpecialCategoriesProducts,
  ]);

  const reset = useCallback(() => {
    dispatch(clearCategoryProductState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore =
    specialCategoriesProducts.length < totalSpecialCategoriesProducts;

  return {
    specialCategoriesProducts,
    loading: status === "loading",
    loadMore,
    reset,
    hasMore,
  };
}
