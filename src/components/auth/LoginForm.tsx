import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Input, Button, Modal } from "antd";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import "../../styles/pages/LoginPage.scss";

type LoginData = {
    login: string;
    hashed_password: string;
};

const LoginForm = () => {
    const { register, handleSubmit, watch } = useForm<LoginData>();
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTime, setBlockTime] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isAdminInfoModalOpen, setAdminInfoModalOpen] = useState(false);
    const { loginMutation } = useAuth();

    const login = watch("login");
    const hashed_password = watch("hashed_password");
    const isFormFilled = login?.length > 0 && hashed_password?.length > 0;

    useEffect(() => {
        if (blockTime > 0) {
            let timer: ReturnType<typeof setTimeout>;
            timer = setTimeout(() => {
                setBlockTime((prev) => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            setIsBlocked(false);
        }
    }, [blockTime]);

    const onSubmit = async (data: LoginData) => {
        try {
            await loginMutation.mutateAsync(data);
        } catch (error) {
            console.error("Login error:", error);
            setIsBlocked(true);
            setBlockTime(30);
        }
    };

    return (
        <div className="LoginPage">
            <div className="authContainer">
                <div className="authImg">
                    <img src="/imgs/login-img.webp" alt="Login" />
                </div>
                <div className="authBox">
                    <div className="authForm">
                        <img className="authLogo" src="/imgs/LOGO.svg" alt="Logo" />
                        <h2>Saytga kirish</h2>
                        <p>Iltimos, tizimga kirish uchun login va parolingizni kiriting.</p>
                        
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="inputGroup">
                                <label>Login</label>
                                <div className="inputWrapper">
                                    <User className="inputIcon" size={20} />
                                    <Input
                                        {...register("login")}
                                        placeholder="Loginni kiriting"
                                        disabled={isBlocked}
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            <div className="inputGroup">
                                <label>Parol</label>
                                <div className="passwordWrapper">
                                    <Lock className="inputIcon2" size={20} />
                                    <Input.Password
                                        {...register("hashed_password")}
                                        placeholder="Parolni kiriting"
                                        disabled={isBlocked}
                                        className="custom-input"
                                        iconRender={(visible) => (
                                            visible ? <EyeOff className="eyeIcon" size={20} /> : <Eye className="eyeIcon" size={20} />
                                        )}
                                    />
                                </div>
                            </div>
                            {isBlocked && (
                                <div className="errorMessage">
                                    Bloklangan vaqt: {blockTime} soniya
                                </div>
                            )}
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="loginButton"
                            >
                                {loginMutation.isLoading ? "Kirish..." : "Kirish"}
                            </Button>
                        </form>

                        <p className="authSwitch">
                            Hisobingiz yo'q bo'lsa, tizimga kirish huquqini olish uchun
                            <button 
                                className="adminLink" 
                                onClick={() => setAdminInfoModalOpen(true)}
                            >
                                do'kon administratori
                            </button>
                            bilan bog'laning.
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                title="Do'kon administratori"
                open={isAdminInfoModalOpen}
                onCancel={() => setAdminInfoModalOpen(false)}
                footer={[
                    <Button 
                        key="ok" 
                        type="primary" 
                        onClick={() => setAdminInfoModalOpen(false)}
                    >
                        Tushunarli
                    </Button>
                ]}
            >
                <p>Hozircha do'kon administratori mavjud emas.</p>
            </Modal>
        </div>
    );
};

export default LoginForm;
