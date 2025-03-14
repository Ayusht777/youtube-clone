export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  success: boolean;
  errors?: Array<ErrorDetail>;
  data: null;
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
