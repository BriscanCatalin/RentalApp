import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Calendar, CreditCard, Shield, Info } from "lucide-react-native";
import Colors from "@/constants/colors";
import { getCarById } from "@/mocks/cars";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";

export default function BookingConfirmScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { carId, pricePerDay, startDate, endDate, setBookingDates, createBooking } = useBookingStore();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    // Check if we have a car to book
    if (!carId) {
      Alert.alert("Error", "No car selected for booking", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    // Load car details
    const carData = getCarById(carId);
    if (carData) {
      setCar(carData);
    } else {
      Alert.alert("Error", "Car not found", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [carId, isAuthenticated]);

  useEffect(() => {
    if (startDate && endDate && pricePerDay) {
      // Calculate number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Ensure at least 1 day
      const days = Math.max(1, diffDays);
      setTotalDays(days);
      
      // Calculate prices
      const price = pricePerDay * days;
      setTotalPrice(price);
      
      const fee = Math.round(price * 0.1); // 10% service fee
      setServiceFee(fee);
      
      setGrandTotal(price + fee);
    }
  }, [startDate, endDate, pricePerDay]);

  const handleDateChange = (start, end) => {
    setBookingDates(start, end);
  };

  const handleConfirmBooking = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select booking dates");
      return;
    }

    setIsLoading(true);
    try {
      // Create booking
      const bookingId = await createBooking(carId, startDate, endDate, grandTotal);
      
      // Show success message
      Alert.alert(
        "Booking Confirmed",
        "Your booking has been confirmed successfully!",
        [
          {
            text: "View Booking",
            onPress: () => router.push(`/booking/${bookingId}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      <View style={styles.carContainer}>
        <Image
          source={{ uri: car.images[0] }}
          style={styles.carImage}
          contentFit="cover"
        />
        <View style={styles.carInfo}>
          <Text style={styles.carName}>
            {car.make} {car.model}
          </Text>
          <Text style={styles.carType}>{car.type}</Text>
          <Text style={styles.carPrice}>${car.pricePerDay}/day</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Select Dates</Text>
        </View>
        <DateRangePicker
          initialStartDate={startDate}
          initialEndDate={endDate}
          onDateChange={handleDateChange}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CreditCard size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Price Details</Text>
        </View>
        <View style={styles.priceDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${pricePerDay} x {totalDays} {totalDays === 1 ? "day" : "days"}
            </Text>
            <Text style={styles.priceValue}>${totalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>${serviceFee}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
        </View>
        <View style={styles.policyContainer}>
          <Text style={styles.policyText}>
            Free cancellation up to 48 hours before pickup. After that, a fee of 50% of the total price will be charged.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.infoContainer}>
          <Info size={20} color={Colors.textSecondary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              By confirming this booking, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </View>
      </View>

      <Button
        title="Confirm Booking"
        onPress={handleConfirmBooking}
        loading={isLoading}
        style={styles.confirmButton}
      />
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
  carContainer: {
    flexDirection: "row",
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
    width: 120,
    height: 120,
  },
  carInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  carName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  carType: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  priceDetails: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  policyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  policyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  confirmButton: {
    marginTop: 8,
  },
});