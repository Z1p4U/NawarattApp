import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import type {
  ChatMessagePayload,
  ChatPayload,
  MessageResponse,
} from "@/constants/config";
import {
  createChatMessage,
  loadChatMessages,
} from "@/redux/services/messages/messageSlice";

const useMessageAction = (id: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const selectMessageState = useMemo(
    () => (state: RootState) => state.chat,
    []
  );
  const { status, error } = useSelector(selectMessageState, shallowEqual);

  const handleSendChat = useCallback(
    async (payload: ChatMessagePayload): Promise<MessageResponse | void> => {
      try {
        const response = await dispatch(
          createChatMessage({ id, payload })
        ).unwrap();

        await dispatch(
          loadChatMessages({ id, pagination: { page: 1, size: 10 } })
        );

        return response;
      } catch (err) {
        console.error("Failed to send chat message:", err);
      }
    },
    [dispatch, id]
  );

  return {
    status,
    error,
    sendChatMessage: handleSendChat,
  };
};

export default useMessageAction;
