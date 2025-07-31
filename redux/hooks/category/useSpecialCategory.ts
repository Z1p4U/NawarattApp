import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllSpecialCategoryList } from "@/redux/services/category/categorySlice";
import { AllSpecialCategoryResponse } from "@/constants/config";

const useSpecialCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { specialCategories } = useSelector(
    (state: RootState) => state.category
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });
  const [is_highlight, setIsHighlight] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllSpecialCategories = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(
        handleFetchAllSpecialCategoryList({ pagination, is_highlight })
      );
      setLoading(false);
    };

    fetchAllSpecialCategories();
  }, [dispatch, pagination]);

  const handleLoadSpecialCategory =
    useCallback(async (): Promise<AllSpecialCategoryResponse | void> => {
      try {
        await dispatch(
          handleFetchAllSpecialCategoryList({ pagination, is_highlight })
        );
      } catch (err) {
        console.error("Failed to load Special Categories:", err);
      }
    }, [dispatch]);

  return {
    specialCategories,
    loading,
    pagination,
    setPagination,
    handleLoadSpecialCategory,
  };
};

export default useSpecialCategory;
