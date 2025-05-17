import { useState } from "react";
import Cookies from "js-cookie";
const API_URL = `${process.env.NEXT_PUBLIC_CLARYLISK_BACKEND || ""}/custom-api/ai/ai-clarylisk`;

export const useGetRiskMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isRisk, setIsRisk] = useState<boolean | null>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token");
  const checkRisk = async (text: string) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setIsRisk(null);
    setData(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const result = await res.json();
      setData(result);
      // Perbaiki key sesuai API: predixted_label
      const risk = result?.predixted_label === 1;
      setIsRisk(risk);
      return { isRisk: risk, isError: false };
    } catch (e: any) {
      setIsError(true);
      setError(e?.message || "Unknown error");
      return { isRisk: null, isError: true };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isError, isRisk, data, error, checkRisk };
};
