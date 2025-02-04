import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import fallbackImage from "../assets/images/Fallback-image.jpg";
import moment from "moment";

interface ReservationSlot {
  _id: string;
  date: string;
  slots: number;
}

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  cuisine: string;
  description: string;
  reservationSlots: ReservationSlot[];
  admin: {
    _id: string;
    name: string;
    email: string;
  };
  image: string | null;
}

const RestaurantDetailsScreen = ({ route, navigation }: any) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `https://restaurant-reservation-application-bq2w.onrender.com/api/get-restaurants/${restaurantId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRestaurant(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load restaurant details.");
        setLoading(false);
      });
  }, [restaurantId]);

  if (loading) {
    return (
      <ScreenWrapper title="Restaurant Details" navigation={navigation}>
        <ActivityIndicator size="large" color="#F09E61" />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper title="Restaurant Details" navigation={navigation}>
        <Text>{error}</Text>
      </ScreenWrapper>
    );
  }

  if (!restaurant) {
    return (
      <ScreenWrapper title="Restaurant Details" navigation={navigation}>
        <Text>No restaurant found.</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Restaurant Details" navigation={navigation}>
      <ScrollView style={styles.container}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <Text>{restaurant.location}</Text>
        <Text>{restaurant.description}</Text>

        <Text style={styles.subTitle}>Reservation Slots:</Text>
        {restaurant.reservationSlots.length > 0 ? (
          restaurant.reservationSlots.map((slot) => (
            <View key={slot._id} style={styles.slot}>
              <Text>{moment(slot.date).format('lll')}</Text>
              <Text>Available Slots: {slot.slots}</Text>
            </View>
          ))
        ) : (
          <Text>No available slots.</Text>
        )}

        <Button
          title="Reserve Now"
          onPress={() => navigation.navigate("Payment")}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cuisine: {
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 10,
  },
  subTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  slot: {
    marginVertical: 10,
  },
});

export default RestaurantDetailsScreen;
