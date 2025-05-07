import { Booking } from "@/types/booking";

export const bookings: Booking[] = [
  {
    id: "b1",
    carId: "1",
    userId: "u1",
    startDate: "2023-11-15",
    endDate: "2023-11-18",
    totalPrice: 897,
    status: "completed",
    createdAt: "2023-11-10T10:30:00Z"
  },
  {
    id: "b2",
    carId: "3",
    userId: "u1",
    startDate: "2023-12-20",
    endDate: "2023-12-27",
    totalPrice: 1393,
    status: "confirmed",
    createdAt: "2023-12-05T14:45:00Z"
  },
  {
    id: "b3",
    carId: "5",
    userId: "u1",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    totalPrice: 458,
    status: "pending",
    createdAt: "2024-01-02T09:15:00Z"
  }
];

export const getBookingsByUserId = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

export const getBookingById = (id: string): Booking | undefined => {
  return bookings.find(booking => booking.id === id);
};

export const getActiveBookings = (userId: string): Booking[] => {
  return bookings.filter(booking => 
    booking.userId === userId && 
    (booking.status === "confirmed" || booking.status === "active")
  );
};

export const getPastBookings = (userId: string): Booking[] => {
  return bookings.filter(booking => 
    booking.userId === userId && 
    booking.status === "completed"
  );
};