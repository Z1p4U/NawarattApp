import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleFetchAllCities } from "@/redux/services/location/locationSlice";

const useCities = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cities } = useSelector((city: RootState) => city.location);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);

  useEffect(() => {
    const fetchAllCities = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllCities({ pagination, countryId, stateId }));
      setLoading(false);
    };

    fetchAllCities();
  }, [dispatch, pagination]);

  return {
    cities,
    loading,
    pagination,
    countryId,
    stateId,
    setPagination,
    setCountryId,
    setStateId,
  };
};

export default useCities;
