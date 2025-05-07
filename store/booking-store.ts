import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking, BookingStatus } from "@/types/booking";
import { getActiveBookings, getBookingById, getBookingsByUserId, getPastBookings } from "@/mocks/bookings";
import { getCarById } from "@/mocks/cars";

interface BookingState {
  currentBooking: {
    carId: string | null;
    startDate: string | null;
    endDate: string | null;
    totalPrice: number | null;
  };
  isLoading: boolean;
  error: string | null;
  setBookingDates: (startDate: string, endDate: string) => void;
  setBookingCar: (carId: string, pricePerDay: number) => void;
  resetBooking: () => void;
  createBooking: () => Promise<string | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentBooking: {
        carId: null,
        startDate: null,
        endDate: null,
        totalPrice: null,
      },
      isLoading: false,
      error: null,
      
      setBookingDates: (startDate, endDate) => {
        set(state => {
          const { currentBooking } = state;
          const days = calculateDays(startDate, endDate);
          
          // Recalculate total price if we have a car selected
          let totalPrice = null;
          if (currentBooking.carId) {
            const car = getCarById(currentBooking.carId);
            if (car) {
              // Calculate total price based on car price per day and number of days
              totalPrice = car.pricePerDay * days + 25; // Adding $25 service fee
            }
          }
          
          return {
            currentBooking: {
              ...currentBooking,
              startDate,
              endDate,
              totalPrice
            }
          };
        });
      },
      
      setBookingCar: (carId, pricePerDay) => {
        set(state => {
          const { currentBooking } = state;
          let totalPrice = null;
          
          // Calculate total price if we have dates selected
          if (currentBooking.startDate && currentBooking.endDate) {
            const days = calculateDays(currentBooking.startDate, currentBooking.endDate);
            totalPrice = pricePerDay * days + 25; // Adding $25 service fee
          }
          
          return {
            currentBooking: {
              ...currentBooking,
              carId,
              totalPrice
            }
          };
        });
      },
      
      resetBooking: () => {
        set({
          currentBooking: {
            carId: null,
            startDate: null,
            endDate: null,
            totalPrice: null,
          }
        });
      },
      
      createBooking: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { currentBooking } = get();
          
          // Validate booking data
          if (!currentBooking.carId || !currentBooking.startDate || !currentBooking.endDate || !currentBooking.totalPrice) {
            set({ error: "Incomplete booking information", isLoading: false });
            return null;
          }
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call to create a booking
          const bookingId = `b${Date.now()}`;
          
          // Reset current booking after successful creation
          set({
            isLoading: false,
            currentBooking: {
              carId: null,
              startDate: null,
              endDate: null,
              totalPrice: null,
            }
          });
          
          return bookingId;
        } catch (error) {
          set({ error: "Booking failed. Please try again.", isLoading: false });
          return null;
        }
      },
      
      cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call to cancel a booking
          set({ isLoading: false });
          
          return true;
        } catch (error) {
          set({ error: "Cancellation failed. Please try again.", isLoading: false });
          return false;
        }
      }
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

// Helper function to calculate days between two dates
function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}