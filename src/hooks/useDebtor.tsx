import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // Fetch all debtors
  const { data: debtors = [], isLoading: loading, error } = useQuery({
    queryKey: ["debtors"],
    queryFn: async () => {
      const response = await API.get("/debtor");
      return response.data?.data || [];
    },
  });

  // Add a new debtor
  const addDebtorMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await API.post("/debtor", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data.data;
    },
    onSuccess: (newDebtor) => {
      queryClient.setQueryData(["debtors"], (oldDebtors: Debtor[] = []) => [newDebtor, ...oldDebtors]);
    },
  });

  // Get debtor by ID
  const getDebtorById = (id: string) => {
    return useQuery({
      queryKey: ["debtor", id],
      queryFn: async () => {
        const response = await API.get(`/debtor/${id}`);
        return response.data.data;
      },
      enabled: !!id,
    });
  };

  // Delete debtor
  const deleteDebtorMutation = useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/debtor/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["debtors"], (oldDebtors: Debtor[] = []) => 
        oldDebtors.filter((debtor) => debtor.id !== deletedId)
      );
    },
  });

  return { 
    debtors, 
    loading, 
    error: error as string | null, 
    addDebtor: addDebtorMutation.mutateAsync, 
    refetch: () => queryClient.invalidateQueries({ queryKey: ["debtors"] }),
    getDebtorById,
    deleteDebtor: deleteDebtorMutation.mutateAsync 
  };
};

export default useDebtor;
