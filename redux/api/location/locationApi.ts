import axiosInstance from "@/constants/axios";
import {
  CityResponse,
  CountryResponse,
  PaginationPayload,
  StateResponse,
} from "@/constants/config";
import environment from "@/constants/environment";

const fetchAllCountries = async (
  pagination: PaginationPayload
): Promise<CountryResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<CountryResponse>(
      `${environment.API_URL}/countries`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    throw error;
  }
};

const fetchAllStates = async (
  pagination: PaginationPayload,
  countryId: number | null | undefined
): Promise<StateResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<StateResponse>(
      `${environment.API_URL}/countries/${countryId}/states`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch states:", error);
    throw error;
  }
};

const fetchAllCities = async (
  pagination: PaginationPayload,
  countryId: number | null | undefined,
  stateId: number | null | undefined
): Promise<CityResponse> => {
  try {
    const params = { ...(pagination || {}) };

    const response = await axiosInstance.get<CityResponse>(
      `${environment.API_URL}/countries/${countryId}/states/${stateId}/cities`,
      { params }
    );

    // console.log(response);
    return response?.data;
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    throw error;
  }
};

export { fetchAllCountries, fetchAllStates, fetchAllCities };
