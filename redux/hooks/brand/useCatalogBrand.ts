import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCatalogBrandList } from "@/redux/services/brand/brandSlice";
import { AllBrandResponse } from "@/constants/config";

const useCatalogBrand = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalogBrand } = useSelector((state: RootState) => state.brand);
  const [pagination, setPagination] = useState({ page: 1, size: 9 });
  const [loading, setLoading] = useState(false);
  const [is_highlight, setIsHighlight] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAllBrands = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(
        handleFetchAllCatalogBrandList({ pagination, is_highlight })
      );
      setLoading(false);
    };
    fetchAllBrands();
  }, [dispatch, pagination]);

  const handleLoadBrandList =
    useCallback(async (): Promise<AllBrandResponse | void> => {
      try {
        await dispatch(
          handleFetchAllCatalogBrandList({ pagination, is_highlight })
        );
      } catch (err) {
        console.error("Failed to load Brand:", err);
      }
    }, [dispatch]);

  return {
    brands: catalogBrand,
    loading,
    pagination,
    is_highlight,
    setPagination,
    setIsHighlight,
    handleLoadBrandList,
  };
};

export default useCatalogBrand;
