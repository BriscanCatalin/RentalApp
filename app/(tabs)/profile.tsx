import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Settings,
  LogOut,
  Camera,
  Car,
  Edit,
  X,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useCarStore } from "@/store/car-store";
import CarCard from "@/components/CarCard";
import { Car as CarType, CarType as VehicleType, FuelType, TransmissionType } from "@/types/car";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const { getUserCars, addUserCar, deleteUserCar } = useCarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMyCars, setShowMyCars] = useState(false);
  const [showAddCar, setShowAddCar] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  
  // Car form states
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carType, setCarType] = useState<VehicleType>("Sedan");
  const [carTransmission, setCarTransmission] = useState<TransmissionType>("Automatic");
  const [carFuelType, setCarFuelType] = useState<FuelType>("Gasoline");
  const [carSeats, setCarSeats] = useState("5");
  
  // User's cars
  const [userCars, setUserCars] = useState<CarType[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (user) {
      // Load user's cars
      const cars = getUserCars();
      setUserCars(cars);
    }
  }, [isAuthenticated, user, getUserCars]);

  useEffect(() => {
    if (user && showEditProfile) {
      // Initialize form with user data
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setCountry(user.country || "");
    }
  }, [user, showEditProfile]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("/(auth)/login");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleChangePhoto = async () => {
    try {
      // Request permissions
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to change your profile photo.");
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsLoading(true);
        // In a real app, you would upload the image to a server
        // For now, we'll just update the local state
        await updateProfile({ avatar: result.assets[0].uri });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        address,
        city,
        country,
      });
      setShowEditProfile(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMyCars = () => {
    // Refresh user's cars
    const cars = getUserCars();
    setUserCars(cars);
    setShowMyCars(true);
  };

  const handleAddCar = () => {
    setShowAddCar(true);
  };

  const handleSaveCar = () => {
    if (!carMake || !carModel || !carYear || !carPrice) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      addUserCar({
        make: carMake,
        model: carModel,
        year: parseInt(carYear),
        pricePerDay: parseInt(carPrice),
        type: carType,
        transmission: carTransmission,
        fuelType: carFuelType,
        seats: parseInt(carSeats),
      });

      // Reset form
      setCarMake("");
      setCarModel("");
      setCarYear("");
      setCarPrice("");
      setCarType("Sedan");
      setCarTransmission("Automatic");
      setCarFuelType("Gasoline");
      setCarSeats("5");

      setShowAddCar(false);
      
      // Refresh cars list
      const cars = getUserCars();
      setUserCars(cars);
      
      Alert.alert("Success", "Car added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to add car");
    }
  };

  const handleDeleteCar = (carId: string) => {
    Alert.alert(
      "Delete Car",
      "Are you sure you want to delete this car?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteUserCar(carId);
            // Refresh cars list
            const cars = getUserCars();
            setUserCars(cars);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSettingsPress = (setting: string) => {
    switch (setting) {
      case "Payment Methods":
        router.push("/settings/payment-methods");
        break;
      case "Privacy & Security":
        router.push("/settings/privacy-security");
        break;
      case "Preferences":
        router.push("/settings/preferences");
        break;
      default:
        break;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleChangePhoto}
            disabled={isLoading}
          >
            <Camera size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.memberSince}>
          Member since {new Date(user.createdAt).getFullYear()}
        </Text>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={handleEditProfile}
        >
          <Edit size={16} color="#fff" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <View style={styles.infoItem}>
            <User size={20} color={Colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Mail size={20} color={Colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Phone size={20} color={Colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone || "Not provided"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <MapPin size={20} color={Colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {user.address ? `${user.address}, ${user.city}, ${user.country}` : "Not provided"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Cars</Text>
        <TouchableOpacity 
          style={styles.myCarsButton}
          onPress={handleMyCars}
        >
          <Car size={20} color={Colors.primary} />
          <Text style={styles.myCarsText}>Manage My Cars</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => handleSettingsPress("Payment Methods")}
          >
            <CreditCard size={20} color={Colors.textSecondary} />
            <Text style={styles.settingsText}>Payment Methods</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => handleSettingsPress("Privacy & Security")}
          >
            <Shield size={20} color={Colors.textSecondary} />
            <Text style={styles.settingsText}>Privacy & Security</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => handleSettingsPress("Preferences")}
          >
            <Settings size={20} color={Colors.textSecondary} />
            <Text style={styles.settingsText}>Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        icon={<LogOut size={20} color={Colors.error} />}
        textStyle={{ color: Colors.error }}
        style={styles.logoutButton}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                onPress={() => setShowEditProfile(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                style={styles.input}
              />
              
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                style={styles.input}
              />
              
              <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                style={styles.input}
              />
              
              <Input
                label="Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                style={styles.input}
              />
              
              <Input
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
                style={styles.input}
              />
              
              <Input
                label="Country"
                value={country}
                onChangeText={setCountry}
                placeholder="Enter your country"
                style={styles.input}
              />
              
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                style={styles.saveButton}
                loading={isLoading}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* My Cars Modal */}
      <Modal
        visible={showMyCars}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMyCars(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>My Cars</Text>
              <TouchableOpacity 
                onPress={() => setShowMyCars(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {userCars.length === 0 ? (
                <View style={styles.emptyCarsContainer}>
                  <Text style={styles.emptyCarsText}>You don't have any cars yet</Text>
                </View>
              ) : (
                userCars.map((car) => (
                  <View key={car.id} style={styles.userCarContainer}>
                    <CarCard car={car} variant="horizontal" />
                    <TouchableOpacity
                      style={styles.deleteCarButton}
                      onPress={() => handleDeleteCar(car.id)}
                    >
                      <X size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
              
              <Button
                title="Add New Car"
                onPress={handleAddCar}
                style={styles.addCarButton}
                icon={<Car size={20} color="#fff" />}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Car Modal */}
      <Modal
        visible={showAddCar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddCar(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Car</Text>
              <TouchableOpacity 
                onPress={() => setShowAddCar(false)}
                style={styles.closeButton}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Input
                label="Make *"
                value={carMake}
                onChangeText={setCarMake}
                placeholder="e.g. Toyota, BMW, Tesla"
                style={styles.input}
              />
              
              <Input
                label="Model *"
                value={carModel}
                onChangeText={setCarModel}
                placeholder="e.g. Camry, X5, Model 3"
                style={styles.input}
              />
              
              <Input
                label="Year *"
                value={carYear}
                onChangeText={setCarYear}
                placeholder="e.g. 2023"
                keyboardType="number-pad"
                style={styles.input}
              />
              
              <Input
                label="Price per Day ($) *"
                value={carPrice}
                onChangeText={setCarPrice}
                placeholder="e.g. 100"
                keyboardType="number-pad"
                style={styles.input}
              />
              
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Car Type</Text>
                <View style={styles.selectOptions}>
                  {["Sedan", "SUV", "Sports", "Luxury", "Coupe"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.selectOption,
                        carType === type && styles.selectedOption,
                      ]}
                      onPress={() => setCarType(type as VehicleType)}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          carType === type && styles.selectedOptionText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Transmission</Text>
                <View style={styles.selectOptions}>
                  {["Automatic", "Manual"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.selectOption,
                        carTransmission === type && styles.selectedOption,
                      ]}
                      onPress={() => setCarTransmission(type as TransmissionType)}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          carTransmission === type && styles.selectedOptionText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Fuel Type</Text>
                <View style={styles.selectOptions}>
                  {["Gasoline", "Diesel", "Electric", "Hybrid"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.selectOption,
                        carFuelType === type && styles.selectedOption,
                      ]}
                      onPress={() => setCarFuelType(type as FuelType)}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          carFuelType === type && styles.selectedOptionText,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Seats</Text>
                <View style={styles.selectOptions}>
                  {["2", "4", "5", "7"].map((seats) => (
                    <TouchableOpacity
                      key={seats}
                      style={[
                        styles.selectOption,
                        carSeats === seats && styles.selectedOption,
                      ]}
                      onPress={() => setCarSeats(seats)}
                    >
                      <Text
                        style={[
                          styles.selectOptionText,
                          carSeats === seats && styles.selectedOptionText,
                        ]}
                      >
                        {seats}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <Button
                title="Add Car"
                onPress={handleSaveCar}
                style={styles.saveButton}
              />
            </ScrollView>
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
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editProfileText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingsText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 16,
  },
  logoutButton: {
    marginTop: 8,
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
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  myCarsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  myCarsText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
    marginLeft: 12,
  },
  emptyCarsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyCarsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  addCarButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  userCarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  deleteCarButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  selectContainer: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  selectOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  selectOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "500",
  },
});