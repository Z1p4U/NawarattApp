import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { loadChatDetail } from "@/redux/services/chat/chatSlice";

const useChatDetail = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatResponse = useSelector((state: RootState) => state.chat);
  const chatDetail = chatResponse?.chatDetail;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatDetail = async () => {
      dispatch(loadChatDetail(id));
      setLoading(false);
    };
    fetchChatDetail();
  }, [dispatch, id]);

  return {
    chatDetail,
    loading,
  };
};

export default useChatDetail;
