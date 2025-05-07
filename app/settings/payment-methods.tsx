import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Stack } from "expo-router";
import { CreditCard, Plus, Trash2, Check, ChevronRight, Shield } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

// Mock payment methods
const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expMonth: 10,
    expYear: 2024,
    isDefault: false,
  },
];

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);
  
  // New card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    Alert.alert("Default Updated", "Your default payment method has been updated.");
  };
  
  const handleDeleteCard = (id: string) => {
    Alert.alert(
      "Remove Card",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== id));
            Alert.alert("Card Removed", "Your payment method has been removed.");
          }
        }
      ]
    );
  };
  
  const handleAddCard = () => {
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert("Error", "Please fill in all card details");
      return;
    }
    
    if (cardNumber.length < 16) {
      Alert.alert("Error", "Please enter a valid card number");
      return;
    }
    
    if (expiryDate.length < 5) {
      Alert.alert("Error", "Please enter a valid expiry date (MM/YY)");
      return;
    }
    
    if (cvv.length < 3) {
      Alert.alert("Error", "Please enter a valid CVV");
      return;
    }
    
    // In a real app, you would send this to a payment processor
    // For now, we'll just add a mock card
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: cardNumber.startsWith("4") ? "visa" : "mastercard",
      last4: cardNumber.slice(-4),
      expMonth: parseInt(expiryDate.split("/")[0]),
      expYear: parseInt("20" + expiryDate.split("/")[1]),
      isDefault: paymentMethods.length === 0 ? true : false,
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    
    // Reset form
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setShowAddCard(false);
    
    Alert.alert("Success", "Your new payment method has been added.");
  };
  
  const formatCardNumber = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "");
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    // Format with spaces every 4 digits
    const formatted = limited.replace(/(\d{4})/g, "$1 ").trim();
    return formatted;
  };
  
  const formatExpiryDate = (text: string): string => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, "");
    // Limit to 4 digits
    const limited = cleaned.slice(0, 4);
    
    if (limited.length > 2) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    
    return limited;
  };

  const getCardLogo = (type: "visa" | "mastercard"): string => {
    switch (type) {
      case "visa":
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png";
      case "mastercard":
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png";
      default:
        return "";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Payment Methods" }} />
      
      {!showAddCard ? (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CreditCard size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Your Payment Methods</Text>
            </View>
            
            {paymentMethods.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  You don't have any payment methods yet
                </Text>
              </View>
            ) : (
              <View style={styles.cardsContainer}>
                {paymentMethods.map((method) => (
                  <View key={method.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Image
                        source={{ uri: getCardLogo(method.type) }}
                        style={styles.cardLogo}
                        resizeMode="contain"
                      />
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {method.last4}
                    </Text>
                    
                    <Text style={styles.cardExpiry}>
                      Expires {method.expMonth}/{method.expYear}
                    </Text>
                    
                    <View style={styles.cardActions}>
                      {!method.isDefault && (
                        <TouchableOpacity 
                          style={styles.cardAction}
                          onPress={() => handleSetDefault(method.id)}
                        >
                          <Check size={16} color={Colors.primary} />
                          <Text style={styles.cardActionText}>Set Default</Text>
                        </TouchableOpacity>
                      )}
                      
                      <TouchableOpacity 
                        style={[styles.cardAction, styles.deleteAction]}
                        onPress={() => handleDeleteCard(method.id)}
                      >
                        <Trash2 size={16} color={Colors.error} />
                        <Text style={styles.deleteActionText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            <Button
              title="Add New Payment Method"
              onPress={() => setShowAddCard(true)}
              icon={<Plus size={20} color="#fff" />}
              style={styles.addButton}
            />
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Payment Security</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Your payment information is secure</Text>
              <Text style={styles.infoText}>
                We use industry-standard encryption to protect your payment information. 
                Your card details are never stored on our servers and are securely 
                processed by our payment provider.
              </Text>
              
              <TouchableOpacity 
                style={styles.infoLink}
                onPress={() => Alert.alert("Payment Security", "Our detailed payment security information would be displayed here.")}
              >
                <Text style={styles.infoLinkText}>Learn more about payment security</Text>
                <ChevronRight size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Add New Card</Text>
          </View>
          
          <View style={styles.formCard}>
            <Input
              label="Card Number"
              value={cardNumber}
              onChangeText={(text: string) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19} // 16 digits + 3 spaces
              style={styles.input}
            />
            
            <Input
              label="Cardholder Name"
              value={cardName}
              onChangeText={setCardName}
              placeholder="John Doe"
              style={styles.input}
            />
            
            <View style={styles.rowInputs}>
              <Input
                label="Expiry Date"
                value={expiryDate}
                onChangeText={(text: string) => setExpiryDate(formatExpiryDate(text))}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5} // MM/YY
                style={[styles.input, styles.halfInput]}
              />
              
              <Input
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                style={[styles.input, styles.halfInput]}
              />
            </View>
            
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSaveCard(!saveCard)}
              >
                <View style={[styles.checkboxBox, saveCard && styles.checkboxChecked]}>
                  {saveCard && <Check size={12} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  Save this card for future payments
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formActions}>
              <Button
                title="Cancel"
                onPress={() => setShowAddCard(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              
              <Button
                title="Add Card"
                onPress={handleAddCard}
                style={styles.submitButton}
              />
            </View>
            
            <View style={styles.securityNote}>
              <Shield size={16} color={Colors.textSecondary} />
              <Text style={styles.securityNoteText}>
                Your payment information is encrypted and secure
              </Text>
            </View>
          </View>
        </View>
      )}
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
  emptyState: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  cardsContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardLogo: {
    width: 60,
    height: 30,
  },
  defaultBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primary,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  cardExpiry: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  cardActionText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  deleteAction: {
    marginLeft: 16,
  },
  deleteActionText: {
    fontSize: 14,
    color: Colors.error,
    marginLeft: 4,
  },
  addButton: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLinkText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  checkboxContainer: {
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  securityNoteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});