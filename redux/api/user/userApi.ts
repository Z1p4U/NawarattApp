import axios from "axios";
import config from "@/config/environment";

export interface ProfileResponse {
  name: string;
  shop: string;
}

const fetchProfile = async (token): Promise<ProfileResponse> => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get<ProfileResponse>(
      `${config.API_URL}/profile`,
      { headers }
    );
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

export { fetchProfile };
