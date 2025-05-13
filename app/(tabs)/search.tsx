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
import { Filter, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { carTypes, filterCars } from "@/mocks/cars";
import { CarFilter } from "@/types/car";
import CarCard from "@/components/CarCard";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import Button from "@/components/Button";
import { useCarStore } from "@/store/car-store";
import { useAuthStore } from "@/store/auth-store";

export default function SearchScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { resetFilter } = useCarStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Luxury cars",
    "SUV",
    "Electric vehicles",
    "Sports cars",
  ]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }
    
    // Reset filters when entering search screen
    resetFilter();
  }, [isAuthenticated]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 3)]);
    }
    
    // Navigate to results
    try {
      router.push(`/cars?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleCategoryPress = (id : any) => {
    try {
      router.push(`/cars?type=${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleRecentSearchPress = (search : string) => {
    setSearchQuery(search);
    
    // Navigate to results
    try {
      router.push(`/cars?search=${encodeURIComponent(search)}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          autoFocus
        />
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={handleClearRecentSearches}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchItem}
              onPress={() => handleRecentSearchPress(search)}
            >
              <Text style={styles.recentSearchText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <View style={styles.popularSearchesContainer}>
          {["Luxury", "Electric", "SUV", "Sports", "Convertible", "Automatic"].map((term, index) => (
            <TouchableOpacity
              key={index}
              style={styles.popularSearchTag}
              onPress={() => handleRecentSearchPress(term)}
            >
              <Text style={styles.popularSearchText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search Tips</Text>
        <View style={styles.tipsContainer}>
          <Text style={styles.tipText}>• Search by make, model, or type</Text>
          <Text style={styles.tipText}>• Filter results by price, transmission, and more</Text>
          <Text style={styles.tipText}>• Browse categories for quick access</Text>
          <Text style={styles.tipText}>• Check recent searches for quick access</Text>
        </View>
      </View>
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
  searchContainer: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  recentSearchItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentSearchText: {
    fontSize: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryCard: {
    marginRight: 12,
    marginBottom: 8,
  },
  popularSearchesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  popularSearchTag: {
    backgroundColor: Colors.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularSearchText: {
    fontSize: 14,
    color: Colors.text,
  },
  tipsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});