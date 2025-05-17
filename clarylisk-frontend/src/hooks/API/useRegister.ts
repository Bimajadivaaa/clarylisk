// hooks/useRegister.ts
import { useState, ChangeEvent } from "react";
import { CLARYLISK_BACKEND } from "@/config/const";
import { useWallet } from "@/hooks/useWallet";
interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  description: string;
  walletAddress: string;
  image: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

interface ApiData {
  username: string;
  password: string;
  walletAddress: string;
  role: string;
  image: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  description: string;
}

interface ValidationErrors {
  [key: string]: string | null;
}

interface RegisterResponse {
  message?: string;
  [key: string]: any;
}

export const useRegister = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    confirmPassword: "",
    description: "",
    walletAddress: "",
    image: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });
  const { address } = useWallet();

  const imageProfile = [
    "https://ipfs.io/ipfs/bafybeigqxsv4tlgr2rnezz5dwndyztvrtxjjn3ergatvu5udf6yng4f7he/1.png",
    "https://ipfs.io/ipfs/bafybeigqxsv4tlgr2rnezz5dwndyztvrtxjjn3ergatvu5udf6yng4f7he/2.png",
    "https://ipfs.io/ipfs/bafybeigqxsv4tlgr2rnezz5dwndyztvrtxjjn3ergatvu5udf6yng4f7he/3.png",
    "https://ipfs.io/ipfs/bafybeigqxsv4tlgr2rnezz5dwndyztvrtxjjn3ergatvu5udf6yng4f7he/4.png",
    "https://ipfs.io/ipfs/bafybeigqxsv4tlgr2rnezz5dwndyztvrtxjjn3ergatvu5udf6yng4f7he/5.png",
    "https://ipfs.io/ipfs/bafybeigqxsv4tlgr2rnezz5dwndyztvrtxjjn3ergatvu5udf6yng4f7he/6.png",
  ];

  const [formStep, setFormStep] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (validationErrors[id]) {
      setValidationErrors((prev) => ({
        ...prev,
        [id]: null,
      }));
    }
  };

  const getRandomImage = (): string => {
    const randomIndex = Math.floor(Math.random() * imageProfile.length);
    return imageProfile[randomIndex];
  };

  const validateStep = (): boolean => {
    const errors: ValidationErrors = {};

    if (formStep === 0) {
      if (!formData.username.trim()) {
        errors.username = "Username is required";
      }

      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (formStep === 1) {
      if (!formData.description.trim()) {
        errors.description = "Description is required";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = (): void => {
    if (validateStep()) {
      setFormStep((prev) => prev + 1);
    }
  };

  const prevStep = (): void => {
    setFormStep((prev) => prev - 1);
  };

  const submitRegistration = async (): Promise<RegisterResponse | null> => {
    if (!validateStep()) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiData: ApiData = {
        username: formData.username,
        password: formData.password,
        walletAddress: address as `0x${string}`,
        role: "creator",
        image: getRandomImage(),
        facebook: formData.facebook || "optional",
        instagram: formData.instagram || "optional",
        twitter: formData.twitter || "optional",
        youtube: formData.youtube || "optional",
        description: formData.description,
      };

      const response = await fetch(
        `${CLARYLISK_BACKEND}/custom-api/user/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        },
      );
      console.log("apiData", response);

      const data: RegisterResponse = await response.json();

      console.log("data", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      setSuccess(true);
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        description: "",
        walletAddress: "",
        image: "",
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
      });
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Something went wrong during registration");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    formStep,
    isLoading,
    error,
    success,
    validationErrors,
    handleChange,
    getRandomImage,
    nextStep,
    prevStep,
    submitRegistration,
    setFormStep,
  };
};
