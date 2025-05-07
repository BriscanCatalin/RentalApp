import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Shield, Lock, Eye, Bell, Trash2, ChevronRight, AlertTriangle } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import { useAuthStore } from "@/store/auth-store";

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Privacy settings
  const [dataSharing, setDataSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(Platform.OS !== "web");
  const [loginNotifications, setLoginNotifications] = useState(true);

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "An email with password reset instructions will be sent to your registered email address.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Email", 
          onPress: () => {
            Alert.alert("Success", "Password reset email has been sent.");
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Account", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirm Deletion",
              "Please type 'DELETE' to confirm account deletion",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Confirm", 
                  style: "destructive",
                  onPress: () => {
                    Alert.alert("Account Scheduled for Deletion", "Your account has been scheduled for deletion. You will receive a confirmation email shortly.");
                    router.replace("/(auth)/login");
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Privacy & Security" }} />
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Data Sharing</Text>
              <Text style={styles.settingDescription}>
                Allow us to share anonymized data to improve our services
              </Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={dataSharing ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Profile Visibility</Text>
              <Text style={styles.settingDescription}>
                Make your profile visible to car owners and renters
              </Text>
            </View>
            <Switch
              value={profileVisibility}
              onValueChange={setProfileVisibility}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={profileVisibility ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Location Tracking</Text>
              <Text style={styles.settingDescription}>
                Allow location tracking for better car recommendations
              </Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={locationTracking ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Lock size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Security Settings</Text>
        </View>
        
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={handleChangePassword}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingDescription}>
                Update your account password
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
              <Text style={styles.settingDescription}>
                Add an extra layer of security to your account
              </Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={twoFactorAuth ? Colors.primary : "#f4f3f4"}
            />
          </View>
          
          {Platform.OS !== "web" && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>
                    Use fingerprint or face recognition to log in
                  </Text>
                </View>
                <Switch
                  value={biometricLogin}
                  onValueChange={setBiometricLogin}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={biometricLogin ? Colors.primary : "#f4f3f4"}
                />
              </View>
            </>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Login Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications when your account is accessed
              </Text>
            </View>
            <Switch
              value={loginNotifications}
              onValueChange={setLoginNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={loginNotifications ? Colors.primary : "#f4f3f4"}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={20} color={Colors.error} />
          <Text style={styles.sectionTitle}>Danger Zone</Text>
        </View>
        
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Trash2 size={20} color={Colors.error} />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
          <Text style={styles.dangerDescription}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
        <TouchableOpacity onPress={() => Alert.alert("Privacy Policy", "Our detailed privacy policy would be displayed here.")}>
          <Text style={styles.footerLink}>View Privacy Policy</Text>
        </TouchableOpacity>
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
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.error,
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});