import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadOrderDetail } from "@/redux/services/order/orderSlice";

const useOrderDetail = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const orderResponse = useSelector((state: RootState) => state.order);
  const orderDetail = orderResponse?.orderDetail;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      dispatch(loadOrderDetail(id));
      setLoading(false);
    };
    fetchOrderDetail();
  }, [dispatch, id]);

  return {
    orderDetail,
    loading,
  };
};

export default useOrderDetail;
