import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { MapPin, Search, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import { carTypes, getPopularCars, getRecommendedCars } from "@/mocks/cars";
import { getCurrentUser } from "@/mocks/users";
import CarCard from "@/components/CarCard";
import CategoryCard from "@/components/CategoryCard";
import { useAuthStore } from "@/store/auth-store";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [popularCars, setPopularCars] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    // Load cars
    setPopularCars(getPopularCars());
    setRecommendedCars(getRecommendedCars());
  }, [isAuthenticated]);

  const handleSearchPress = () => {
    router.push("/(tabs)/search");
  };

  const handleSeeAllPress = (type) => {
    try {
      router.push(`/cars?section=${type}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleBannerPress = () => {
    try {
      router.push(`/cars?featured=true`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleCategoryPress = (id) => {
    try {
      router.push(`/cars?type=${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name.split(" ")[0]}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.primary} />
            <Text style={styles.location}>{user.city}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={handleSearchPress}
        activeOpacity={0.8}
      >
        <Search size={20} color={Colors.textSecondary} />
        <Text style={styles.searchText}>Search for your dream car</Text>
      </TouchableOpacity>

      {/* Featured Banner */}
      <TouchableOpacity
        style={styles.banner}
        activeOpacity={0.9}
        onPress={handleBannerPress}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000",
          }}
          style={styles.bannerImage}
          contentFit="cover"
        />
        <View style={styles.bannerOverlay}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Premium Collection</Text>
            <Text style={styles.bannerSubtitle}>
              Experience luxury like never before
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Explore Now</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>

      <FlatList
        data={carTypes}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <CategoryCard
            id={item.id}
            name={item.name}
            icon={item.icon}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Popular Cars */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Cars</Text>
        <TouchableOpacity onPress={() => handleSeeAllPress("popular")}>
          <View style={styles.seeAllContainer}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={popularCars}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carsContainer}
        renderItem={({ item }) => (
          <CarCard car={item} style={styles.carCard} />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Recommended Cars */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <TouchableOpacity onPress={() => handleSeeAllPress("recommended")}>
          <View style={styles.seeAllContainer}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {recommendedCars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          variant="horizontal"
          style={styles.horizontalCarCard}
        />
      ))}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  banner: {
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    padding: 16,
  },
  bannerContent: {
    maxWidth: "70%",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  seeAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryCard: {
    marginRight: 12,
    marginBottom: 8,
  },
  carsContainer: {
    paddingBottom: 8,
  },
  carCard: {
    marginRight: 16,
    marginBottom: 8,
  },
  horizontalCarCard: {
    marginBottom: 16,
  },
});