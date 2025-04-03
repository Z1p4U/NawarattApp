import { useCallback, useEffect, useState } from "react";
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
    if (token) {
      dispatch(handleFetchAllWishList({ token, pagination }));
    } else {
      console.log("Token is null, not fetching wishlists");
    }
  }, [dispatch, pagination, token]);

  const loading = status === "loading";

  const loadMoreWishlists = () => {
    if (!loading) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return (
      wishlists?.some((item: any) => item?.product?.id === productId) ?? false
    );
  };

  console.log("Current wishlist length:", wishlists?.length);

  return {
    wishlists,
    loading,
    pagination,
    isInWishlist,
    setPagination,
    loadMoreWishlists,
  };
};

export default useWishlist;
