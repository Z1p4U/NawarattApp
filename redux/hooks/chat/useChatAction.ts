import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { createChat, loadChats } from "@/redux/services/chat/chatSlice";
import type { ChatPayload, MessageResponse } from "@/constants/config";

const useChatAction = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectChatState = useMemo(() => (state: RootState) => state.chat, []);
  const { status, error } = useSelector(selectChatState, shallowEqual);

  const handleCreateChat = useCallback(
    async (payload: ChatPayload): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(createChat(payload)).unwrap();

        await dispatch(loadChats({ pagination: { page: 1, size: 10 } }));

        return response;
      } catch (err) {
        console.error("Failed to create chat:", err);
      }
    },
    [dispatch]
  );

  return {
    status,
    error,
    createChat: handleCreateChat,
  };
};

export default useChatAction;
