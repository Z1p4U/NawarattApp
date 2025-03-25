import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllBrandList } from "@/redux/services/brand/brandSlice";

const useBrand = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { brands } = useSelector((state: RootState) => state.brand);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllBrands = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllBrandList({ pagination }));
      setLoading(false);
    };

    fetchAllBrands();
  }, [dispatch, pagination]);

  return {
    brands,
    loading,
    pagination,
    setPagination,
  };
};

export default useBrand;
