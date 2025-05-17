import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { CLARYLISK_BACKEND } from "@/config/const";

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface Wallet {
  walletAdress: string;
}

export interface ProfileImage {
  image: string;
}

export interface UserProfile {
  idUser: number;
  username: string;
  role: string;
  description: string;
  wallet: Wallet[];
  medsos: SocialMedia[];
  image: ProfileImage[];
  walletAddress?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface ProfileHookResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (): ProfileHookResult => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Creator profile not found, please login again!");
      }

      const response = await fetch(
        `${CLARYLISK_BACKEND}/custom-api/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data: UserProfile = await response.json();
      if (data.wallet && data.wallet.length > 0) {
        data.walletAddress = data.wallet[0].walletAdress;
      }

      if (data.medsos && data.medsos.length > 0) {
        const social = data.medsos[0];
        if (social.facebook && social.facebook !== "optional")
          data.facebook = social.facebook;
        if (social.twitter && social.twitter !== "optional")
          data.twitter = social.twitter;
        if (social.instagram && social.instagram !== "optional")
          data.instagram = social.instagram;
        if (social.youtube && social.youtube !== "optional")
          data.youtube = social.youtube;
      }

      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const refreshProfile = async (): Promise<void> => {
    return fetchProfile();
  };

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
  };
};

export default useProfile;
