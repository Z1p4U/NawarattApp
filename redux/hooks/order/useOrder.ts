import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { loadOrders } from "@/redux/services/order/orderSlice";

const useOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status } = useSelector((state: RootState) => state.order);
  const [pagination, setPagination] = useState({ page: 1, size: 12 });

  useEffect(() => {
    const fetchAllOrder = async () => {
      await dispatch(loadOrders({ pagination }));
    };

    fetchAllOrder();
  }, [dispatch, pagination]);

  const loading = status === "loading";

  console.log(orders);

  return {
    orders,
    loading,
    pagination,
    setPagination,
  };
};

export default useOrder;
