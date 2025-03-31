import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchProfile } from "@/redux/services/user/userSlice";
import useAuth from "../auth/useAuth";

const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profileResponse = useSelector((state: RootState) => state.user);
  const profileDetail = profileResponse?.profile;
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfileDetail = async () => {
      if (!token) return; // Prevent calling dispatch with null

      setLoading(true); // Ensure loading state is set before fetching
      await dispatch(handleFetchProfile(token));
      setLoading(false);
    };

    fetchProfileDetail();
  }, [dispatch, token]);

  return {
    profileDetail,
    loading,
  };
};

export default useUser;
