import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { clearOrderState, loadOrders } from "@/redux/services/order/orderSlice";

const useOrder = ({ orderStatus }: { orderStatus?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, totalOrders } = useSelector(
    (state: RootState) => state.order
  );
  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  useEffect(() => {
    dispatch(clearOrderState());
    setPagination({ page: 1, size: 10 });
  }, [dispatch, orderStatus]);

  useEffect(() => {
    dispatch(loadOrders({ pagination, orderStatus }));
  }, [dispatch, pagination, orderStatus]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status, orders.length, totalOrders]);

  const reset = useCallback(() => {
    dispatch(clearOrderState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = orders.length < totalOrders;

  const loading = status === "loading";

  return {
    orders,
    loading,
    hasMore,
    loadMore,
    reset,
  };
};

export default useOrder;
