import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { Car } from "@/types/car";
import Colors from "@/constants/colors";
import { Star, Users, Fuel, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";

interface CarCardProps {
  car: Car;
  style?: ViewStyle;
  variant?: "horizontal" | "vertical";
}

export default function CarCard({
  car,
  style,
  variant = "vertical",
}: CarCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/car/${car.id}`);
  };

  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        style={[styles.horizontalContainer, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: car.images[0] }}
          style={styles.horizontalImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalHeader}>
            <Text style={styles.makeModel}>
              {car.make} {car.model}
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.rating}>{car.rating}</Text>
            </View>
          </View>
          <Text style={styles.type}>{car.type}</Text>
          
          <View style={styles.horizontalFeatures}>
            <View style={styles.featureItem}>
              <Users size={14} color={Colors.textSecondary} />
              <Text style={styles.featureText}>{car.seats} Seats</Text>
            </View>
            <View style={styles.featureItem}>
              <Fuel size={14} color={Colors.textSecondary} />
              <Text style={styles.featureText}>{car.fuelType}</Text>
            </View>
            <View style={styles.featureItem}>
              <Zap size={14} color={Colors.textSecondary} />
              <Text style={styles.featureText}>{car.transmission}</Text>
            </View>
          </View>
          
          <View style={styles.horizontalFooter}>
            <Text style={styles.price}>${car.pricePerDay}</Text>
            <Text style={styles.perDay}>/day</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
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
          <Text style={styles.makeModel}>
            {car.make} {car.model}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.rating}>{car.rating}</Text>
          </View>
        </View>
        <Text style={styles.type}>{car.type}</Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Users size={14} color={Colors.textSecondary} />
            <Text style={styles.featureText}>{car.seats} Seats</Text>
          </View>
          <View style={styles.featureItem}>
            <Fuel size={14} color={Colors.textSecondary} />
            <Text style={styles.featureText}>{car.fuelType}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>${car.pricePerDay}</Text>
          <Text style={styles.perDay}>/day</Text>
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
    width: 220,
  },
  image: {
    height: 140,
    width: "100%",
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  makeModel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text,
  },
  type: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  features: {
    flexDirection: "row",
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  perDay: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  horizontalContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    height: 120,
  },
  horizontalImage: {
    width: 120,
    height: "100%",
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  horizontalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horizontalFeatures: {
    flexDirection: "column",
    gap: 4,
  },
  horizontalFooter: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});