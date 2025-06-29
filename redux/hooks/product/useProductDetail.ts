import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductDetailState,
  handleFetchProductDetail,
} from "@/redux/services/product/productSlice";
import { ProductDetailResponse } from "@/constants/config";

const useProductDetail = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const productResponse = useSelector((state: RootState) => state.product);
  const productDetail = productResponse?.productDetail;
  const relatedProducts = productResponse?.relatedProduct;
  const status = productResponse?.status;

  useEffect(() => {
    dispatch(clearProductDetailState());
    dispatch(handleFetchProductDetail(id));
  }, [dispatch, id]);

  const handleLoadProductDetail =
    useCallback(async (): Promise<ProductDetailResponse | void> => {
      try {
        await dispatch(handleFetchProductDetail(id));
      } catch (err) {
        console.error("Failed to load product detail:", err);
      }
    }, [dispatch, id]);

  return {
    productDetail,
    relatedProducts,
    loading: status === "loading",
    handleLoadProductDetail,
  };
};

export default useProductDetail;
