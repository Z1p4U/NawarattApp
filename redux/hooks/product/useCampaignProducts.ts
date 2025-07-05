import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCampaignProductState,
  handleFetchAllCampaignProducts,
} from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

export default function useCampaignProducts(id: string) {
  const dispatch = useDispatch<AppDispatch>();
  const { campaignProducts, status, totalCampaignProducts } = useSelector(
    (s: RootState) => s.product
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    dispatch(clearCampaignProductState());
    setPagination({ page: 1, size: 20 });
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(handleFetchAllCampaignProducts({ id, pagination }));
  }, [dispatch, id, pagination]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status, campaignProducts.length, totalCampaignProducts]);

  const reset = useCallback(() => {
    dispatch(clearCampaignProductState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = campaignProducts.length < totalCampaignProducts;

  return {
    campaignProducts,
    loading: status === "loading",
    loadMore,
    reset,
    hasMore,
  };
}
