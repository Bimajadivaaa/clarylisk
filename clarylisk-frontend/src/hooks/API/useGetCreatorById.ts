// hooks/useCreatorById.ts
import { CLARYLISK_BACKEND } from "@/config/const";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Wallet {
  walletAdress: string;
}

interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

interface Image {
  image: string;
}

interface Creator {
  idUser: number;
  username: string;
  role: string;
  description: string;
  wallet: Wallet[];
  medsos: SocialMedia[];
  image: Image[];
}

export const useCreatorById = (creatorId: number | string) => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreator = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${CLARYLISK_BACKEND}/custom-api/creators/${creatorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("@useCreatorById creatorId", creatorId);

      if (!response.ok) {
        throw new Error(`Failed to fetch creator with ID ${creatorId}`);
      }

      const data: Creator = await response.json();
      console.log("creator", data);
      setCreator(data);
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (creatorId) {
      fetchCreator();
    }
  }, [creatorId]);

  const refreshCreator = () => {
    return fetchCreator();
  };

  return {
    creator,
    isLoading,
    error,
    refreshCreator,
  };
};
