import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../services/API";

interface Debt {
  id: string;
  debt_sum: string;
  debt_status: string;
  total_month: number;
  total_debt_sum?: string;
  created_at: string;
  next_payment_date: string;
}

interface CreateDebtParams {
  next_payment_date: string;
  debt_period: number;
  debt_sum: string;
  total_debt_sum: string;
  description: string;
  images: Array<{ image: string }>;
  debtor: string;
  debt_status: string;
}

const useDebts = (debtorId?: string) => {
  const queryClient = useQueryClient();

  // Fetch all debts for a debtor
  const { data: debts = [], isLoading: loading, error } = useQuery({
    queryKey: ["debts", debtorId],
    queryFn: async () => {
      if (!debtorId) return [];
      const response = await API.get(`/debts`, {
        params: {
          debtor_id: debtorId,
        },
      });
      return response.data?.data || [];
    },
    enabled: !!debtorId,
  });

  // Create a new debt
  const createDebtMutation = useMutation({
    mutationFn: async (debtData: CreateDebtParams) => {
      const response = await API.post("/debts", debtData);
      return response.data?.data;
    },
    onSuccess: (newDebt) => {
      if (debtorId) {
        queryClient.setQueryData(["debts", debtorId], (oldDebts: Debt[] = []) => [newDebt, ...oldDebts]);
      }
    },
  });

  // Fetch a specific debt by ID
  const getDebtById = (debtId: string) => {
    return useQuery({
      queryKey: ["debt", debtId],
      queryFn: async () => {
        const response = await API.get(`/debts/${debtId}`);
        return response.data?.data;
      },
      enabled: !!debtId,
    });
  };

  // Delete debt mutation
  const deleteDebtMutation = useMutation({
    mutationFn: async (debtId: string) => {
      await API.delete(`/debts/${debtId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts", debtorId] });
    },
  });

  // Update debt mutation
  const updateDebtMutation = useMutation({
    mutationFn: async ({ debtId, debtData }: { debtId: string; debtData: Partial<CreateDebtParams> }) => {
      const response = await API.put(`/debts/${debtId}`, debtData);
      return response.data?.data;
    },
    onSuccess: (updatedDebt) => {
      queryClient.setQueryData(["debt", updatedDebt.id], updatedDebt);
      queryClient.invalidateQueries({ queryKey: ["debts", debtorId] });
    },
  });

  return { 
    debts, 
    loading, 
    error: error as string | null, 
    createDebt: createDebtMutation.mutateAsync, 
    getDebtById,
    deleteDebt: deleteDebtMutation.mutateAsync,
    updateDebt: updateDebtMutation.mutateAsync
  };
};

export default useDebts;
