import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home Inventory',
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          title: 'Item Details',
        }}
      />
      <Stack.Screen
        name="item/add"
        options={{
          title: 'Add New Item',
          presentation: 'modal', // Optional: makes the add screen appear as a modal
        }}
      />
      <Stack.Screen
        name="item/edit/[id]"
        options={{
          title: 'Edit Item',
          presentation: 'modal', // Optional: makes the edit screen appear as a modal
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="locations"
        options={{
          title: 'Locations',
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          title: 'Category Items',
        }}
      />
      <Stack.Screen
        name="location/[id]"
        options={{
          title: 'Location Items',
        }}
      />
    </Stack>
  );
}
