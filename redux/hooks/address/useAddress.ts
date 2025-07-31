import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  clearAddressState,
  loadAddresses,
} from "@/redux/services/address/addressSlice";

const useAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    addresses,
    status: addressStatus,
    totalAddress,
  } = useSelector((state: RootState) => state.address);
  const [pagination, setPagination] = useState({ page: 1, size: 12 });

  useEffect(() => {
    dispatch(clearAddressState());
    setPagination({ page: 1, size: 10 });
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAddresses({ pagination }));
  }, [dispatch, pagination]);

  const loadMore = useCallback(() => {
    if (addressStatus != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [addressStatus, addresses.length, totalAddress]);

  const reset = useCallback(() => {
    dispatch(clearAddressState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = addresses.length < totalAddress;

  const loading = addressStatus === "loading";

  return {
    addresses,
    loading,
    pagination,
    setPagination,
    hasMore,
    reset,
  };
};

export default useAddress;
