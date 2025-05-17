import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllStates } from "@/redux/services/location/locationSlice";

const useStates = ({ countryId }: { countryId?: number | null }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { states, status } = useSelector((state: RootState) => state.location);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });

  useEffect(() => {
    const fetchAllStates = async () => {
      await dispatch(handleFetchAllStates({ pagination, countryId }));
    };

    fetchAllStates();
  }, [dispatch, pagination, countryId]);

  const loading = status === "loading";

  return {
    states,
    loading,
    pagination,
    countryId,
    setPagination,
  };
};

export default useStates;
