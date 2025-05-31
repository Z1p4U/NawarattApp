import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  createOrder,
  loadOrders,
  payOrder,
} from "@/redux/services/order/orderSlice";
import type {
  OrderPayload,
  MessageResponse,
  OrderPayPayload,
  AllOrderResponse,
} from "@/constants/config";

const useOrderAction = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectOrderState = useMemo(() => (state: RootState) => state.order, []);
  const { status, error } = useSelector(selectOrderState, shallowEqual);

  const handleCreateOrder = useCallback(
    async (payload: OrderPayload): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(createOrder(payload)).unwrap();

        await dispatch(loadOrders({ pagination: { page: 1, size: 10 } }));

        return response;
      } catch (err) {
        console.error("Failed to create order:", err);
      }
    },
    [dispatch]
  );

  const handleLoadOrder =
    useCallback(async (): Promise<AllOrderResponse | void> => {
      try {
        await dispatch(loadOrders({ pagination: { page: 1, size: 12 } }));
      } catch (err) {
        console.error("Failed to load order:", err);
      }
    }, [dispatch]);

  const handlePayOrder = useCallback(
    async (
      id: number,
      payload: OrderPayPayload
    ): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(payOrder({ id, payload })).unwrap();

        await dispatch(loadOrders({ pagination: { page: 1, size: 10 } }));

        return response;
      } catch (err) {
        console.error("Failed to pay order:", err);
      }
    },
    [dispatch]
  );

  return {
    status,
    error,
    loadOrder: handleLoadOrder,
    createOrder: handleCreateOrder,
    payOrder: handlePayOrder,
  };
};

export default useOrderAction;
