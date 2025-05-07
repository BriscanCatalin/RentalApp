import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Calendar, Check, Clock, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Booking } from "@/types/booking";
import { Car } from "@/types/car";
import { getCarById } from "@/mocks/cars";

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  const car = getCarById(booking.carId) as Car;

  const handlePress = () => {
    router.push(`/booking/${booking.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
        return <Check size={16} color={Colors.success} />;
      case "pending":
        return <Clock size={16} color={Colors.warning} />;
      case "cancelled":
        return <X size={16} color={Colors.error} />;
      case "completed":
        return <Check size={16} color={Colors.info} />;
      default:
        return <Clock size={16} color={Colors.textSecondary} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: car.images[0] }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.carName}>
            {car.make} {car.model}
          </Text>
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
        </View>

        <View style={styles.dateContainer}>
          <Calendar size={14} color={Colors.textSecondary} />
          <Text style={styles.dateText}>
            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${booking.totalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    height: 140,
    width: "100%",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  carName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
});