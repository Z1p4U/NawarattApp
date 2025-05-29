import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { loadAddresses } from "@/redux/services/address/addressSlice";

const useAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, status } = useSelector(
    (state: RootState) => state.address
  );
  const [pagination, setPagination] = useState({ page: 1, size: 12 });

  useEffect(() => {
    const fetchAllAddress = async () => {
      await dispatch(loadAddresses({ pagination }));
    };

    fetchAllAddress();
  }, [dispatch, pagination]);

  const loading = status === "loading";

  return {
    addresses,
    loading,
    pagination,
    setPagination,
  };
};

export default useAddress;
