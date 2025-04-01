import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { addItem } from '../database/db';

export default function AddItemScreen() {
  const [item, setItem] = useState({
    name: '',
    quantity: '1',
    category_id: null,
    location_id: null,
    description: '',
    purchase_date: '',
    purchase_price: '',
    warranty_expiry: '',
    serial_number: '',
    notes: '',
    image_uri: ''
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleItemChange = (key, value) => {
    setItem(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveItem = async () => {
    // Validate form
    if (!item.name.trim()) {
      Alert.alert('Error', 'Item name is required');
      return;
    }

    if (!item.quantity || isNaN(parseInt(item.quantity))) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      
      // Convert numeric fields
      const itemToSave = {
        ...item,
        quantity: parseInt(item.quantity),
        purchase_price: item.purchase_price ? parseFloat(item.purchase_price) : null
      };
      
      await addItem(itemToSave);
      Alert.alert('Success', 'Item saved successfully', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Item Information</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              value={item.name}
              onChangeText={(value) => handleItemChange('name', value)}
              placeholder="Enter item name"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              value={item.quantity}
              onChangeText={(value) => handleItemChange('quantity', value)}
              placeholder="Enter quantity"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Category</Text>
            {/* In a real app, you'd use a Picker component here */}
            <TextInput
              style={styles.input}
              value={item.category_name || ''}
              onChangeText={(value) => handleItemChange('category_id', value)}
              placeholder="Select category"
              editable={false}
              onPressIn={() => router.push('/categories')}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Location</Text>
            {/* In a real app, you'd use a Picker component here */}
            <TextInput
              style={styles.input}
              value={item.location_name || ''}
              onChangeText={(value) => handleItemChange('location_id', value)}
              placeholder="Select location"
              editable={false}
              onPressIn={() => router.push('/locations')}
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(value) => handleItemChange('description', value)}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Purchase Date</Text>
            <TextInput
              style={styles.input}
              value={item.purchase_date}
              onChangeText={(value) => handleItemChange('purchase_date', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Purchase Price</Text>
            <TextInput
              style={styles.input}
              value={item.purchase_price}
              onChangeText={(value) => handleItemChange('purchase_price', value)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Warranty Expiry</Text>
            <TextInput
              style={styles.input}
              value={item.warranty_expiry}
              onChangeText={(value) => handleItemChange('warranty_expiry', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Serial Number</Text>
            <TextInput
              style={styles.input}
              value={item.serial_number}
              onChangeText={(value) => handleItemChange('serial_number', value)}
              placeholder="Enter serial number"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.notes}
              onChangeText={(value) => handleItemChange('notes', value)}
              placeholder="Enter any additional notes"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={item.image_uri}
              onChangeText={(value) => handleItemChange('image_uri', value)}
              placeholder="Enter image URL"
            />
          </View>
        </View>
        
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSaveItem}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving...' : 'Save Item'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    flex: 1,
  },
  formSection: {
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 80,
  },
  submitButtonContainer: {
    margin: 16,
  },
  submitButton: {
    backgroundColor: '#4dabf7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});