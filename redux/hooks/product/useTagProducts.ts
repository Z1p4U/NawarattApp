import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTagProductState,
  handleFetchAllTagProducts,
} from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function useTagProducts(tagId: string | null) {
  const dispatch = useDispatch<AppDispatch>();
  const { tagProducts, status, totalTagProducts } = useSelector(
    (s: RootState) => s.product
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    dispatch(clearTagProductState());
    setPagination({ page: 1, size: 20 });
  }, [dispatch, tagId]);

  useEffect(() => {
    dispatch(
      handleFetchAllTagProducts({
        pagination,
        tag_ids: tagId != null && tagId > "" ? tagId : null,
      })
    );
  }, [dispatch, tagId, pagination]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status, tagProducts.length, totalTagProducts]);

  const reset = useCallback(() => {
    dispatch(clearTagProductState());
    setPagination({ page: 1, size: 10 });
  }, [setPagination]);

  const hasMore = tagProducts.length < totalTagProducts;

  return {
    tagProducts,
    loading: status === "loading",
    hasMore,
    loadMore,
    reset,
  };
}
