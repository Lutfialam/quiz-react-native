export interface UserType {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  passwordConfirmation?: string;
  level?: string;
  created_at?: string;
  updated_at?: string;
  errors?: {
    name?: string;
    email?: string;
    image?: string;
    password?: string;
    passwordConfirmation?: string;
    level?: string;
  };
}
