export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  drivingLicense?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  createdAt: string;
}