import apiClient from '@/lib/axios';


export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar: { url: string; publicId: string };
  coverImage: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatar: { url: string; publicId: string };
  coverImage: string;
}

export interface RegisterData {
  email: string;
  password: string;
  userName: string;
  fullName: string;
  avatar: File;
  coverImage?: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ErrorResponse {
    message: string;
    statusCode: number;
    error: [string];
}

// Register a new user
export const registerUser = async (data: RegisterData) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("userName", data.userName);
  formData.append("fullName", data.fullName);
  formData.append("avatar", data.avatar);
  if (data.coverImage) formData.append("coverImage", data.coverImage);

  const response = await apiClient.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Login a user
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post("/users/login", data);
  return response.data.data;
};

// Logout a user
export const logoutUser = async () => {
  const response = await apiClient.post("/users/logout");
  return response.data;
};

// Refresh access token
export const refreshAccessToken = async () => {
  const response = await apiClient.post("/users/refresh-token");
  return response.data.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/users/getCurrentUser");
  return response.data.data;
};

// Update user details
export const updateAccountDetails = async (data: {
  fullName: string;
  email: string;
}) => {
  const response = await apiClient.patch("/users/updateAccountDetails", data);
  return response.data.data;
};

// Update user avatar
export const updateUserAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  const response = await apiClient.patch("/users/updateUserAvatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

// Change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await apiClient.post("/users/change-current-password", data);
  return response.data;
};
