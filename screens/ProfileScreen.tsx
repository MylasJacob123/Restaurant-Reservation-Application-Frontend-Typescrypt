import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../redux/authSlice";
import { RootState, AppDispatch } from "../redux/store";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      navigation.replace("Login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://restaurant-reservation-application-bq2w.onrender.com/api/users/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          setError(data.error || "Failed to fetch user details");
        }
      } catch (error) {
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user, token]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("auth");
      dispatch(logout());
      navigation.navigate("LandingPage");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Image
            source={{
              uri: userData?.profileImage || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
          {/* <Text style={styles.role}>Role: {userData?.role}</Text> */}
          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 18,
    color: "gray",
  },
  role: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
