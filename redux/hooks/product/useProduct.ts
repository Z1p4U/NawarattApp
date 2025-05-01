import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAllProductList } from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import type { PaginationPayload } from "@/constants/config";

export default function useProduct(
  name: string | null,
  brandId: number | null,
  pageSize = 20
) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((s: RootState) => s.product);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [name, brandId]);

  useEffect(() => {
    const pagination: PaginationPayload = { page, size: pageSize };
    dispatch(
      handleFetchAllProductList({
        name,
        brand_id: brandId != null && brandId > 0 ? brandId : undefined,
        pagination,
      })
    );
  }, [dispatch, name, brandId, page, pageSize]);

  const loadMore = useCallback(() => {
    if (status !== "loading") {
      setPage((p) => p + 1);
    }
  }, [status]);

  return {
    products,
    loading: status === "loading",
    loadMore,
  };
}
