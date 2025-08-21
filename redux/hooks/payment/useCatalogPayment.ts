import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { handleFetchAllCatalogPaymentList } from "@/redux/services/payment/paymentSlice";
import { AllPaymentResponse } from "@/constants/config";

const useCatalogPayment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalogPayment } = useSelector((state: RootState) => state.payment);
  const [pagination, setPagination] = useState({ page: 1, size: 1000 });
  const [loading, setLoading] = useState(false);
  const [is_highlight, setIsHighlight] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchAllPayments = async () => {
      if (loading) return;
      setLoading(true);
      await dispatch(
        handleFetchAllCatalogPaymentList({ pagination, is_highlight })
      );
      setLoading(false);
    };
    fetchAllPayments();
  }, [dispatch, pagination]);

  const handleLoadPaymentList =
    useCallback(async (): Promise<AllPaymentResponse | void> => {
      try {
        await dispatch(
          handleFetchAllCatalogPaymentList({ pagination, is_highlight })
        );
      } catch (err) {
        console.error("Failed to load Payment:", err);
      }
    }, [dispatch]);

  return {
    payments: catalogPayment,
    loading,
    pagination,
    is_highlight,
    setPagination,
    setIsHighlight,
    handleLoadPaymentList,
  };
};

export default useCatalogPayment;
