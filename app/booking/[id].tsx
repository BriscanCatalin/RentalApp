import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  X,
  ChevronRight,
  Phone,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { getBookingById } from "@/mocks/bookings";
import { getCarById } from "@/mocks/cars";
import { Booking } from "@/types/booking";
import { Car } from "@/types/car";
import Button from "@/components/Button";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cancelBooking, isLoading } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    if (id) {
      const bookingData = getBookingById(id as string);
      if (bookingData) {
        setBooking(bookingData);
        
        // Load car data
        const carData = getCarById(bookingData.carId);
        if (carData) {
          setCar(carData);
        }
      } else {
        Alert.alert("Error", "Booking not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    }
  }, [id, isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return Colors.success;
      case "pending":
        return Colors.warning;
      case "cancelled":
        return Colors.error;
      case "completed":
        return Colors.info;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check size={20} color={Colors.success} />;
      case "pending":
        return <Clock size={20} color={Colors.warning} />;
      case "cancelled":
        return <X size={20} color={Colors.error} />;
      case "completed":
        return <Check size={20} color={Colors.info} />;
      default:
        return <Clock size={20} color={Colors.textSecondary} />;
    }
  };

  const handleCancelBooking = () => {
    if (!booking) return;

    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes, Cancel",
          onPress: async () => {
            const success = await cancelBooking(booking.id);
            if (success) {
              Alert.alert(
                "Booking Cancelled",
                "Your booking has been cancelled successfully",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)/bookings"),
                  },
                ]
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSupportPress = () => {
    Alert.alert(
      "Customer Support",
      "This would connect you to customer support in a real app.",
      [{ text: "OK" }]
    );
  };

  const handleViewCarDetails = () => {
    if (car) {
      router.push(`/car/${car.id}`);
    }
  };

  if (!booking || !car) {
    return null;
  }

  // Calculate rental days
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {getStatusIcon(booking.status)}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(booking.status) },
            ]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.bookingId}>Booking #{booking.id}</Text>
      </View>

      <TouchableOpacity 
        style={styles.carCard}
        onPress={handleViewCarDetails}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: car.images[0] }}
          style={styles.carImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.carInfo}>
          <Text style={styles.carName}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.carYear}>{car.year}</Text>
          <View style={styles.carFeatures}>
            <Text style={styles.carFeature}>{car.type}</Text>
            <Text style={styles.carFeature}>{car.transmission}</Text>
            <Text style={styles.carFeature}>{car.seats} Seats</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rental Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Rental Period</Text>
              <Text style={styles.detailValue}>
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </Text>
              <Text style={styles.detailSubvalue}>
                {diffDays} {diffDays === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Location</Text>
              <Text style={styles.detailValue}>{car.location} Office</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Rate</Text>
            <Text style={styles.summaryValue}>${car.pricePerDay}/day</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rental Duration</Text>
            <Text style={styles.summaryValue}>{diffDays} days</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rental Cost</Text>
            <Text style={styles.summaryValue}>${car.pricePerDay * diffDays}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>$25</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>${booking.totalPrice}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>Credit Card (*4242)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <View style={styles.paymentStatus}>
              <Check size={14} color="#fff" />
              <Text style={styles.paymentStatusText}>Paid</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.supportCard}
        onPress={handleSupportPress}
      >
        <View style={styles.supportIconContainer}>
          <Phone size={24} color="#fff" />
        </View>
        <View style={styles.supportContent}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Contact our customer support for assistance
          </Text>
        </View>
        <ChevronRight size={20} color={Colors.textSecondary} />
      </TouchableOpacity>

      {booking.status === "confirmed" && (
        <Button
          title="Cancel Booking"
          onPress={handleCancelBooking}
          variant="outline"
          loading={isLoading}
          textStyle={{ color: Colors.error }}
          style={styles.cancelButton}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  carCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  carImage: {
    width: "100%",
    height: 180,
  },
  carInfo: {
    padding: 16,
  },
  carName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  carYear: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  carFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  carFeature: {
    fontSize: 12,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  detailSubvalue: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  paymentStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  paymentStatusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 4,
  },
  supportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  supportText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
});