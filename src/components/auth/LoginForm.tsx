import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Input, Button } from "antd";

type LoginData = {
    login: string;
    hashed_password: string;
};

const LoginForm = () => {
    const { register, handleSubmit, watch } = useForm<LoginData>();
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTime, setBlockTime] = useState(0);
    const { loginMutation } = useAuth();

    const login = watch("login");
    const hashed_password = watch("hashed_password");
    const isFormFilled = login && hashed_password;

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
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
                <label>Login</label>
                <Input
                    {...register("login")}
                    placeholder="Loginni kiriting"
                    disabled={isBlocked}
                />
            </div>
            <div className="form-group">
                <label>Parol</label>
                <Input.Password
                    {...register("hashed_password")}
                    placeholder="Parolni kiriting"
                    disabled={isBlocked}
                />
            </div>
            {isBlocked && (
                <div className="block-message">
                    Bloklangan vaqt: {blockTime} soniya
                </div>
            )}
            <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                disabled={!isFormFilled || isBlocked || loginMutation.isLoading}
            >
                {loginMutation.isLoading ? "Kirish..." : "Kirish"}
            </Button>
        </form>
    );
};

export default LoginForm;
