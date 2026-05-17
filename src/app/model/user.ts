export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  gender?: string;
  role?: string | null;
}