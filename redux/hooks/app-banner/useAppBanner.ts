import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllBannerList } from "@/redux/services/app-banner/appBannerSlice";
import { AllAppBannerResponse } from "@/constants/config";

const useAppBanner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners } = useSelector((state: RootState) => state.banner);
  const [pagination, setPagination] = useState({ page: 1, size: 100 });
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("asc");

  useEffect(() => {
    const fetchAllBanners = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(
        handleFetchAllBannerList({ pagination, sort_order: sort })
      );
      setLoading(false);
    };
    fetchAllBanners();
  }, [dispatch, pagination]);

  const handleLoadBannerList =
    useCallback(async (): Promise<AllAppBannerResponse | void> => {
      try {
        await dispatch(
          handleFetchAllBannerList({ pagination, sort_order: sort })
        );
      } catch (err) {
        console.error("Failed to load Banner:", err);
      }
    }, [dispatch]);

  return {
    banners,
    loading,
    pagination,
    sort,
    setPagination,
    setSort,
    handleLoadBannerList,
  };
};

export default useAppBanner;
