export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: CarType;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  pricePerDay: number;
  location: string;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  available: boolean;
  description: string;
}

export type CarType = 
  | "SUV" 
  | "Sports" 
  | "Sedan" 
  | "Coupe" 
  | "Hatchback" 
  | "Convertible" 
  | "Luxury";

export type FuelType = 
  | "Gasoline" 
  | "Diesel" 
  | "Electric" 
  | "Hybrid";

export type TransmissionType = 
  | "Automatic" 
  | "Manual";

export interface CarFilter {
  type?: CarType | null;
  priceRange?: [number, number] | null;
  transmission?: TransmissionType | null;
  fuelType?: FuelType | null;
  seats?: number | null;
  searchQuery?: string | null;
}