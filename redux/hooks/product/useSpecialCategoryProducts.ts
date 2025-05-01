import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAllSpecialCategoryProducts } from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import type { PaginationPayload } from "@/constants/config";

export default function useSpecialCategoryProducts(pageSize = 20) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    newArrivalProducts,
    featuredProducts,
    bestSellingProducts,
    topPickProducts,
    topSellingProducts,
    status,
  } = useSelector((s: RootState) => s.product);

  const [page, setPage] = useState(1);
  const [is_highlight, setIsHighlight] = useState(true);

  useEffect(() => {
    const pagination: PaginationPayload = { page, size: pageSize };
    dispatch(
      handleFetchAllSpecialCategoryProducts({
        is_highlight,
        pagination,
      })
    );
  }, [dispatch, is_highlight, page, pageSize]);

  const loadMore = useCallback(() => {
    if (status !== "loading") {
      setPage((p) => p + 1);
    }
  }, [status]);

  return {
    newArrivalProducts,
    featuredProducts,
    bestSellingProducts,
    topPickProducts,
    topSellingProducts,
    loading: status === "loading",
    loadMore,
  };
}
