import { User } from "@/types/user";
import api from "@/services/api";

export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
    drivingLicense: "DL12345678",
    address: "123 Main St",
    city: "New York",
    country: "United States",
    zipCode: "10001",
    createdAt: "2023-01-15T08:30:00Z"
  }
];

export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get("/users/current");
  return res.data;
};