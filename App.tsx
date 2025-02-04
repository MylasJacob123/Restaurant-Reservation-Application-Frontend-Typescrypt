import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { loadAuthState } from "./redux/authSlice";
import LandingPageScreen from "./screens/LandingPageScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import RestaurantDetailsScreen from "./screens/RestaurantDetailsScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ConfirmPaymentScreen from "./screens/ConfirmPaymentScreen";
import AdminTab from "./screens/AdminTabScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import UserTab from "./screens/UserTabScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainNavigator() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem("auth");
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          dispatch(loadAuthState(parsedAuth));
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      }
    };

    loadAuth();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authState.token ? (
          authState.user?.id === "admin-id" ? (
            <Stack.Screen name="AdminTabs" component={AdminTab} />
          ) : (
            <Stack.Screen name="UserTabs" component={UserTab} />
          )
        ) : (
          <>
            <Stack.Screen name="LandingPage" component={LandingPageScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="Forgot-Password"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="Reset-Password"
              component={ResetPasswordScreen}
            />
          </>
        )}
        <Stack.Screen
          name="RestaurantDetails"
          component={RestaurantDetailsScreen}
        />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
