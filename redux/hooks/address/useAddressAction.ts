import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  loadAddresses,
} from "@/redux/services/address/addressSlice";
import type { AddressPayload, MessageResponse } from "@/constants/config";

const useAddressAction = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectAddressState = useMemo(
    () => (state: RootState) => state.address,
    []
  );
  const { status, error } = useSelector(selectAddressState, shallowEqual);

  const handleCreateAddress = useCallback(
    async (payload: AddressPayload): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(createAddress(payload)).unwrap();

        await dispatch(loadAddresses({ pagination: { page: 1, size: 10 } }));

        return response;
      } catch (err) {
        console.error("Failed to create address:", err);
      }
    },
    [dispatch]
  );

  const handleUpdateAddress = useCallback(
    async (
      id: number,
      payload: AddressPayload
    ): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(
          updateAddress({ id, payload })
        ).unwrap();

        await dispatch(loadAddresses({ pagination: { page: 1, size: 10 } }));

        return response;
      } catch (err) {
        console.error("Failed to update address:", err);
      }
    },
    [dispatch]
  );

  const handleDeleteAddress = useCallback(
    async (id: number): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(deleteAddress(id)).unwrap();
        return response;
      } catch (err) {
        console.error("Failed to delete address:", err);
      }
    },
    [dispatch]
  );

  return {
    status,
    error,
    createAddress: handleCreateAddress,
    updateAddress: handleUpdateAddress,
    deleteAddress: handleDeleteAddress,
  };
};

export default useAddressAction;
