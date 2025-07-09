import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  handleFetchProfile,
  handleFetchUpdateProfile,
} from "@/redux/services/user/userSlice";
import { ProfilePayload, ProfileResponse } from "@/constants/config";

const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profileResponse = useSelector((state: RootState) => state.user);
  const profileDetail = profileResponse?.profile;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetail = async () => {
      setLoading(true);
      const res = await dispatch(handleFetchProfile());
      setLoading(false);
      return res;
    };
    fetchProfileDetail();
  }, [dispatch]);

  const updateProfile = useCallback(
    async (payload: ProfilePayload) => {
      try {
        const response = await dispatch(
          handleFetchUpdateProfile(payload)
        ).unwrap();
        await dispatch(handleFetchProfile());

        return response;
      } catch (err) {
        console.error("Failed to update profile:", err);
      }
    },
    [dispatch]
  );

  const handleLoadOrderProfile =
    useCallback(async (): Promise<ProfileResponse | void> => {
      try {
        await dispatch(handleFetchProfile());
      } catch (err) {
        console.error("Failed to load order:", err);
      }
    }, [dispatch]);

  return {
    profileDetail,
    loading,
    updateProfile,
    handleLoadOrderProfile,
  };
};

export default useUser;
