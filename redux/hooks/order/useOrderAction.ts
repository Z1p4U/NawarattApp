import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { createOrder, loadOrders } from "@/redux/services/order/orderSlice";
import type { OrderPayload, MessageResponse } from "@/constants/config";

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

  //   const handleUpdateOrder = useCallback(
  //     async (
  //       id: number,
  //       payload: OrderPayload
  //     ): Promise<MessageResponse | void> => {
  //       try {
  //         const response = await dispatch(updateOrder({ id, payload })).unwrap();

  //         await dispatch(loadOrders({ pagination: { page: 1, size: 10 } }));

  //         return response;
  //       } catch (err) {
  //         console.error("Failed to update order:", err);
  //       }
  //     },
  //     [dispatch]
  //   );

  //   const handleDeleteOrder = useCallback(
  //     async (id: number): Promise<MessageResponse | void> => {
  //       try {
  //         const response = await dispatch(deleteOrder(id)).unwrap();
  //         return response;
  //       } catch (err) {
  //         console.error("Failed to delete order:", err);
  //       }
  //     },
  //     [dispatch]
  //   );

  return {
    status,
    error,
    createOrder: handleCreateOrder,
  };
};

export default useOrderAction;
