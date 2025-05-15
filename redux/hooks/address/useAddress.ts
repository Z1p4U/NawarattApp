import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { loadAddresses } from "@/redux/services/address/addressSlice";

const useAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses } = useSelector((state: RootState) => state.address);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllAddress = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(loadAddresses({ pagination }));
      setLoading(false);
    };

    fetchAllAddress();
  }, [dispatch, pagination]);

  return {
    addresses,
    loading,
    pagination,
    setPagination,
  };
};

export default useAddress;
