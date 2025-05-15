import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadAddressDetail } from "@/redux/services/address/addressSlice";

const useAddressDetail = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const addressResponse = useSelector((state: RootState) => state.address);
  const addressDetail = addressResponse?.addressDetail;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddressDetail = async () => {
      dispatch(loadAddressDetail(id));
      setLoading(false);
    };
    fetchAddressDetail();
  }, [dispatch, id]);

  return {
    addressDetail,
    loading,
  };
};

export default useAddressDetail;
