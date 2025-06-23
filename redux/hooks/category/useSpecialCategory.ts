import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllSpecialCategoryList } from "@/redux/services/category/categorySlice";

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

  return {
    specialCategories,
    loading,
    pagination,
    setPagination,
  };
};

export default useSpecialCategory;
