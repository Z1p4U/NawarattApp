import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCountries } from "@/redux/services/location/locationSlice";

const useCountries = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries } = useSelector((state: RootState) => state.location);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllCountries = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllCountries({ pagination }));
      setLoading(false);
    };

    fetchAllCountries();
  }, [dispatch, pagination]);

  return {
    countries,
    loading,
    pagination,
    setPagination,
  };
};

export default useCountries;
