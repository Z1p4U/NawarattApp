import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCampaignList } from "@/redux/services/campaign/campaignSlice";

const useCampaign = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, status } = useSelector(
    (state: RootState) => state.campaign
  );
  const [pagination, setPagination] = useState({ page: 1, size: 100 });

  useEffect(() => {
    dispatch(handleFetchAllCampaignList({ pagination }));
  }, [dispatch, pagination]);

  return {
    campaigns,
    loading: status === "loading",
    pagination,
    setPagination,
  };
};

export default useCampaign;
