import { Car, CarFilter, CarType, FuelType, TransmissionType } from "@/types/car";

export const cars: Car[] = [
  {
    id: "1",
    make: "Porsche",
    model: "911 Carrera",
    year: 2023,
    type: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    pricePerDay: 299,
    location: "New York",
    rating: 4.9,
    reviewCount: 124,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1000",
      "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?q=80&w=1000"
    ],
    features: ["GPS", "Bluetooth", "Leather Seats", "Heated Seats", "Parking Sensors", "Backup Camera"],
    available: true,
    description: "Experience the thrill of driving a Porsche 911 Carrera. This iconic sports car offers exceptional handling, breathtaking acceleration, and timeless design. Perfect for weekend getaways or making a statement at special events."
  },
  {
    id: "2",
    make: "Tesla",
    model: "Model S Plaid",
    year: 2023,
    type: "Sedan",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 249,
    location: "Los Angeles",
    rating: 4.8,
    reviewCount: 98,
    images: [
      "https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=1000",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=1000"
    ],
    features: ["Autopilot", "Premium Sound System", "Supercharging", "Heated Seats", "17-inch Display", "Wireless Charging"],
    available: true,
    description: "The Tesla Model S Plaid is the fastest production car ever made. With over 1,000 horsepower and a 0-60 mph time of under 2 seconds, this electric sedan offers unparalleled performance with zero emissions. Enjoy cutting-edge technology and luxurious comfort."
  },
  {
    id: "3",
    make: "Range Rover",
    model: "Sport",
    year: 2023,
    type: "SUV",
    fuelType: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 199,
    location: "Miami",
    rating: 4.7,
    reviewCount: 87,
    images: [
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1000",
      "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?q=80&w=1000",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000"
    ],
    features: ["Panoramic Roof", "Off-Road Capability", "Premium Sound System", "Heated Seats", "360° Camera", "Adaptive Cruise Control"],
    available: true,
    description: "Combine luxury and capability with the Range Rover Sport. This premium SUV offers exceptional comfort for city driving while being ready for any off-road adventure. Featuring advanced technology and refined interiors, it's perfect for both business and pleasure."
  },
  {
    id: "4",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2023,
    type: "Luxury",
    fuelType: "Hybrid",
    transmission: "Automatic",
    seats: 5,
    pricePerDay: 279,
    location: "Chicago",
    rating: 4.9,
    reviewCount: 112,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000",
      "https://images.unsplash.com/photo-1605515298946-d0573716f0e5?q=80&w=1000",
      "https://images.unsplash.com/photo-1549399542-7e8ee8c3a591?q=80&w=1000"
    ],
    features: ["Massage Seats", "Burmester 3D Sound", "MBUX Infotainment", "Ambient Lighting", "Driver Assistance Package", "Rear Entertainment"],
    available: true,
    description: "The Mercedes-Benz S-Class represents the pinnacle of luxury motoring. With its elegant design, state-of-the-art technology, and unmatched comfort, this flagship sedan offers a first-class experience for both driver and passengers. Perfect for executive travel or special occasions."
  },
  {
    id: "5",
    make: "BMW",
    model: "M4 Competition",
    year: 2023,
    type: "Coupe",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 4,
    pricePerDay: 229,
    location: "San Francisco",
    rating: 4.8,
    reviewCount: 76,
    images: [
      "https://images.unsplash.com/photo-1607853554439-0069ec0f29b6?q=80&w=1000",
      "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=1000",
      "https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?q=80&w=1000"
    ],
    features: ["M Sport Differential", "Carbon Fiber Trim", "Harman Kardon Sound", "Sport Seats", "Head-Up Display", "Driving Assistant"],
    available: true,
    description: "Experience the perfect blend of performance and luxury with the BMW M4 Competition. This high-performance coupe delivers exhilarating driving dynamics with its powerful engine and precise handling. The premium interior ensures comfort doesn't take a back seat to performance."
  },
  {
    id: "6",
    make: "Audi",
    model: "R8",
    year: 2023,
    type: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    pricePerDay: 349,
    location: "Las Vegas",
    rating: 4.9,
    reviewCount: 64,
    images: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1000",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1000",
      "https://images.unsplash.com/photo-1610647752706-3bb12232b3e4?q=80&w=1000"
    ],
    features: ["V10 Engine", "Quattro All-Wheel Drive", "Bang & Olufsen Sound", "Carbon Fiber Elements", "Virtual Cockpit", "Performance Mode"],
    available: true,
    description: "The Audi R8 is a true supercar that's surprisingly easy to live with. Its naturally aspirated V10 engine delivers breathtaking performance and an unforgettable soundtrack. With its striking design and everyday usability, the R8 offers a supercar experience without compromise."
  },
  {
    id: "7",
    make: "Lamborghini",
    model: "Huracán",
    year: 2023,
    type: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    pricePerDay: 499,
    location: "Miami",
    rating: 5.0,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1000",
      "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=1000",
      "https://images.unsplash.com/photo-1519245160967-f311648b91c3?q=80&w=1000"
    ],
    features: ["V10 Engine", "Carbon Ceramic Brakes", "Lamborghini Dynamic Steering", "Drive Modes", "Carbon Fiber Interior", "Launch Control"],
    available: true,
    description: "Make a statement with the Lamborghini Huracán. This exotic supercar combines Italian craftsmanship with breathtaking performance. Its aggressive styling and howling V10 engine create an unforgettable driving experience that will turn heads wherever you go."
  },
  {
    id: "8",
    make: "Bentley",
    model: "Continental GT",
    year: 2023,
    type: "Luxury",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 4,
    pricePerDay: 399,
    location: "New York",
    rating: 4.9,
    reviewCount: 58,
    images: [
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1000",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1000"
    ],
    features: ["Handcrafted Interior", "Naim Audio System", "Rotating Display", "Air Suspension", "Massage Seats", "All-Wheel Drive"],
    available: true,
    description: "The Bentley Continental GT represents the perfect blend of luxury and performance. This grand tourer combines handcrafted British craftsmanship with modern technology and impressive power. Ideal for long-distance travel in ultimate comfort and style."
  },
  {
    id: "9",
    make: "Ferrari",
    model: "Roma",
    year: 2023,
    type: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    pricePerDay: 459,
    location: "Los Angeles",
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1000",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000"
    ],
    features: ["V8 Twin-Turbo Engine", "8-Speed Dual-Clutch", "Carbon Fiber Components", "Manettino Dial", "JBL Professional Sound", "Keyless Entry"],
    available: true,
    description: "The Ferrari Roma embodies the concept of the Nuova Dolce Vita, bringing a touch of timeless elegance to the Ferrari lineup. With its sleek design and powerful V8 engine, it delivers the perfect balance of performance and style for the discerning driver."
  },
  {
    id: "10",
    make: "Aston Martin",
    model: "Vantage",
    year: 2023,
    type: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    pricePerDay: 389,
    location: "Miami",
    rating: 4.8,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000",
      "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1000",
      "https://images.unsplash.com/photo-1600712242805-5f78671b24da?q=80&w=1000"
    ],
    features: ["4.0L Twin-Turbo V8", "Electronic Differential", "Adaptive Damping", "Sport Plus Seats", "Premium Audio", "Carbon Fiber Accents"],
    available: true,
    description: "The Aston Martin Vantage is a true sports car with a distinctive character. Its predatory stance, muscular flanks, and minimal overhangs create an athletic appearance that is unmistakably Aston Martin. The perfect car for those who appreciate British engineering and style."
  },
  {
    id: "11",
    make: "Maserati",
    model: "GranTurismo",
    year: 2023,
    type: "Luxury",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 4,
    pricePerDay: 329,
    location: "Las Vegas",
    rating: 4.7,
    reviewCount: 52,
    images: [
      "https://images.unsplash.com/photo-1549925862-990918131e85?q=80&w=1000",
      "https://images.unsplash.com/photo-1549925862-fe5172f24db6?q=80&w=1000",
      "https://images.unsplash.com/photo-1549925862-65d795fb8df7?q=80&w=1000"
    ],
    features: ["Ferrari-built V8", "Sonus Faber Audio", "Italian Leather Interior", "Carbon Fiber Trim", "Adaptive LED Headlights", "Sport Chrono Package"],
    available: true,
    description: "The Maserati GranTurismo combines the comfort of a luxury sedan with the performance of a sports car. Its elegant design, powerful engine, and refined interior make it the perfect grand tourer for long journeys or weekend escapes."
  },
  {
    id: "12",
    make: "Jaguar",
    model: "F-Type R",
    year: 2023,
    type: "Sports",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 2,
    pricePerDay: 269,
    location: "Chicago",
    rating: 4.6,
    reviewCount: 63,
    images: [
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1000",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1000"
    ],
    features: ["5.0L Supercharged V8", "All-Wheel Drive", "Active Sports Exhaust", "Performance Seats", "Meridian Sound System", "Configurable Dynamics"],
    available: true,
    description: "The Jaguar F-Type R is a true driver's car, combining raw power with precise handling. Its distinctive exhaust note and head-turning design make every journey an event. Experience British performance at its finest."
  }
];

