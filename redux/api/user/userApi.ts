import axiosInstance from "@/constants/axios";
import {
  ProfilePayload,
  ProfileResponse,
  ProfileUpdateResponse,
} from "@/constants/config";
import environment from "@/constants/environment";

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

const fetchUpdateProfile = async (
  payload: ProfilePayload
): Promise<ProfileUpdateResponse> => {
  try {
    console.log({ ...payload });

    const response = await axiosInstance.put<ProfileUpdateResponse>(
      `/profile/update`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Failed to add profile data:", error);
    throw error;
  }
};

export { fetchProfile, fetchUpdateProfile };
