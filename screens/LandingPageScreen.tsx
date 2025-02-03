import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import backgroundImage from "../assets/images/girafe_enhanced.png";
import logoImage from "../assets/images/Charcoal_Black_Minimalist_Typographic_Cafe_Bar_Restaurant_Logo__1_-removebg-preview 2_enhanced.png";

type LandingPageScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LandingPageScreen: React.FC<LandingPageScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: "60%",
    height: 90,
    marginBottom: 30,
    backgroundColor: "rgba(0,0,0, 0.05)",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    width: "70%",
    marginTop: 50
  },
  button: {
    backgroundColor: "#F09E61",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandingPageScreen;
