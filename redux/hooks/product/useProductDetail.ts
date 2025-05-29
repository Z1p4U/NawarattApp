import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchProductDetail } from "@/redux/services/product/productSlice";

const useProductDetail = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const productResponse = useSelector((state: RootState) => state.product);
  const productDetail = productResponse?.productDetail;
  const status = productResponse?.status;

  useEffect(() => {
    const fetchProductDetail = async () => {
      dispatch(handleFetchProductDetail(id));
    };
    fetchProductDetail();
  }, [dispatch, id]);

  const loading = status === "loading";

  return {
    productDetail,
    loading,
  };
};

export default useProductDetail;
