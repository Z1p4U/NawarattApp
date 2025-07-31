import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllBrandList } from "@/redux/services/brand/brandSlice";
import { AllBrandResponse } from "@/constants/config";

const useBrand = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { brands } = useSelector((state: RootState) => state.brand);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);
  const [is_highlight, setIsHighlight] = useState(true);

  useEffect(() => {
    const fetchAllBrands = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllBrandList({ pagination, is_highlight }));
      setLoading(false);
    };
    fetchAllBrands();
  }, [dispatch, pagination]);

  const handleLoadBrandList =
    useCallback(async (): Promise<AllBrandResponse | void> => {
      try {
        await dispatch(handleFetchAllBrandList({ pagination, is_highlight }));
      } catch (err) {
        console.error("Failed to load Brand:", err);
      }
    }, [dispatch]);

  return {
    brands,
    loading,
    pagination,
    is_highlight,
    setPagination,
    setIsHighlight,
    handleLoadBrandList,
  };
};

export default useBrand;
