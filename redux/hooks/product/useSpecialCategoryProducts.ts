import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAllSpecialCategoryProducts } from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function useSpecialCategoryProducts(id: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { specialCategoriesProducts, status, totalSpecialCategoriesProducts } =
    useSelector((s: RootState) => s.product);

  const [page, setPage] = useState(1);
  const size = 20;

  // Initial & page changes
  useEffect(() => {
    dispatch(
      handleFetchAllSpecialCategoryProducts({ id, pagination: { page, size } })
    );
  }, [dispatch, id, page]);

  const loadMore = useCallback(() => {
    if (status !== "loading") {
      setPage((p) => p + 1);
    }
  }, [status]);

  const reset = useCallback(() => {
    setPage(1);
  }, [dispatch]);

  const hasMore =
    specialCategoriesProducts.length < totalSpecialCategoriesProducts;

  return {
    specialCategoriesProducts,
    loading: status === "loading",
    loadMore,
    reset,
    hasMore,
    page,
  };
}
