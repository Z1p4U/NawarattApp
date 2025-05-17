import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CityResponse,
  CountryResponse,
  PaginationPayload,
  StateResponse,
} from "@/constants/config";
import {
  fetchAllCities,
  fetchAllCountries,
  fetchAllStates,
} from "@/redux/api/location/locationApi";

/** --------------- State Interfaces --------------- **/
interface CountryState {
  countries: CountryResponse | null;
  states: StateResponse | null;
  cities: CityResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/** --------------- Initial State --------------- **/
const initialState: CountryState = {
  countries: null,
  states: null,
  cities: null,
  status: "idle",
  error: null,
};

/** --------------- Async Thunks --------------- **/

// Fetch All Countries
export const handleFetchAllCountries = createAsyncThunk<
  CountryResponse,
  { pagination: PaginationPayload },
  { rejectValue: string }
>("location/fetchAllCountries", async ({ pagination }, { rejectWithValue }) => {
  try {
    const response = await fetchAllCountries(pagination);
    // console.log("Country List Fetching success:", response);
    return response;
  } catch (error: any) {
    console.error("Country List Fetching error:", error);
    return rejectWithValue(error.response?.data || "Failed to fetch countries");
  }
});

// Fetch All States
export const handleFetchAllStates = createAsyncThunk<
  StateResponse,
  { pagination: PaginationPayload; countryId: number | null | undefined },
  { rejectValue: string }
>(
  "location/fetchAllStates",
  async ({ pagination, countryId }, { rejectWithValue }) => {
    try {
      const response = await fetchAllStates(pagination, countryId);
      // console.log("State List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("State List Fetching error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch States");
    }
  }
);

// Fetch All Cities
export const handleFetchAllCities = createAsyncThunk<
  CityResponse,
  {
    pagination: PaginationPayload;
    countryId: number | null | undefined;
    stateId: number | null | undefined;
  },
  { rejectValue: string }
>(
  "location/fetchAllCities",
  async ({ pagination, countryId, stateId }, { rejectWithValue }) => {
    try {
      const response = await fetchAllCities(pagination, countryId, stateId);
      // console.log("City List Fetching success:", response);
      return response;
    } catch (error: any) {
      console.error("City List Fetching error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch Cities");
    }
  }
);

/** --------------- Slice --------------- **/
const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearLocationState(state) {
      state.status = "idle";
      state.error = null;
      state.countries = [];
      state.states = [];
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Countries
      .addCase(handleFetchAllCountries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.countries = action.payload;
      })
      .addCase(handleFetchAllCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Country list fetch failed";
      })

      // Fetch All States
      .addCase(handleFetchAllStates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllStates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.states = action.payload;
      })
      .addCase(handleFetchAllStates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "State list fetch failed";
      })

      // Fetch All Cities
      .addCase(handleFetchAllCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleFetchAllCities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.cities = action.payload;
      })
      .addCase(handleFetchAllCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "City list fetch failed";
      });
  },
});

/** --------------- Exports --------------- **/
export const { clearLocationState } = locationSlice.actions;
export default locationSlice.reducer;
