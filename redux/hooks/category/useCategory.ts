import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCategoryList } from "@/redux/services/category/categorySlice";
import { AllCategoryResponse } from "@/constants/config";

const useCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);
  const [pagination, setPagination] = useState({ page: 1, size: 20 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllCategories = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllCategoryList({ pagination }));
      setLoading(false);
    };

    fetchAllCategories();
  }, [dispatch, pagination]);

  const handleLoadCategory =
    useCallback(async (): Promise<AllCategoryResponse | void> => {
      try {
        await dispatch(handleFetchAllCategoryList({ pagination }));
      } catch (err) {
        console.error("Failed to load Category:", err);
      }
    }, [dispatch]);

  return {
    categories,
    loading,
    pagination,
    setPagination,
    handleLoadCategory,
  };
};

export default useCategory;
