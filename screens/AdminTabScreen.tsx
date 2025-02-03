import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import ManageReservationsScreen from "../screens/ManageReservationsScreen";
import ManageRestaurantsScreen from "../screens/ManageRestaurantsScreen";

const Tab = createBottomTabNavigator();

const AdminTab: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Manage Reservations"
        component={ManageReservationsScreen}
        options={{
          tabBarLabel: "Manage Reservations",
          tabBarIcon: () => <Text>🔑</Text>, 
        }}
      />
      <Tab.Screen
        name="Manage Restaurants"
        component={ManageRestaurantsScreen}
        options={{
          tabBarLabel: "Manage Restaurants",
          tabBarIcon: () => <Text>🍽️</Text>, 
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTab;