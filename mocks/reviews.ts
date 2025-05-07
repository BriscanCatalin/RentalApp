import { Review } from "@/types/review";

export const reviews: Review[] = [
  {
    id: "r1",
    carId: "1",
    userId: "u2",
    userName: "Emma Thompson",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    rating: 5,
    comment: "Absolutely amazing experience driving the Porsche 911! The car was in perfect condition and the performance was breathtaking. Would definitely rent again!",
    date: "2023-10-15T14:30:00Z"
  },
  {
    id: "r2",
    carId: "1",
    userId: "u3",
    userName: "Michael Chen",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    rating: 4.5,
    comment: "Great car, very well maintained. The pickup process was smooth and the staff was helpful. The only minor issue was a small scratch on the door that wasn't noted before.",
    date: "2023-09-22T09:15:00Z"
  },
  {
    id: "r3",
    carId: "1",
    userId: "u4",
    userName: "Sarah Johnson",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    rating: 5,
    comment: "This Porsche is a dream to drive! The handling is incredible and it turns heads everywhere you go. The rental process was easy and straightforward.",
    date: "2023-11-05T16:45:00Z"
  },
  {
    id: "r4",
    carId: "2",
    userId: "u5",
    userName: "David Wilson",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    rating: 5,
    comment: "The Tesla Model S Plaid is insanely fast! The acceleration is mind-blowing and the technology is cutting edge. Charging was convenient with the supercharger network.",
    date: "2023-10-10T11:20:00Z"
  },
  {
    id: "r5",
    carId: "2",
    userId: "u6",
    userName: "Jessica Lee",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    rating: 4,
    comment: "Great electric car experience. The range was sufficient for my needs and the autopilot feature was impressive. The only downside was that the interior had some wear and tear.",
    date: "2023-09-18T13:10:00Z"
  },
  {
    id: "r6",
    carId: "3",
    userId: "u7",
    userName: "Robert Brown",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
    rating: 4.5,
    comment: "The Range Rover Sport is perfect for both city driving and weekend getaways. Very comfortable with plenty of space. Fuel efficiency could be better though.",
    date: "2023-10-25T15:30:00Z"
  },
  {
    id: "r7",
    carId: "4",
    userId: "u8",
    userName: "Amanda Garcia",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
    rating: 5,
    comment: "The Mercedes S-Class is the epitome of luxury. The massage seats and ambient lighting made every drive a spa-like experience. Highly recommend for business trips!",
    date: "2023-11-12T10:45:00Z"
  },
  {
    id: "r8",
    carId: "5",
    userId: "u9",
    userName: "Thomas Wright",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
    rating: 4,
    comment: "The BMW M4 Competition is a beast! Great handling and power. The only reason for 4 stars is that the pickup location was difficult to find.",
    date: "2023-10-05T09:20:00Z"
  },
  {
    id: "r9",
    carId: "6",
    userId: "u10",
    userName: "Olivia Martinez",
    userAvatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200",
    rating: 5,
    comment: "Driving the Audi R8 was a bucket list experience! The sound of that V10 engine is unforgettable. The car was immaculate and performed flawlessly.",
    date: "2023-11-18T14:15:00Z"
  },
  {
    id: "r10",
    carId: "7",
    userId: "u11",
    userName: "James Taylor",
    userAvatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200",
    rating: 5,
    comment: "The Lamborghini Huracán is pure adrenaline! From the scissor doors to the roaring engine, everything about this car is spectacular. Worth every penny!",
    date: "2023-10-30T16:50:00Z"
  },
  {
    id: "r11",
    carId: "8",
    userId: "u12",
    userName: "Sophia Kim",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    rating: 4.5,
    comment: "The Bentley Continental GT combines performance and luxury perfectly. The craftsmanship is exceptional and it's surprisingly easy to drive for its size.",
    date: "2023-09-28T12:40:00Z"
  }
];

export const getReviewsForCar = (carId: string): Review[] => {
  return reviews.filter(review => review.carId === carId);
};

export const getReviewById = (id: string): Review | undefined => {
  return reviews.find(review => review.id === id);
};