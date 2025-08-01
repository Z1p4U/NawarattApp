import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import type { AppDispatch, RootState } from "@/redux/store";
import { createChat, loadChats } from "@/redux/services/chat/chatSlice";

const useChatAction = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectChatState = useMemo(() => (state: RootState) => state.chat, []);
  const { status, error } = useSelector(selectChatState, shallowEqual);

  const createChatAction = useCallback(async (): Promise<void> => {
    await dispatch(createChat()).unwrap();

    await dispatch(loadChats({ pagination: { page: 1, size: 10 } }));
  }, [dispatch]);

  return {
    status,
    error,
    createChat: createChatAction,
  };
};

export default useChatAction;
