export interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export type BookingStatus = 
  | "pending" 
  | "confirmed" 
  | "active" 
  | "completed" 
  | "cancelled";