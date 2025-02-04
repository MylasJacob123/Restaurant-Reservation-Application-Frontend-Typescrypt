import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ScreenWrapper from "../components/ScreenWrapper";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../store"; 

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
  const [selectedSlot, setSelectedSlot] = useState<ReservationSlot | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

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

  const handleReserve = async () => {
    if (!selectedSlot || !restaurant || !user) return;

    try {
      const reservationData = {
        user: user._id, 
        restaurant: restaurant._id,
        date: selectedSlot.date,
        status: "confirmed",
      };

      const authData = await AsyncStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).token : null;
      console.log("The token", token);

      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(
        "https://restaurant-reservation-application-bq2w.onrender.com/api/add-reservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigation.navigate("Payment", { reservation: data });
      } else {
        setError(data.error || "Failed to reserve");
      }
    } catch (error) {
      setError("Error occurred while making reservation.");
      console.error("Error:", error);
    }
  };

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
              <Text>{moment(slot.date).format("lll")}</Text>
              <Text>Available Slots: {slot.slots}</Text>
              <Button
                title="Select Slot"
                onPress={() => setSelectedSlot(slot)}
                color={selectedSlot?._id === slot._id ? "#F09E61" : "#000"}
              />
            </View>
          ))
        ) : (
          <Text>No available slots.</Text>
        )}

        <Button
          title="Reserve Now"
          onPress={handleReserve}
          disabled={!selectedSlot}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cuisine: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  slot: {
    marginBottom: 10,
  },
});

export default RestaurantDetailsScreen;
