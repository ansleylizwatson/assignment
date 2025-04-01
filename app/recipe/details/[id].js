import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getItemById, deleteItem } from '../../database/db';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const itemData = await getItemById(parseInt(id));
      if (itemData) {
        setItem(itemData);
      } else {
        Alert.alert('Error', 'Item not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Error', 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = () => {
    router.push(`/item/edit/${id}`);
  };

  const handleDeleteItem = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(parseInt(id));
              router.replace('/');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {item.image_uri ? (
          <Image source={{ uri: item.image_uri }} style={styles.itemImage} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          
          <View style={styles.itemMetaContainer}>
            {item.category_name ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Category:</Text>
                <Text style={styles.metaValue}>{item.category_name}</Text>
              </View>
            ) : null}
            
            {item.location_name ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Location:</Text>
                <Text style={styles.metaValue}>{item.location_name}</Text>
              </View>
            ) : null}

            {item.quantity ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Quantity:</Text>
                <Text style={styles.metaValue}>{item.quantity}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {item.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>
          
          {item.purchase_date ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Purchase Date:</Text>
              <Text style={styles.detailValue}>{item.purchase_date}</Text>
            </View>
          ) : null}

          {item.purchase_price ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price:</Text>
              <Text style={styles.detailValue}>${item.purchase_price.toFixed(2)}</Text>
            </View>
          ) : null}

          {item.warranty_expiry ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Warranty Expires:</Text>
              <Text style={styles.detailValue}>{item.warranty_expiry}</Text>
            </View>
          ) : null}

          {item.serial_number ? (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Serial Number:</Text>
              <Text style={styles.detailValue}>{item.serial_number}</Text>
            </View>
          ) : null}
        </View>

        {item.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditItem}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteItem}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  itemImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
  },
  itemHeader: {
    padding: 16,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemMetaContainer: {
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    width: 100,
  },
  metaValue: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  detailValue: {
    flex: 1,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});