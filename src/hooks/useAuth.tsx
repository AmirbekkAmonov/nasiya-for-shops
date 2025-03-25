// import API from "../services/API";
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
// import { useStore } from "./useStore";

// type LoginData = {
//   login: string;
//   hashed_password: string;
// };

// const login = async ({ login, hashed_password }: LoginData) => {
//   try {
//     const response = await API.post("/auth/login", { login, hashed_password });

//     if (response.status !== 201) { 
//       throw new Error("Login muvaffaqiyatsiz tugadi!");
//     }

//     return response.data;
//   } catch (error: any) {
//     console.error("Login xatosi:", error);
//     throw error;
//   }
// };

// const useAuth = () => {
//   const navigate = useNavigate();
//   const { setUser } = useStore();

//   const loginMutation = useMutation({
//     mutationFn: login,
//     onSuccess(data) {
//       if (!data?.token || !data?.user) {
//         message.error("Login ma’lumotlari noto‘g‘ri qaytdi!");
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setUser(data.user);
//       navigate("/");
//       message.success("Muvaffaqiyatli tizimga kirdingiz!");
//     },
//     onError(error: any) {
//       console.error("Tizimga kirishda xatolik:", error);

//       if (error?.response?.status === 400) {
//         message.error("Login yoki parol noto‘g‘ri!");
//       } else if (error?.response?.status === 403) {
//         message.warning("Siz faol emassiz. Iltimos, do‘kon bilan bog‘laning!");
//       } else {
//         message.error("Kirishda xatolik yuz berdi. Qayta urinib ko‘ring.");
//       }
//     },
//   });

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//     message.info("Tizimdan chiqdingiz.");
//   };

//   return {
//     loginMutation,
//     logout,
//   };
// };

// export default useAuth;



import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useStore } from "./useStore";

type LoginData = {
  login: string;
  hashed_password: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

type User = {
  id: number;
  name: string;
  username: string; 
  role: string;
};

const VALID_CREDENTIALS = {
  login: "amirbek",
  hashed_password: "amirbek",
};

const login = async ({ login, hashed_password }: LoginData): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        login === VALID_CREDENTIALS.login &&
        hashed_password === VALID_CREDENTIALS.hashed_password
      ) {
        const user: User = {
          id: 1,
          name: "amirbek",
          username: "amirbek", 
          role: "admin",
        };
        const token = "fake-jwt-token";

        resolve({ token, user });
      } else {
        reject(new Error("Login yoki parol noto‘g‘ri!"));
      }
    }, 1000); 
  });
};

const useAuth = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();

  const loginMutation = useMutation<AuthResponse, Error, LoginData>({
    mutationFn: login,
    onSuccess(data) {
      if (!data?.token || !data?.user) {
        message.error("Login ma’lumotlari noto‘g‘ri qaytdi!");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
      message.success("Muvaffaqiyatli tizimga kirdingiz!");
    },
    onError(error) {
      console.error("Tizimga kirishda xatolik:", error);
      message.error(error.message);
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
  };
};

export default useAuth;
