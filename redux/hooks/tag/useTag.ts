import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllTagList } from "@/redux/services/tag/tagSlice";
import { AllTagResponse } from "@/constants/config";

const useTag = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags } = useSelector((state: RootState) => state.tag);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);
  const [is_highlight, setIsHighlight] = useState<boolean | null>(true);

  useEffect(() => {
    const fetchAllTags = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(handleFetchAllTagList({ pagination, is_highlight }));
      setLoading(false);
    };
    fetchAllTags();
  }, [dispatch, pagination]);

  const handleLoadTagList =
    useCallback(async (): Promise<AllTagResponse | void> => {
      try {
        await dispatch(handleFetchAllTagList({ pagination, is_highlight }));
      } catch (err) {
        console.error("Failed to load Tag:", err);
      }
    }, [dispatch]);

  return {
    tags,
    loading,
    pagination,
    is_highlight,
    setPagination,
    setIsHighlight,
    handleLoadTagList,
  };
};

export default useTag;
