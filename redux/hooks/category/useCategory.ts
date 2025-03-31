import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCategoryList } from "@/redux/services/category/categorySlice";

const useCategory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
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

  return {
    categories,
    loading,
    pagination,
    setPagination,
  };
};

export default useCategory;
