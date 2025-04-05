import API from "../services/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useStore } from "./useStore";

type LoginData = {
  login: string;
  hashed_password: string;
};

const login = async ({ login, hashed_password }: LoginData) => {
  try {
    const response = await API.post("/auth/login", { login, hashed_password });
   
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Login muvaffaqiyatsiz tugadi!");
    }

    return response.data;
  } catch (error: any) {
    console.error("Login xatosi:", error);
    throw error;
  }
};

const useAuth = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();

  // Fetch user profile
  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      const response = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }, 
      });
      return response.data;
    },
    enabled: !!localStorage.getItem("token"),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (!data?.accessToken) {
        message.error("Login ma'lumotlari noto'g'ri qaytdi!");
        return;
      }
      localStorage.setItem("token", data.accessToken);
      setUser(userProfile);
      navigate("/");
      message.success("Muvaffaqiyatli tizimga kirdingiz!");
    },
    onError: (error: any) => {
      console.error("Tizimga kirishda xatolik:", error);

      if (error?.response?.status === 400) {
        console.log(error.response.data);
      } else if (error?.response?.status === 403) {
        message.warning("Siz faol emassiz. Iltimos, do'kon bilan bog'laning!");
      } else {
        message.error("Kirishda xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    message.info("Tizimdan chiqdingiz.");
  };

  return {
    loginMutation,
    logout,
    userProfile,
    loadingProfile
  };
};

export default useAuth;
