import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import Colors from "@/constants/colors";
import { Heart, Truck, Car, Zap, Box, Sun, Star } from "lucide-react-native";
import { useRouter } from "expo-router";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  style?: ViewStyle;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function CategoryCard({
  id,
  name,
  icon,
  style,
  isSelected = false,
  onPress,
}: CategoryCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        // Navigate to cars screen with type filter
        router.push(`/cars?type=${id}`);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  const renderIcon = () => {
    const iconColor = isSelected ? "#fff" : Colors.primary;
    const size = 24;

    switch (icon) {
      case "truck":
        return <Truck size={size} color={iconColor} />;
      case "heart":
        return <Heart size={size} color={iconColor} />;
      case "car":
        return <Car size={size} color={iconColor} />;
      case "zap":
        return <Zap size={size} color={iconColor} />;
      case "box":
        return <Box size={size} color={iconColor} />;
      case "sun":
        return <Sun size={size} color={iconColor} />;
      case "star":
        return <Star size={size} color={iconColor} />;
      default:
        return <Car size={size} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {renderIcon()}
      <Text
        style={[
          styles.name,
          isSelected && styles.selectedName,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
  },
  name: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    textAlign: "center",
  },
  selectedName: {
    color: "#fff",
  },
});