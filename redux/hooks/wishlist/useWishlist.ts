import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  clearWishlistState,
  handleFetchAllWishList,
} from "@/redux/services/wishlist/wishlistSlice";

const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlists, status, total } = useSelector(
    (state: RootState) => state.wishlist
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    dispatch(handleFetchAllWishList({ pagination }));
  }, [dispatch, pagination]);

  const loadMore = useCallback(() => {
    if (status != "loading") {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [status, wishlists.length, total]);

  const reset = useCallback(() => {
    dispatch(clearWishlistState());
    setPagination({ page: 1, size: 20 });
  }, []);

  const hasMore = wishlists.length < total;

  const isInWishlist = useCallback(
    (productId: number): boolean =>
      wishlists?.some((item: any) => item?.product?.id === productId) ?? false,
    [wishlists]
  );

  // console.log("Current wishlist length:", wishlists?.length);

  return {
    wishlists,
    loading: status === "loading",
    total,
    hasMore,
    isInWishlist,
    loadMore,
    reset,
  };
};

export default useWishlist;
