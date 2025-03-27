export interface UserDatabase {
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    image: string | null;
    is_active: boolean;
    login: string;
    phone_number: string;
    pin_code: number;
    wallet: string;
  },
  message: string;
  status_code: number
}