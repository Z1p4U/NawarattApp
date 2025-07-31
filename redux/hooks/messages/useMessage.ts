import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  clearMessageState,
  loadChatMessages,
} from "@/redux/services/messages/messageSlice";

const useMessage = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    chatMessages,
    status: chatMessageStatus,
    totalChatMessage,
  } = useSelector((state: RootState) => state.message);
  const [pagination, setPagination] = useState({ page: 1, size: 12 });

  useEffect(() => {
    dispatch(clearMessageState());
    setPagination({ page: 1, size: 10 });
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadChatMessages({ id, pagination }));
  }, [dispatch, pagination]);

  const loadMore = useCallback(() => {
    if (chatMessageStatus != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [chatMessageStatus, chatMessages.length, totalChatMessage]);

  const reset = useCallback(() => {
    dispatch(clearMessageState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = chatMessages.length < totalChatMessage;

  const loading = chatMessageStatus === "loading";

  return {
    chatMessages,
    loading,
    pagination,
    setPagination,
    loadMore,
    hasMore,
    reset,
  };
};

export default useMessage;
