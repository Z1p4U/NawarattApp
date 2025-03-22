import { useCallback, useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAllProductList } from "@/redux/services/product/productSlice";

const useProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const productResponse = useSelector((state: RootState) => state.product);
  const products = productResponse?.products;
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  console.log(name);

  useEffect(() => {
    const fetchAllProducts = async () => {
      dispatch(handleFetchAllProductList({ name, pagination }));
      setLoading(false);
    };
    fetchAllProducts();
  }, [dispatch, pagination, name]);

  return {
    products,
    loading,
    pagination,
    setPagination,
    name,
    setName,
  };
};

export default useProduct;
