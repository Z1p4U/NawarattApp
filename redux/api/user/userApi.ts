import axiosInstance from "@/constants/axios";
import { ProfileResponse } from "@/constants/config";
import environment from "@/constants/environment";
import axios from "axios";

const fetchProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await axiosInstance.get<ProfileResponse>(
      `${environment.API_URL}/profile`
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

export { fetchProfile };
