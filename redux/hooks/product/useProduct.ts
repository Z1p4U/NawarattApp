import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductState,
  handleFetchAllProductList,
} from "@/redux/services/product/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

const DEFAULT_PAGE_SIZE = 20;

export default function useProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, totalProduct } = useSelector(
    (s: RootState) => s.product
  );

  const [pagination, setPagination] = useState({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
  });
  const [name, setName] = useState<string>("");
  const [catId, setCatId] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [tagId, setTagId] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Fetch whenever filters or page change:
  useEffect(() => {
    dispatch(
      handleFetchAllProductList({
        pagination,
        category_id: catId,
        brand_id: brandId,
        tag_ids: tagId,
        min_price: minPrice,
        max_price: maxPrice,
        name,
      })
    );
  }, [dispatch, pagination, name, catId, brandId, tagId, minPrice, maxPrice]);

  const loading = status === "loading";
  const hasMore = products.length < totalProduct;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPagination((p) => ({ ...p, page: p.page + 1 }));
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    dispatch(clearProductState());
    setPagination({ page: 1, size: DEFAULT_PAGE_SIZE });
    setName("");
    setCatId(null);
    setBrandId(null);
    setTagId(null);
    setMinPrice(null);
    setMaxPrice(null);
  }, [dispatch]);

  const handleSearch = useCallback(
    (newName: string) => {
      dispatch(clearProductState());
      setPagination({ page: 1, size: 1000 });
      setName(newName);
    },
    [dispatch]
  );

  const handleFilterSubmit = useCallback(
    (
      newCat: string | null,
      newBrand: string | null,
      newTag: string | null,
      newMin: number | null,
      newMax: number | null
    ) => {
      dispatch(clearProductState());
      setPagination({ page: 1, size: 1000 });
      setCatId(newCat);
      setBrandId(newBrand);
      setTagId(newTag);
      setMinPrice(newMin);
      setMaxPrice(newMax);
    },
    [dispatch]
  );

  return {
    products,
    loading,
    hasMore,
    name,
    catId,
    brandId,
    tagId,
    minPrice,
    maxPrice,
    setName,
    setCatId,
    setBrandId,
    setTagId,
    setMinPrice,
    setMaxPrice,
    loadMore,
    reset,
    handleSearch,
    handleFilterSubmit,
  };
}
