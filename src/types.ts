export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar: string;
  job: string;
  company: string;
  country: string;
  phone: string;
  city: string;
  timezone: string;
  url: string;
  latitude?: number;
  longitude?: number;
  gender?: string;
}
