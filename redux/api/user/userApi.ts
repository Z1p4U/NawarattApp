import { ProfileResponse } from "@/constants/config";
import environment from "@/constants/environment";
import axios from "axios";

const fetchProfile = async (token: string): Promise<ProfileResponse> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get<ProfileResponse>(
      `${environment.API_URL}/profile`,
      { headers }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

export { fetchProfile };
