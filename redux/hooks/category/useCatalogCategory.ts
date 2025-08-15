import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCatalogCategoryList } from "@/redux/services/category/categorySlice";
import { AllCategoryResponse } from "@/constants/config";

const useCatalogCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalogCategories } = useSelector(
    (state: RootState) => state.category
  );
  const [pagination, setPagination] = useState({ page: 1, size: 1000 });
  const [loading, setLoading] = useState(false);
  const [is_highlight, setIsHighlight] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(
        handleFetchAllCatalogCategoryList({ pagination, is_highlight })
      );
      setLoading(false);
    };

    fetchAllCategories();
  }, [dispatch, pagination, is_highlight]);

  const handleLoadCategory =
    useCallback(async (): Promise<AllCategoryResponse | void> => {
      try {
        await dispatch(
          handleFetchAllCatalogCategoryList({ pagination, is_highlight })
        );
      } catch (err) {
        console.error("Failed to load Category:", err);
      }
    }, [dispatch]);

  return {
    categories: catalogCategories,
    loading,
    pagination,
    isHighlight: is_highlight,
    setPagination,
    handleLoadCategory,
    setIsHighlight,
  };
};

export default useCatalogCategory;
