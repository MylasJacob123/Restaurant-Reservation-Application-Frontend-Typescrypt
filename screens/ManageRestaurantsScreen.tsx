import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

const ManageRestaurantsScreen: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    // Fetch restaurant data (you can replace this with a real API request)
    const fetchRestaurants = async () => {
      // Simulate API call
      const fetchedRestaurants = [
        { id: "1", name: "Restaurant A", location: "New York", status: "Open" },
        { id: "2", name: "Restaurant B", location: "Los Angeles", status: "Closed" },
      ];
      setRestaurants(fetchedRestaurants);
    };

    fetchRestaurants();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Restaurants</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.restaurantCard}>
            <Text>Name: {item.name}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Status: {item.status}</Text>
            <Button title="Edit" onPress={() => alert("Edit Restaurant")} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default ManageRestaurantsScreen;
