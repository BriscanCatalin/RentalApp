import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Star,
  Users,
  Fuel,
  Zap,
  Calendar,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { getCarById } from "@/mocks/cars";
import { Car } from "@/types/car";
import ImageGallery from "@/components/ImageGallery";
import FeatureItem from "@/components/FeatureItem";
import Button from "@/components/Button";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { getReviewsForCar } from "@/mocks/reviews";
import { Review } from "@/types/review";
import ReviewItem from "@/components/ReviewItem";
import Input from "@/components/Input";

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { setBookingCar } = useBookingStore();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    if (id) {
      const carData = getCarById(id);
      if (carData) {
        setCar(carData);
        // Load reviews
        setReviews(getReviewsForCar(id));
      } else {
        Alert.alert("Error", "Car not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    }
  }, [id, isAuthenticated]);

  const handleBookNow = () => {
    if (!car) return;
    
    setBookingCar(car.id, car.pricePerDay);
    router.push("/booking/confirm");
  };

  const handleReviewsPress = () => {
    setShowReviews(true);
  };

  const closeReviews = () => {
    setShowReviews(false);
  };

  const handleWriteReview = () => {
    setShowReviews(false);
    setShowWriteReview(true);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      Alert.alert("Error", "Please enter your review");
      return;
    }

    // In a real app, this would send the review to the backend
    Alert.alert("Success", "Your review has been submitted successfully");
    setShowWriteReview(false);
    
    // Add the new review to the list (in a real app, this would come from the backend)
    const newReview = {
      id: `review-${Date.now()}`,
      carId: car.id,
      userId: "current-user",
      userName: "You",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000",
      rating: reviewRating,
      text: reviewText,
      date: new Date().toISOString(),
    };
    
    setReviews([newReview, ...reviews]);
    
    // Reset form
    setReviewText("");
    setReviewRating(5);
  };

  const renderStarRating = (rating, size = 24, interactive = false) => {
    return (
      <View style={styles.starRatingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && setReviewRating(star)}
            disabled={!interactive}
          >
            <Star
              size={size}
              color={Colors.warning}
              fill={star <= rating ? Colors.warning : "transparent"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!car) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ImageGallery images={car.images} />

      <View style={styles.header}>
        <View>
          <Text style={styles.makeModel}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.year}>{car.year}</Text>
        </View>
        <TouchableOpacity 
          style={styles.ratingContainer}
          onPress={handleReviewsPress}
        >
          <Star size={16} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.rating}>
            {car.rating} ({car.reviewCount})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locationContainer}>
        <MapPin size={16} color={Colors.textSecondary} />
        <Text style={styles.location}>{car.location}</Text>
      </View>

      <View style={styles.featuresGrid}>
        <FeatureItem
          icon={<Users size={20} color={Colors.primary} />}
          label="Seats"
          value={`${car.seats} People`}
        />
        <FeatureItem
          icon={<Fuel size={20} color={Colors.primary} />}
          label="Fuel Type"
          value={car.fuelType}
        />
        <FeatureItem
          icon={<Zap size={20} color={Colors.primary} />}
          label="Transmission"
          value={car.transmission}
        />
        <FeatureItem
          icon={<Calendar size={20} color={Colors.primary} />}
          label="Year"
          value={car.year.toString()}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{car.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresList}>
          {car.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.reviewsContainer}
        onPress={handleReviewsPress}
      >
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          <View style={styles.reviewsRight}>
            <Text style={styles.reviewsCount}>{car.reviewCount} reviews</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${car.pricePerDay}</Text>
          <Text style={styles.perDay}>/day</Text>
        </View>
        <Button title="Book Now" onPress={handleBookNow} style={styles.bookButton} />
      </View>

      {/* Reviews Modal */}
      <Modal
        visible={showReviews}
        animationType="slide"
        transparent={true}
        onRequestClose={closeReviews}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reviews</Text>
              <TouchableOpacity onPress={closeReviews} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingOverview}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>{car.rating}</Text>
                <Star size={16} color="#fff" fill="#fff" />
              </View>
              <Text style={styles.ratingOverviewText}>
                Based on {car.reviewCount} reviews
              </Text>
            </View>

            <FlatList
              data={reviews}
              renderItem={({ item }) => <ReviewItem review={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.reviewsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.noReviewsText}>No reviews yet</Text>
              }
            />

            <Button 
              title="Write a Review" 
              onPress={handleWriteReview}
              style={styles.writeReviewButton}
            />
          </View>
        </View>
      </Modal>

      {/* Write Review Modal */}
      <Modal
        visible={showWriteReview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWriteReview(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity 
                onPress={() => setShowWriteReview(false)} 
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.writeReviewContainer}>
              <Text style={styles.ratingLabel}>Your Rating</Text>
              {renderStarRating(reviewRating, 32, true)}
              
              <Input
                label="Your Review"
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Share your experience with this car..."
                multiline
                numberOfLines={5}
                style={styles.reviewInput}
              />
              
              <Button 
                title="Submit Review" 
                onPress={handleSubmitReview}
                style={styles.submitReviewButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  makeModel: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  reviewsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  reviewsRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  perDay: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  bookButton: {
    width: 150,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  ratingOverview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  ratingBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginRight: 4,
  },
  ratingOverviewText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  reviewsList: {
    paddingBottom: 16,
  },
  noReviewsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginVertical: 20,
  },
  writeReviewButton: {
    marginTop: 16,
  },
  writeReviewContainer: {
    marginTop: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  starRatingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  reviewInput: {
    marginBottom: 16,
    height: 120,
  },
  submitReviewButton: {
    marginTop: 8,
  },
});