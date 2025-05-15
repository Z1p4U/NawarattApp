import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllStates } from "@/redux/services/location/locationSlice";

const useStates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { states } = useSelector((state: RootState) => state.location);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(null);

  useEffect(() => {
    const fetchAllStates = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllStates({ pagination, countryId }));
      setLoading(false);
    };

    fetchAllStates();
  }, [dispatch, pagination]);

  return {
    states,
    loading,
    pagination,
    countryId,
    setPagination,
    setCountryId,
  };
};

export default useStates;
