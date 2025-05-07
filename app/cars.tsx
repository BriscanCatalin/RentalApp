import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Switch,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Filter, X, ChevronDown } from "lucide-react-native";
import Colors from "@/constants/colors";
import { carTypes } from "@/mocks/cars";
import { CarFilter, Car, FuelType, TransmissionType } from "@/types/car";
import CarCard from "@/components/CarCard";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import Button from "@/components/Button";
import { useCarStore } from "@/store/car-store";
import { useAuthStore } from "@/store/auth-store";

// Import Slider based on platform
let Slider;
if (Platform.OS === 'web') {
  // For web, use a simple range input
  Slider = ({ style, minimumValue, maximumValue, step, value, onValueChange, minimumTrackTintColor, maximumTrackTintColor, thumbTintColor }) => {
    return (
      <input
        type="range"
        min={minimumValue}
        max={maximumValue}
        step={step}
        value={value}
        onChange={(e) => onValueChange(parseFloat(e.target.value))}
        style={{
          ...style,
          width: '100%',
          height: 40,
          accentColor: minimumTrackTintColor,
        }}
      />
    );
  };
} else {
  // For native platforms, use the community slider
  Slider = require('@react-native-community/slider').default;
}

export default function CarsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { 
    filter, 
    setFilter, 
    resetFilter, 
    isLoading, 
    fetchCars 
  } = useCarStore();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [title, setTitle] = useState("Browse Cars");
  
  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedTransmission, setSelectedTransmission] = useState<TransmissionType | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const [minSeats, setMinSeats] = useState<number | null>(null);
  const [isElectric, setIsElectric] = useState(false);
  const [isAutomatic, setIsAutomatic] = useState(false);
  
  // Flag to prevent infinite updates
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initialize filters from params
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    // Reset local state when component mounts
    const newFilter: Partial<CarFilter> = {};
    let newTitle = "Browse Cars";
    let newSelectedType: string | null = null;
    
    // Handle type param
    if (params.type && typeof params.type === 'string') {
      newSelectedType = params.type;
      newFilter.type = params.type;
      
      // Find the category name for the title
      const category = carTypes.find(t => t.id === params.type);
      if (category) {
        newTitle = `${category.name} Cars`;
      }
    }
    
    // Handle section param
    if (params.section && typeof params.section === 'string') {
      if (params.section === "popular") {
        newTitle = "Popular Cars";
      } else if (params.section === "recommended") {
        newTitle = "Recommended Cars";
      }
    } else if (params.featured) {
      newTitle = "Premium Collection";
    }
    
    // Handle search param
    if (params.search && typeof params.search === 'string') {
      setSearchQuery(params.search);
      newFilter.searchQuery = params.search;
      newTitle = `Search: "${params.search}"`;
    }
    
    // Update local state
    setSelectedType(newSelectedType);
    setTitle(newTitle);
    
    // Reset filter and then apply new filter
    resetFilter();
    
    // Only set filter if we have actual filter criteria
    if (Object.keys(newFilter).length > 0) {
      setFilter(newFilter);
    }
    
    setInitialLoadComplete(true);
    
    // Fetch cars with the new filter
    fetchCars();
    
  }, [isAuthenticated, params.type, params.section, params.featured, params.search]);

  // Update filtered cars when filter changes or after fetching
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    const { cars } = useCarStore.getState();
    setFilteredCars(cars);
    
  }, [initialLoadComplete, useCarStore.getState().cars]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    setFilter({ searchQuery });
    fetchCars();
  }, [searchQuery, setFilter, fetchCars]);

  // Handle category selection
  const handleCategoryPress = useCallback((id: string) => {
    if (selectedType === id) {
      setSelectedType(null);
      setFilter({ type: null });
    } else {
      setSelectedType(id);
      setFilter({ type: id });
    }
    fetchCars();
  }, [selectedType, setFilter, fetchCars]);

  // Toggle filters panel
  const handleFilterPress = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  // Show advanced filters
  const handleAdvancedFiltersPress = useCallback(() => {
    setShowAdvancedFilters(true);
  }, []);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSelectedType(null);
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSelectedTransmission(null);
    setSelectedFuelType(null);
    setMinSeats(null);
    setIsElectric(false);
    setIsAutomatic(false);
    resetFilter();
    fetchCars();
  }, [resetFilter, fetchCars]);

  // Apply advanced filters
  const handleApplyAdvancedFilters = useCallback(() => {
    // Update filter with advanced options
    setFilter({
      priceRange: priceRange,
      transmission: isAutomatic ? "Automatic" : selectedTransmission,
      fuelType: isElectric ? "Electric" : selectedFuelType,
      seats: minSeats,
    });
    
    setShowAdvancedFilters(false);
    fetchCars();
  }, [
    priceRange, 
    isAutomatic, 
    selectedTransmission, 
    isElectric, 
    selectedFuelType, 
    minSeats, 
    setFilter,
    fetchCars
  ]);

  // Handle transmission selection
  const handleTransmissionSelect = useCallback((transmission: TransmissionType) => {
    setSelectedTransmission(selectedTransmission === transmission ? null : transmission);
  }, [selectedTransmission]);

  // Handle fuel type selection
  const handleFuelTypeSelect = useCallback((fuelType: FuelType) => {
    setSelectedFuelType(selectedFuelType === fuelType ? null : fuelType);
  }, [selectedFuelType]);

  // Handle seats selection
  const handleSeatsSelect = useCallback((seats: number) => {
    setMinSeats(minSeats === seats ? null : seats);
  }, [minSeats]);

  // Handle electric toggle
  const handleElectricToggle = useCallback((value: boolean) => {
    setIsElectric(value);
    if (value) {
      setSelectedFuelType("Electric");
    } else {
      setSelectedFuelType(null);
    }
  }, []);

  // Handle automatic toggle
  const handleAutomaticToggle = useCallback((value: boolean) => {
    setIsAutomatic(value);
    if (value) {
      setSelectedTransmission("Automatic");
    } else {
      setSelectedTransmission(null);
    }
  }, []);

  // Apply basic filters
  const handleApplyBasicFilters = useCallback(() => {
    fetchCars();
    setShowFilters(false);
  }, [fetchCars]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: title }} />
      
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Filter size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={handleResetFilters}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterLabel}>Car Type</Text>
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
                isSelected={selectedType === item.id}
                onPress={() => handleCategoryPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
          />

          <TouchableOpacity 
            style={styles.advancedFiltersButton}
            onPress={handleAdvancedFiltersPress}
          >
            <Text style={styles.advancedFiltersText}>Advanced Filters</Text>
            <ChevronDown size={16} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.filterActions}>
            <Button
              title="Apply Filters"
              onPress={handleApplyBasicFilters}
              fullWidth
            />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>{title}</Text>
          <Text style={styles.resultsCount}>
            {isLoading ? 'Loading...' : `${filteredCars.length} ${filteredCars.length === 1 ? "car" : "cars"} found`}
          </Text>
          {(selectedType || filter.searchQuery || filter.transmission || filter.fuelType || filter.seats) && (
            <TouchableOpacity
              style={styles.activeFiltersContainer}
              onPress={handleResetFilters}
            >
              <Text style={styles.activeFiltersText}>
                {selectedType && carTypes.find(t => t.id === selectedType)?.name}
                {selectedType && (filter.searchQuery || filter.transmission || filter.fuelType || filter.seats) && ", "}
                {filter.searchQuery && `"${filter.searchQuery}"`}
                {filter.searchQuery && (filter.transmission || filter.fuelType || filter.seats) && ", "}
                {filter.transmission && `${filter.transmission}`}
                {filter.transmission && (filter.fuelType || filter.seats) && ", "}
                {filter.fuelType && `${filter.fuelType}`}
                {filter.fuelType && filter.seats && ", "}
                {filter.seats && `${filter.seats}+ seats`}
              </Text>
              <X size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Loading cars...</Text>
          </View>
        ) : filteredCars.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No cars found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters to find what you're looking for.
            </Text>
            <Button
              title="Reset Filters"
              onPress={handleResetFilters}
              variant="outline"
              style={styles.resetButton}
            />
          </View>
        ) : (
          filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              variant="horizontal"
              style={styles.carCard}
            />
          ))
        )}
      </ScrollView>

      {/* Advanced Filters Modal */}
      <Modal
        visible={showAdvancedFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAdvancedFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity 
                onPress={() => setShowAdvancedFilters(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <Text style={styles.priceRangeText}>
                  ${priceRange[0]} - ${priceRange[1]} per day
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={500}
                  step={10}
                  value={priceRange[1]}
                  onValueChange={(value) => setPriceRange([priceRange[0], value])}
                  minimumTrackTintColor={Colors.primary}
                  maximumTrackTintColor={Colors.border}
                  thumbTintColor={Colors.primary}
                />
              </View>

              {/* Quick Toggles */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Quick Filters</Text>
                
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Electric Vehicles Only</Text>
                  <Switch
                    value={isElectric}
                    onValueChange={handleElectricToggle}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor="#fff"
                  />
                </View>
                
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Automatic Transmission Only</Text>
                  <Switch
                    value={isAutomatic}
                    onValueChange={handleAutomaticToggle}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Transmission */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Transmission</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedTransmission === "Automatic" && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleTransmissionSelect("Automatic")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedTransmission === "Automatic" && styles.optionTextSelected,
                      ]}
                    >
                      Automatic
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedTransmission === "Manual" && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleTransmissionSelect("Manual")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedTransmission === "Manual" && styles.optionTextSelected,
                      ]}
                    >
                      Manual
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Fuel Type */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Fuel Type</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedFuelType === "Gasoline" && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleFuelTypeSelect("Gasoline")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedFuelType === "Gasoline" && styles.optionTextSelected,
                      ]}
                    >
                      Gasoline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedFuelType === "Diesel" && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleFuelTypeSelect("Diesel")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedFuelType === "Diesel" && styles.optionTextSelected,
                      ]}
                    >
                      Diesel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedFuelType === "Electric" && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleFuelTypeSelect("Electric")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedFuelType === "Electric" && styles.optionTextSelected,
                      ]}
                    >
                      Electric
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedFuelType === "Hybrid" && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleFuelTypeSelect("Hybrid")}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedFuelType === "Hybrid" && styles.optionTextSelected,
                      ]}
                    >
                      Hybrid
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Seats */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Minimum Seats</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      minSeats === 2 && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSeatsSelect(2)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        minSeats === 2 && styles.optionTextSelected,
                      ]}
                    >
                      2+
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      minSeats === 4 && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSeatsSelect(4)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        minSeats === 4 && styles.optionTextSelected,
                      ]}
                    >
                      4+
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      minSeats === 5 && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSeatsSelect(5)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        minSeats === 5 && styles.optionTextSelected,
                      ]}
                    >
                      5+
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Reset"
                  onPress={handleResetFilters}
                  variant="outline"
                  style={styles.resetFilterButton}
                />
                <Button
                  title="Apply Filters"
                  onPress={handleApplyAdvancedFilters}
                  style={styles.applyFilterButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  resetText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryCard: {
    marginRight: 12,
    marginBottom: 8,
  },
  advancedFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  advancedFiltersText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primary,
    marginRight: 4,
  },
  filterActions: {
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  activeFiltersText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  carCard: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  resetButton: {
    width: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  priceRangeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  resetFilterButton: {
    flex: 1,
    marginRight: 8,
  },
  applyFilterButton: {
    flex: 1,
    marginLeft: 8,
  },
});