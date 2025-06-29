import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOrderDetail,
  loadOrderDetail,
} from "@/redux/services/order/orderSlice";
import { OrderDetailResponse } from "@/constants/config";

const useOrderDetail = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const orderResponse = useSelector((state: RootState) => state.order);
  const orderDetail = orderResponse?.orderDetail;
  const status = orderResponse?.status;

  useEffect(() => {
    dispatch(clearOrderDetail());
    dispatch(loadOrderDetail(id));
  }, [dispatch, id]);

  const handleLoadOrderDetail =
    useCallback(async (): Promise<OrderDetailResponse | void> => {
      try {
        await dispatch(loadOrderDetail(id));
      } catch (err) {
        console.error("Failed to load order:", err);
      }
    }, [dispatch, id]);

  return {
    handleLoadOrderDetail,
    orderDetail,
    loading: status === "loading",
  };
};

export default useOrderDetail;
