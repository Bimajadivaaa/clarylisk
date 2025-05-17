// hooks/useLogin.ts
import { CLARYLISK_BACKEND } from "@/config/const";
import { useState, ChangeEvent } from "react";
import { useWallet } from "../useWallet";
import Cookies from "js-cookie";

interface LoginCredentials {
  walletAddress: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  user?: any;
  message?: string;
}

export const useLogin = () => {
  const { address } = useWallet();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    walletAddress: address as `0x${string}`,
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const setTokenCookie = (token: string) => {
    Cookies.set("token", token, {
      expires: 1 / 24,
      secure: true,
      sameSite: "strict",
    });
  };

  const login = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${CLARYLISK_BACKEND}/custom-api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...credentials,
            walletAddress: address as `0x${string}`,
          }),
        },
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        setTokenCookie(data.token);
      }

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isLoading,
    error,
    isAuthenticated,
    handleChange,
    login,
  };
};
