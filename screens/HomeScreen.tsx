import React, { useEffect } from "react";
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
// import moment from "moment";
import { RootState } from "../redux/store";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  cuisine: string;
  image: string;
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
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        dispatch(setError("Failed to load restaurants"));
        dispatch(setLoading(false));
      }
    };

    fetchRestaurants();
  }, [dispatch]);

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
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Welcome to Restaurant Finder</Text>
        <Text style={styles.subtitle}>
          Discover and Reserve Top Restaurants
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Restaurants</Text>
          <TouchableOpacity onPress={() => navigation.navigate("DiscoverPage")}>
            <Text style={styles.redirectText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={restaurants.slice(0, 5)}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("RestaurantDetails", { restaurant: item })
              }
            >
              <View style={styles.card}>
                <ImageBackground
                  source={fallbackImage}
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
            <Text style={styles.redirectText}>Explore More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
        >
          <View style={styles.categoriesContainer}>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryText}>Italian</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryText}>Chinese</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryText}>Fast Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryText}>Fine Dining</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.sectionBottom}>
        <Text style={styles.subheading}>Restaurants</Text>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <ImageBackground
                  source={fallbackImage}
                  style={styles.fallbackImage}
                  imageStyle={{ borderRadius: 8 }}
                >
                  <View style={styles.textOverlay}>
                    <Text style={styles.restaurantName}>
                      {item.name || "Restaurant"}
                    </Text>
                    <Text style={styles.restaurantInfo}>
                      {item.location || "Location"}
                    </Text>
                    <Text style={styles.restaurantInfo}>
                      {item.cuisine || "Cuisine"}
                    </Text>
                  </View>
                </ImageBackground>
              )}
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
    marginTop: 40,
    marginBottom: 40,
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
    fontWeight: "bold",
    color: "#333",
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
    backgroundColor: "#ddd",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionBottom: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    width: "100%",
    padding: 10,
    marginTop: 40,
    marginBottom: 40,
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
  restaurantInfo: {
    fontSize: 14,
    color: "#ddd",
    textAlign: "center",
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
