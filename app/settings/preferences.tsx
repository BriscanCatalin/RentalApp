import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { Settings, Bell, Globe, Moon, Sliders, Zap, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";

interface Language {
  code: string;
  name: string;
}

export default function PreferencesScreen() {
  // Theme settings
  const [darkMode, setDarkMode] = useState(false);
  
  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] = useState(false);
  
  // App settings
  const [useMetricSystem, setUseMetricSystem] = useState(true);
  const [showPricesWithTax, setShowPricesWithTax] = useState(true);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  
  // Language options
  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ];
  
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    const selectedLang = languages.find(lang => lang.code === languageCode);
    if (selectedLang) {
      Alert.alert(
        "Language Changed",
        `App language has been changed to ${selectedLang.name}`,
        [{ text: "OK" }]
      );
    }
  };
  
  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache? This will log you out.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          onPress: () => {
            Alert.alert("Cache Cleared", "App cache has been cleared successfully.");
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Preferences" }} />
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Moon size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Use dark theme for the app
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={darkMode ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive push notifications on your device
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={pushNotifications ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive email notifications about your account
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={emailNotifications ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Booking Reminders</Text>
              <Text style={styles.settingDescription}>
                Get reminders about upcoming bookings
              </Text>
            </View>
            <Switch
              value={bookingReminders}
              onValueChange={setBookingReminders}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={bookingReminders ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Promotional Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive offers, discounts, and promotional content
              </Text>
            </View>
            <Switch
              value={promotionalNotifications}
              onValueChange={setPromotionalNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={promotionalNotifications ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Language & Region</Text>
        </View>
        
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => {
              Alert.alert(
                "Select Language",
                "Choose your preferred language",
                languages.map(lang => ({
                  text: lang.name,
                  onPress: () => handleLanguageSelect(lang.code),
                  style: lang.code === selectedLanguage ? "default" : "default"
                }))
              );
            }}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>
                {languages.find(lang => lang.code === selectedLanguage)?.name || "English"}
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Use Metric System</Text>
              <Text style={styles.settingDescription}>
                Display distances in kilometers instead of miles
              </Text>
            </View>
            <Switch
              value={useMetricSystem}
              onValueChange={setUseMetricSystem}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={useMetricSystem ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sliders size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>App Settings</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Show Prices with Tax</Text>
              <Text style={styles.settingDescription}>
                Display all prices including taxes and fees
              </Text>
            </View>
            <Switch
              value={showPricesWithTax}
              onValueChange={setShowPricesWithTax}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={showPricesWithTax ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto-Play Videos</Text>
              <Text style={styles.settingDescription}>
                Automatically play videos when browsing cars
              </Text>
            </View>
            <Switch
              value={autoPlayVideos}
              onValueChange={setAutoPlayVideos}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={autoPlayVideos ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={handleClearCache}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Clear Cache</Text>
              <Text style={styles.settingDescription}>
                Clear temporary data to free up space
              </Text>
            </View>
            <Zap size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>
          App Version: 1.0.0
        </Text>
        <Text style={styles.footerText}>
          © 2023 CarRental. All rights reserved.
        </Text>
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});