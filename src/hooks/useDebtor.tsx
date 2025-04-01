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

  // Qarzdorlarni olish uchun useEffect
  useEffect(() => {
    const fetchDebtors = async () => {
      setLoading(true);
      try {
        const response = await API.get("/debtor");
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

  // Qarzdor qo'shish
  const addDebtor = async (formData: any) => {
    setLoading(true);
    try {
      const response = await API.post("/debtor", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setDebtors((prevDebtors) => [...prevDebtors, response.data]);
      return response.data;
    } catch (err: any) {
      setError("Qarzdorni qo'shishda xatolik yuz berdi");
      if (err.response) {
        setError(err.response.data.error.message || "Noma'lum xatolik");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { debtors, loading, error, addDebtor };
};

export default useDebtor;
