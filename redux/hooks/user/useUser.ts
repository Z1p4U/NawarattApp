import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  handleFetchProfile,
  handleFetchUpdateProfile,
} from "@/redux/services/user/userSlice";
import { ProfilePayload } from "@/constants/config";

const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profileResponse = useSelector((state: RootState) => state.user);
  const profileDetail = profileResponse?.profile;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetail = async () => {
      setLoading(true);

      console.log("doing");

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

        return response;
      } catch (err) {
        console.error("Failed to update profile:", err);
      }
    },
    [dispatch]
  );

  return {
    profileDetail,
    loading,
    updateProfile,
  };
};

export default useUser;
