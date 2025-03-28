import { useEffect, useState } from "react";
import API from "../services/API";

interface PhoneNumber {
  number: string;
}

interface Debt {
  debt_sum: string; 
  debt_status: string;
  total_debt_sum?: string; 
}

interface Debtor {
  id: string;
  full_name: string;
  phone_numbers: PhoneNumber[];
  address: string;
  description?: string;
  images?: { url: string }[];
  debts: Debt[];
  created_at: string;
  updated_at: string;
}


const useDebtor = () => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const response = await API.get("/debtor?spik=0&take=10");

        console.log("API Response:", response.data);

        if (Array.isArray(response.data?.data)) {
          setDebtors(response.data.data);
        } else {
          setDebtors([]); 
        }
      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  return { debtors, loading, error };
};

export default useDebtor;
