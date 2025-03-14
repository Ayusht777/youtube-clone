export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}
export interface ApiError {
  statusCode: number;
  message: string;
  success: boolean;
  errors: unknown[]; // Array of detailed error information
  data: null; // In ApiError.js, data is always null
}

export interface Avatar {
  url: string;
  publicId: string;
}

export interface UserData {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  avatar: Avatar;
  coverImage?: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  fullname: string;
  email: string;
  password: string;
  avatar: File;
}
