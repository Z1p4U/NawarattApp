import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCatalogTagList } from "@/redux/services/tag/tagSlice";
import { AllTagResponse } from "@/constants/config";

const useCatalogTag = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalogTag } = useSelector((state: RootState) => state.tag);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);
  const [is_highlight, setIsHighlight] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAllTags = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(
        handleFetchAllCatalogTagList({ pagination, is_highlight })
      );
      setLoading(false);
    };
    fetchAllTags();
  }, [dispatch, pagination]);

  const handleLoadTagList =
    useCallback(async (): Promise<AllTagResponse | void> => {
      try {
        await dispatch(
          handleFetchAllCatalogTagList({ pagination, is_highlight })
        );
      } catch (err) {
        console.error("Failed to load Tag:", err);
      }
    }, [dispatch]);

  return {
    tags: catalogTag,
    loading,
    pagination,
    is_highlight,
    setPagination,
    setIsHighlight,
    handleLoadTagList,
  };
};

export default useCatalogTag;
