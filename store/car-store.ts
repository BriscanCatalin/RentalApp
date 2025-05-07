import { create } from "zustand";
import { CarFilter, Car, CarType, FuelType, TransmissionType } from "@/types/car";
import { filterCars, getCarById, getCarsByType, getPopularCars, getRecommendedCars, cars } from "@/mocks/cars";

interface CarState {
  filter: CarFilter;
  cars: Car[];
  userCars: Car[];
  isLoading: boolean;
  error: string | null;
  setFilter: (filter: Partial<CarFilter>) => void;
  resetFilter: () => void;
  fetchCars: () => void;
  fetchCarById: (id: string) => Promise<Car | undefined>;
  getUserCars: () => Car[];
  addUserCar: (carData: Partial<Car>) => void;
  updateUserCar: (id: string, carData: Partial<Car>) => void;
  deleteUserCar: (id: string) => void;
}

export const useCarStore = create<CarState>((set, get) => ({
  filter: {
    type: null,
    priceRange: null,
    transmission: null,
    fuelType: null,
    seats: null,
    searchQuery: null,
  },
  cars: [],
  userCars: [],
  isLoading: false,
  error: null,
  
  setFilter: (newFilter) => {
    set(state => ({
      filter: {
        ...state.filter,
        ...newFilter
      }
    }));
  },
  
  resetFilter: () => {
    set({
      filter: {
        type: null,
        priceRange: null,
        transmission: null,
        fuelType: null,
        seats: null,
        searchQuery: null,
      }
    });
  },
  
  fetchCars: () => {
    const { filter } = get();
    set({ isLoading: true, error: null });
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Apply filters to get filtered cars
        const filteredCars = filterCars(filter);
        
        set({ 
          cars: filteredCars,
          isLoading: false 
        });
      } catch (error) {
        set({ 
          error: "Failed to fetch cars. Please try again.", 
          isLoading: false,
          cars: []
        });
      }
    }, 500);
  },
  
  fetchCarById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call to fetch a specific car
      const car = getCarById(id);
      
      if (!car) {
        set({ error: "Car not found", isLoading: false });
        return undefined;
      } else {
        set({ isLoading: false });
        return car;
      }
    } catch (error) {
      set({ error: "Failed to fetch car details. Please try again.", isLoading: false });
      return undefined;
    }
  },

  getUserCars: () => {
    const { userCars } = get();
    
    // If we already have user cars, return them
    if (userCars.length > 0) {
      return userCars;
    }
    
    // Otherwise, initialize with some mock data
    // In a real app, this would fetch the user's cars from the backend
    const initialUserCars = cars.filter((car, index) => index % 4 === 0);
    set({ userCars: initialUserCars });
    return initialUserCars;
  },

  addUserCar: (carData) => {
    set(state => {
      // Generate a unique ID
      const id = `user-car-${Date.now()}`;
      
      // Create a new car with default values and user-provided data
      const newCar: Car = {
        id,
        make: carData.make || "Unknown",
        model: carData.model || "Model",
        year: carData.year || new Date().getFullYear(),
        type: (carData.type as CarType) || "Sedan",
        fuelType: (carData.fuelType as FuelType) || "Gasoline",
        transmission: (carData.transmission as TransmissionType) || "Automatic",
        seats: carData.seats || 5,
        pricePerDay: carData.pricePerDay || 100,
        location: carData.location || "Your Location",
        rating: 0,
        reviewCount: 0,
        images: [
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
        ],
        features: ["Added by you", "Custom car"],
        available: true,
        description: carData.description || `Your ${carData.make} ${carData.model} is now available for rent.`,
      };
      
      // Add to user's cars
      const updatedUserCars = [...state.userCars, newCar];
      
      return { userCars: updatedUserCars };
    });
  },

  updateUserCar: (id, carData) => {
    set(state => {
      const updatedUserCars = state.userCars.map(car => {
        if (car.id === id) {
          return { ...car, ...carData };
        }
        return car;
      });
      
      return { userCars: updatedUserCars };
    });
  },

  deleteUserCar: (id) => {
    set(state => {
      const updatedUserCars = state.userCars.filter(car => car.id !== id);
      return { userCars: updatedUserCars };
    });
  }
}));