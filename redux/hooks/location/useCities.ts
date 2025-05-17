import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleFetchAllCities } from "@/redux/services/location/locationSlice";

const useCities = ({
  countryId,
  stateId,
}: {
  countryId?: number | null;
  stateId?: number | null;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, status } = useSelector((city: RootState) => city.location);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });

  useEffect(() => {
    const fetchAllCities = async () => {
      await dispatch(handleFetchAllCities({ pagination, countryId, stateId }));
    };

    fetchAllCities();
  }, [dispatch, pagination, countryId, stateId]);

  const loading = status === "loading";

  return {
    cities,
    loading,
    pagination,
    countryId,
    stateId,
    setPagination,
  };
};

export default useCities;
