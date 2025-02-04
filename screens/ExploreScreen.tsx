import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import fallbackImage from "../assets/images/Fallback-image.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurants, setLoading, setError } from "../redux/dbSlice";
import { RootState } from "../redux/store";

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  cuisine: string;
  image?: string;
}

const ExploreScreen: React.FC = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector(
    (state: RootState) => state.db
  );

  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    dispatch(setLoading(true)); // Set loading state to true
    try {
      const response = await fetch(
        "https://restaurant-reservation-application-bq2w.onrender.com/api/get-restaurants"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const data = await response.json();
      dispatch(setRestaurants(data)); // Dispatch the data to Redux
      setFilteredRestaurants(data); // Set filtered restaurants locally
    } catch (error) {
      dispatch(setError("Failed to fetch restaurants")); // Dispatch error to Redux
      console.error(error);
    } finally {
      dispatch(setLoading(false)); // Set loading state to false
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    filterRestaurants(text, selectedCuisine);
  };

  const handleCategoryClick = (cuisine: string | null) => {
    setSelectedCuisine(cuisine);
    filterRestaurants(searchTerm, cuisine);
  };

  const filterRestaurants = (search: string, cuisine: string | null) => {
    let filtered = restaurants;

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.location.toLowerCase().includes(search) ||
          r.cuisine.toLowerCase().includes(search)
      );
    }

    if (cuisine) {
      filtered = filtered.filter(
        (r) => r.cuisine.toLowerCase() === cuisine.toLowerCase()
      );
    }

    setFilteredRestaurants(filtered);
  };

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, location, or cuisine..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <TouchableOpacity
          onPress={() => handleCategoryClick(null)}
          style={[
            styles.categoryButton,
            selectedCuisine === null ? styles.selectedCategory : {},
          ]}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        {cuisines.map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            onPress={() => handleCategoryClick(cuisine)}
            style={[
              styles.categoryButton,
              selectedCuisine === cuisine ? styles.selectedCategory : {},
            ]}
          >
            <Text style={styles.categoryText}>{cuisine}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#F09E61" />
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.restaurantCard}
              onPress={() =>
                navigation.navigate("RestaurantDetails", {
                  restaurantId: item._id,
                })
              }
            >
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
                    <Text style={styles.restaurantLocation}>
                      {item.location || "Location"}
                    </Text>
                    <Text style={styles.restaurantCuisine}>
                      {item.cuisine || "Cuisine"}
                    </Text>
                  </View>
                </ImageBackground>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No restaurants found.</Text>}
        />
      )}
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 25,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    paddingBottom: 15,
  },
  categoryButton: {
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
  selectedCategory: {
    backgroundColor: "#F09E61",
  },
  categoryText: {
    color: "white",
    fontWeight: "lighter",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  restaurantCard: {
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
});
