import { useEffect, useState } from "react";
import API from "../services/API";

interface Debt {
  debt_sum: string;
  debt_status: string;
  total_debt_sum?: string;
}

interface DebtsResponse {
  data: Debt[];
  totalCount: number;
}

const useDebts = (debtorId: string) => {
  const [debts, setDebts] = useState<Debt[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/debts`, {
        params: {
          debtor_id: debtorId,
        },
      });
      console.log("API response:", response); 
      if (response.data?.data) {
        setDebts(response.data.data); 
      } else {
        setDebts([]); 
      }
    } catch (err) {
      console.error("Error fetching debts:", err);
      setError("Qarzdor ma'lumotlarini olishda xatolik yuz berdi"); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debtorId) {
      fetchDebts();
    }
  }, [debtorId]);

  return { debts, loading, error }; 
};

export default useDebts;
