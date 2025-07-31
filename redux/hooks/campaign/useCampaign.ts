import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCampaignList } from "@/redux/services/campaign/campaignSlice";
import { AllCampaignResponse } from "@/constants/config";

const useCampaign = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, status } = useSelector(
    (state: RootState) => state.campaign
  );
  const [pagination, setPagination] = useState({ page: 1, size: 100 });

  useEffect(() => {
    dispatch(handleFetchAllCampaignList({ pagination }));
  }, [dispatch, pagination]);

  const handleLoadCampaign =
    useCallback(async (): Promise<AllCampaignResponse | void> => {
      try {
        await dispatch(handleFetchAllCampaignList({ pagination }));
      } catch (err) {
        console.error("Failed to load Campaigns:", err);
      }
    }, [dispatch]);

  return {
    campaigns,
    loading: status === "loading",
    pagination,
    setPagination,
    handleLoadCampaign,
  };
};

export default useCampaign;
