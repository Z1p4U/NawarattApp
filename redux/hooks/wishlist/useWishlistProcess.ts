import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  handleFetchAllWishList,
  handleToggleWishlist,
} from "@/redux/services/wishlist/wishlistSlice";

const useWishlistProcess = () => {
  const dispatch = useDispatch<AppDispatch>();

  const toggleWishlist = useCallback(
    async (id: number) => {
      try {
        const response = await dispatch(handleToggleWishlist({ id })).unwrap();
        await dispatch(
          handleFetchAllWishList({ pagination: { page: 1, size: 20 } })
        );
        return response;
      } catch (error: any) {
        console.error("Failed to process wishlist toggle:", error);
        throw error?.message || "Processing failed";
      }
    },
    [dispatch]
  );

  return {
    toggleWishlist,
  };
};

export default useWishlistProcess;
