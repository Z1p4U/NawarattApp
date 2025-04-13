import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllWishList } from "@/redux/services/wishlist/wishlistSlice";

const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlists, status } = useSelector(
    (state: RootState) => state.wishlist
  );
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  useEffect(() => {
    console.log("doing");
    dispatch(handleFetchAllWishList({ pagination }));
  }, [dispatch, pagination]);

  const loading = status === "loading";

  const loadMoreWishlists = () => {
    if (!loading) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const isInWishlist = useCallback(
    (productId: number): boolean =>
      wishlists?.some((item: any) => item?.product?.id === productId) ?? false,
    [wishlists]
  );

  // console.log("Current wishlist length:", wishlists?.length);

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
