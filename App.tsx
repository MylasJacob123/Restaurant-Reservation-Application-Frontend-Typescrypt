import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { store } from "./redux/store"; 
import { Provider } from "react-redux";
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

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Forgot-Password" component={ForgotPasswordScreen} />
      <Stack.Screen name="Reset-Password" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingPage" component={LandingPageScreen} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Forgot-Password" component={ForgotPasswordScreen} />
        <Stack.Screen name="Reset-Password" component={ResetPasswordScreen} />
        <Stack.Screen name="UserTabs" component={UserTab} />
        <Stack.Screen name="AdminTabs" component={AdminTab} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="ConfirmPayment" component={ConfirmPaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
