import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { clearChatState, loadChats } from "@/redux/services/chat/chatSlice";

const useChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    chats,
    status: chatStatus,
    totalChat,
  } = useSelector((state: RootState) => state.chat);
  const [pagination, setPagination] = useState({ page: 1, size: 12 });

  useEffect(() => {
    dispatch(clearChatState());
    setPagination({ page: 1, size: 10 });
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadChats({ pagination }));
  }, [dispatch, pagination]);

  const loadMore = useCallback(() => {
    if (chatStatus != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [chatStatus, chats.length, totalChat]);

  const reset = useCallback(() => {
    dispatch(clearChatState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = chats.length < totalChat;

  const loading = chatStatus === "loading";

  return {
    chats,
    loading,
    pagination,
    setPagination,
    loadMore,
    hasMore,
    reset,
  };
};

export default useChat;