export const carTypes = [
  { id: "SUV", name: "SUV", icon: "truck" },
  { id: "Sports", name: "Sports", icon: "zap" },
  { id: "Sedan", name: "Sedan", icon: "car" },
  { id: "Coupe", name: "Coupe", icon: "heart" },
  { id: "Hatchback", name: "Hatchback", icon: "box" },
  { id: "Convertible", name: "Convertible", icon: "sun" },
  { id: "Luxury", name: "Luxury", icon: "star" },
];

export const getCarById = (id: string): Car | undefined => {
  return cars.find(car => car.id === id);
};

export const getCarsByType = (type: CarType): Car[] => {
  return cars.filter(car => car.type === type);
};

export const getPopularCars = (): Car[] => {
  return cars.filter(car => car.rating >= 4.8).slice(0, 5);
};

export const getRecommendedCars = (): Car[] => {
  return [...cars].sort(() => 0.5 - Math.random()).slice(0, 4);
};

export const filterCars = (filter: CarFilter): Car[] => {
  return cars.filter(car => {
    // Filter by type
    if (filter.type && car.type.toUpperCase() !== filter.type.toUpperCase()) {
      return false;
    }
    
    // Filter by price range
    if (filter.priceRange && (car.pricePerDay < filter.priceRange[0] || car.pricePerDay > filter.priceRange[1])) {
      return false;
    }
    
    // Filter by transmission
    if (filter.transmission && car.transmission !== filter.transmission) {
      return false;
    }
    
    // Filter by fuel type
    if (filter.fuelType && car.fuelType !== filter.fuelType) {
      return false;
    }
    
    // Filter by seats
    if (filter.seats && car.seats < filter.seats) {
      return false;
    }
    
    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesMake = car.make.toLowerCase().includes(query);
      const matchesModel = car.model.toLowerCase().includes(query);
      const matchesLocation = car.location.toLowerCase().includes(query);
      const matchesType = car.type.toLowerCase().includes(query);
      const matchesFuelType = car.fuelType.toLowerCase().includes(query);
      
      if (!matchesMake && !matchesModel && !matchesLocation && !matchesType && !matchesFuelType) {
        return false;
      }
    }
    
    return true;
  });
};