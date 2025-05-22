import axios from "axios";
import type { AuthFormData, AuthResponse, InventoryItem } from "../models";

const API_BASE_URL =
  "https://inventorymanagementwebapi-hcbrgef9g9e6hnh5.canadacentral-01.azurewebsites.net/api";

// create an axios client that will allow us to build all request and create interceptors.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Intercept the requests and add the token as a bearer auth header if the token is available
apiClient.interceptors.request.use(
  (config) => {
    // Try and get the token from local storage
    const token = localStorage.getItem("authToken");

    if (token) {
      // if the token is present add it to the header auth as a bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    // if the token was present now the headers are modified other wise they stay the same
    return config;
  },

  (error) => {
    // throw the error as a rejected promise
    return Promise.reject(error);
  }
);

// Refresh Token Intenceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // save the original request
    const originalRequest = error.config;
    // check if the request status was 401 and there has not been a retry
    if (error.response.status === 401 && !originalRequest._retry) {
      // set retry to true
      originalRequest._retry = true;
      // get the refresh token
      const refreshToken = localStorage.getItem("authRefreshToken");
      if (refreshToken) {
        try {
          // send the request to refresh token to get the
          const res = await apiClient.post("/refresh-token", {
            refreshToken,
          });
          // get the new jwt token
          const newToken = res.data.token;
          // get the new refresh token
          const newRefreshToken = res.data.token;
          // store the tokens on localstorage
          localStorage.setItem("authToken", newToken);
          localStorage.setItem("authRefreshToken", newRefreshToken);
          // add the new token to the original request header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // retry the original request
          return apiClient(originalRequest);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Registers a new user with the provided user data.
 *
 * @param {AuthFormData} userData - The user data to register, including name, email, and password.
 * @returns {Promise<AuthResponse>} A promise that resolves to the authentication response containing the token and refresh token and username.
 * @throws {Error} If the registration request fails.
 */
export const registerUser = async (userData: AuthFormData) => {
  const res = await apiClient.post<AuthResponse>("/register", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  return res.data;
};

/**
 * Authenticates a user with the provided credentials.
 * @param credentials - The authentication data containing username and password.
 * @returns A promise that resolves to the authentication response containing user data and token.
 * @throws Will throw an error if the authentication fails.
 */
export const loginUser = async (
  credentials: AuthFormData
): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>("/login", credentials);
  return res.data;
};

/**
 * Fetches a list of inventory items from the API.
 *
 * @returns {Promise<InventoryItem[]>} A promise that resolves to an array of inventory items.
 * @throws {Error} If the API request fails.
 */
export const getInventoryItems = async () => {
  const res = await apiClient.get<InventoryItem[]>("/inventory-items");
  return res.data;
};

/**
 * Retrieves an inventory item by its unique identifier.
 *
 * @param {string} itemId - The unique identifier of the inventory item to retrieve.
 * @returns {Promise<InventoryItem>} A promise that resolves to the requested inventory item.
 */
export const getInventoryItemById = async (itemId: string) => {
  const res = await apiClient.get<InventoryItem>(`/inventory-items/${itemId}`);
  return res.data;
};

/**
 * Creates a new inventory item with the provided data.
 *
 * @param itemData - The data for the new inventory item, including name and quantity.
 * @returns A promise that resolves to the created inventory item.
 * @throws Will throw an error if the creation fails.
 */
export const createInventoryItem = async (itemData: {
  name: string;
  quantity: number;
}) => {
  const res = await apiClient.post<InventoryItem>("/inventory-items", itemData);
  return res.data;
};

/**
 * Updates an inventory item with the specified ID and data.
 *
 * @param itemId - The unique identifier of the inventory item to update.
 * @param itemData - The data to update the inventory item with, including optional name and quantity.
 * @returns A promise that resolves to the updated inventory item.
 */
export const updateInventoryItem = async (
  itemId: string,
  itemData: { name?: string; quantity?: number }
) => {
  const res = await apiClient.put<InventoryItem>(
    `/inventory-items/${itemId}`,
    itemData
  );
  return res.data;
};
/**
 * @param {string} itemId - The ID of the inventory item to delete.
 * @returns {Promise<void>} A promise that resolves when the item is successfully deleted.
 * @throws {Error} If the deletion fails or the item is not found.
 */
export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  const res = await apiClient.delete(`/inventory-items/${itemId}`);
  return res.data;
};
