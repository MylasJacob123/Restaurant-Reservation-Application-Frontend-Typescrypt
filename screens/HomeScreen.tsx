import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurants, setLoading, setError } from "../redux/dbSlice";
import fallbackImage from "../assets/images/Fallback-image.jpg";
import { RootState } from "../redux/store";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  cuisine: string;
  image: string | null;
  reservationSlots: Array<{
    _id: string;
    date: string;
    slots: number;
  }>;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector(
    (state: RootState) => state.db
  );

  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [filteredRestaurants, setFilteredRestaurants] =
    useState<Restaurant[]>(restaurants);

  useEffect(() => {
    const fetchRestaurants = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(
          "https://restaurant-reservation-application-bq2w.onrender.com/api/get-restaurants"
        );
        const data: Restaurant[] = await response.json();
        dispatch(setRestaurants(data));
        dispatch(setLoading(false));
        setFilteredRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        dispatch(setError("Failed to load restaurants"));
        dispatch(setLoading(false));
      }
    };

    fetchRestaurants();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCuisine) {
      setFilteredRestaurants(
        restaurants.filter(
          (r) => r.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
        )
      );
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [selectedCuisine, restaurants]);

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F09E61" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Welcome to Restaurant Finder</Text>
        <Text style={styles.subtitle}>
          Discover and Reserve Top Restaurants
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
            <Text style={styles.redirectText}>View All</Text>
          </TouchableOpacity> */}
        </View>
        <FlatList
          horizontal
          data={restaurants.slice(0, 5)}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RestaurantDetails", {
                  restaurantId: item._id,
                })
              }
            >
              <View style={styles.card}>
                <ImageBackground
                  source={item.image ? { uri: item.image } : fallbackImage}
                  style={styles.image}
                  imageStyle={{ borderRadius: 8 }}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.cardText}>{item.name}</Text>
                    <Text style={styles.cardSubText}>{item.location}</Text>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Categories</Text>
          <TouchableOpacity>
            <Text
              style={styles.redirectText}
              onPress={() => navigation.navigate("Explore")}
            >
              Explore More
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCuisine === null && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCuisine(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCuisine === null && styles.selectedCategoryText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {cuisines.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  styles.categoryCard,
                  selectedCuisine === cuisine && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCuisine(cuisine)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCuisine === cuisine && styles.selectedCategoryText,
                  ]}
                >
                  {cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.sectionBottom}>
        <Text style={styles.subheading}>New Restaurants</Text>
        <FlatList
          data={filteredRestaurants.slice(-6)}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("RestaurantDetails", {
                  restaurantId: item._id,
                })
              }
            >
              <ImageBackground
                source={item.image ? { uri: item.image } : fallbackImage}
                style={styles.fallbackImage}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.textOverlay}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantLocation}>{item.location}</Text>
                  <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8f9fa",
    padding: 10,
    marginTop: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  headerSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "lighter",
    color: "#F09E61",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  redirectText: {
    fontSize: 14,
    color: "#F09E61",
  },
  card: {
    width: 150,
    height: 100,
    marginRight: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  cardSubText: {
    fontSize: 12,
    color: "#ddd",
  },
  scrollContainer: {
    flexGrow: 0,
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  categoryCard: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "lightgray",
    marginRight: 10,
    marginBottom: 0,
    borderRadius: 5,
    minWidth: 80,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  categoryText: {
    color: "white",
    fontWeight: "lighter",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: "#F09E61",
  },
  selectedCategoryText: {
    color: "whitesmoke",
  },
  sectionBottom: {
    flex: 1,
    // backgroundColor: "#f8f9fa",
    width: "100%",
    padding: 10,
    marginTop: 15,
    marginBottom: 40,
    // height: 500,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#212529",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F09E61",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  fallbackImage: {
    width: "100%",
    height: 190,
    marginBottom: 10,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  textOverlay: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  restaurantName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  restaurantLocation: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: "#F09E61",
  },
  reservationContainer: {
    marginTop: 10,
  },
  reservationHeading: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  reservationInfo: {
    fontSize: 12,
    color: "#ddd",
  },
});

export default HomeScreen;
