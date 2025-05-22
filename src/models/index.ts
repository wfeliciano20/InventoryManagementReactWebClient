export interface AuthResponse {
  token: string;
  refreshToken: string;
  userName: string;
  message?: string;
}

export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: { name?: string } | null;
  login: (token: string, refreshToken: string, userName: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  userId?: string;
  __v?: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  retypePassword?: string;
}
