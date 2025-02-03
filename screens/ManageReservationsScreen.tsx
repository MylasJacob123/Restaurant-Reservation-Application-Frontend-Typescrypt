import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

const ManageReservationsScreen: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    // Fetch reservation data (you can replace this with a real API request)
    const fetchReservations = async () => {
      // Simulate API call
      const fetchedReservations = [
        { id: "1", name: "John Doe", date: "2025-02-05", status: "Pending" },
        { id: "2", name: "Jane Smith", date: "2025-02-06", status: "Confirmed" },
      ];
      setReservations(fetchedReservations);
    };

    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Reservations</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reservationCard}>
            <Text>Name: {item.name}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Status: {item.status}</Text>
            <Button title="Change Status" onPress={() => alert("Change Status")} />
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
  reservationCard: {
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

export default ManageReservationsScreen;
