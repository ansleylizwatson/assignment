// app/index.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCategories, getLocations, initDatabase, insertDefaultData } from './database/db';

export default function HomeScreen() {
  initDatabase(); // Initialize database
  insertDefaultData(); // Insert default categories and locations
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      // In a real app, you would have a getItems function in your db.js
      // For now, we'll use an empty array since your db.js doesn't have getItems yet
      const itemsData = []; // await getItems();
      setItems(itemsData);
      setFilteredItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filtered = items.filter(
        item => 
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  };

  const navigateToItemDetail = (id) => {
    router.push(`/item/details/${id}`);
  };

  const navigateToAddItem = () => {
    router.push('/item/add');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigateToItemDetail(item.id)}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.quantity ? `Qty: ${item.quantity} • ` : ''}
          {item.location ? `${item.location} • ` : ''}
          {item.category || 'No category'}
        </Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchTerm}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.itemList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchTerm
                  ? "No items match your search"
                  : "No items yet. Add your first item!"}
              </Text>
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={navigateToAddItem}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  itemList: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDetails: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 4,
  },
  itemDescription: {
    color: '#757575',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 32,
    color: 'white',
    marginTop: -4,
  },
});