export type UserRole = 'admin' | 'user';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IUserResponse {
  success?: boolean;
  user?: IUser;
}