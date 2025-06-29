import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBrandProductState,
  handleFetchAllBrandProducts,
} from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function useBrandProducts(brandId: string | null) {
  const dispatch = useDispatch<AppDispatch>();
  const { brandProducts, status, totalBrandProducts } = useSelector(
    (s: RootState) => s.product
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    dispatch(clearBrandProductState());
    setPagination({ page: 1, size: 20 });
  }, [dispatch, brandId]);

  useEffect(() => {
    dispatch(
      handleFetchAllBrandProducts({
        pagination,
        brand_id: brandId != null && brandId > "" ? brandId : null,
      })
    );
  }, [dispatch, brandId, pagination]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status, brandProducts.length, totalBrandProducts]);

  const reset = useCallback(() => {
    dispatch(clearBrandProductState());
    setPagination({ page: 1, size: 10 });
  }, [setPagination]);

  const hasMore = brandProducts.length < totalBrandProducts;

  return {
    brandProducts,
    loading: status === "loading",
    hasMore,
    loadMore,
    reset,
  };
}
