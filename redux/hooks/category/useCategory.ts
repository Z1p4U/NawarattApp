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
  const [is_highlight, setIsHighlight] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllCategoryList({ pagination, is_highlight }));
      setLoading(false);
    };

    fetchAllCategories();
  }, [dispatch, pagination, is_highlight]);

  const handleLoadCategory =
    useCallback(async (): Promise<AllCategoryResponse | void> => {
      try {
        await dispatch(
          handleFetchAllCategoryList({ pagination, is_highlight })
        );
      } catch (err) {
        console.error("Failed to load Category:", err);
      }
    }, [dispatch]);

  return {
    categories,
    loading,
    pagination,
    isHighlight: is_highlight,
    setPagination,
    handleLoadCategory,
    setIsHighlight,
  };
};

export default useCategory;
