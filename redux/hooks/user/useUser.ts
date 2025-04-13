import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchProfile } from "@/redux/services/user/userSlice";

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

  return {
    profileDetail,
    loading,
  };
};

export default useUser;
