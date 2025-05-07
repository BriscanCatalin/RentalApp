import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { getActiveBookings, getPastBookings } from "@/mocks/bookings";
import { Booking } from "@/types/booking";
import BookingCard from "@/components/BookingCard";
import { useAuthStore } from "@/store/auth-store";

export default function BookingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    // Load bookings
    if (user) {
      setActiveBookings(getActiveBookings(user.id));
      setPastBookings(getPastBookings(user.id));
    }
  }, [isAuthenticated, user]);

  const handleTabChange = (tab: "active" | "past") => {
    setActiveTab(tab);
  };

  const handleBrowseCars = () => {
    router.push("/(tabs)/index");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => handleTabChange("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => handleTabChange("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.bookingsContainer}
        contentContainerStyle={styles.bookingsContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "active" ? (
          activeBookings.length > 0 ? (
            activeBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No active bookings</Text>
              <Text style={styles.emptyText}>
                You don't have any active bookings at the moment.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={handleBrowseCars}
              >
                <Text style={styles.browseButtonText}>Browse Cars</Text>
              </TouchableOpacity>
            </View>
          )
        ) : pastBookings.length > 0 ? (
          pastBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No past bookings</Text>
            <Text style={styles.emptyText}>
              You don't have any past bookings to display.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: "#fff",
  },
  bookingsContainer: {
    flex: 1,
  },
  bookingsContent: {
    padding: 16,
    paddingBottom: 32,
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
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});