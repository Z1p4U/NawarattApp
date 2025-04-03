import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { handleToggleWishlist } from "@/redux/services/wishlist/wishlistSlice";
import useAuth from "../auth/useAuth";

const useWishlistProcess = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAuth();

  const toggleWishlist = useCallback(
    async (id: number | null) => {
      try {
        const response = await dispatch(
          handleToggleWishlist({ token, id })
        ).unwrap();
        return response;
      } catch (error: any) {
        console.error("Failed to process:", error);
        throw error.error || "Processing failed";
      }
    },
    [dispatch]
  );

  return {
    toggleWishlist,
  };
};

export default useWishlistProcess;
