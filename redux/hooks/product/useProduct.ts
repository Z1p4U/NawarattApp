import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAllProductList } from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import type { PaginationPayload } from "@/constants/config";

export default function useProduct(
  name: string | null,
  brandId: number | null
) {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status } = useSelector((s: RootState) => s.product);
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    console.log(pagination);
    dispatch(
      handleFetchAllProductList({
        name,
        brand_id: brandId != null && brandId > 0 ? brandId : undefined,
        pagination,
      })
    );
  }, [dispatch, name, brandId, pagination]);

  const loadMore = useCallback(() => {
    console.log("first");
    if (status != "loading") {
      console.log("sec");
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status]);

  return {
    products,
    loading: status === "loading",
    loadMore,
  };
}
