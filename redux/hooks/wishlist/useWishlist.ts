import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllWishList } from "@/redux/services/wishlist/wishlistSlice";
import useAuth from "../auth/useAuth";

const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlists, status } = useSelector(
    (state: RootState) => state.wishlist
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });
  const { token } = useAuth();

  useEffect(() => {
    dispatch(handleFetchAllWishList({ token, pagination }));
  }, [dispatch, pagination]);

  // ✅ Loading will be true if Redux status is "loading"
  const loading = status === "loading";

  const loadMoreWishlists = () => {
    if (!loading) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  return {
    wishlists,
    loading,
    pagination,
    setPagination,
    loadMoreWishlists, // ✅ Use this in FlatList `onEndReached`
  };
};

export default useWishlist;
