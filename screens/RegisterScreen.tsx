import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../redux/authSlice";
import backgroundImage from "../assets/images/girafe_enhanced.png";
import logoImage from "../assets/images/Charcoal_Black_Minimalist_Typographic_Cafe_Bar_Restaurant_Logo__1_-removebg-preview 2_enhanced.png";
import { StackNavigationProp } from "@react-navigation/stack";

type RegisterScreenNavigationProp = StackNavigationProp<any, "RegisterScreen">;

interface RegisterPageProps {
  navigation: RegisterScreenNavigationProp;
}

const RegisterPageScreen: React.FC<RegisterPageProps> = ({ navigation }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  const validateForm = (): boolean => {
    if (!name) {
      Alert.alert("Error", "Name is required.");
      return false;
    }
    if (!email || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return false;
    }
    if (!role) {
      Alert.alert("Error", "Please select a role.");
      return false;
    }
    return true;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateForm()) return;

    dispatch(registerStart());

    try {
      const response = await fetch(
        "https://restaurant-reservation-application-bq2w.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        dispatch(registerFailure(data.error || "Registration failed."));
        Alert.alert("Error", data.error || "Registration failed.");
      } else {
        dispatch(registerSuccess({ user: data.user, token: data.token }));
        Alert.alert("Success", "Registration successful!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      }
    } catch (err) {
      dispatch(registerFailure("An error occurred. Please try again."));
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.imageBackground}>
        <Image source={logoImage} style={styles.image} />
      </ImageBackground>

      <View style={styles.body}>
        <Text style={styles.heading}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.roleButton}>Select Role</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.text}>
          Already have an account?
          <Text
            style={styles.loginButtonText}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>
      </View>

      <Modal visible={isModalVisible} transparent={true}>
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setRole("admin");
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalText}>Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setRole("user");
              setModalVisible(false);
            }}
          >
            <Text style={styles.modalText}>User</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "46%",
    borderRadius: 30,
  },
  image: {
    marginTop: 50,
    width: "50%",
    height: 90,
    backgroundColor: "rgba(0,0,0, .05)",
    position: "absolute",
    top: "10%",
    left: "25%",
  },
  body: {
    width: "100%",
    height: "50%",
    position: "absolute",
    top: "50%",
    alignItems: "center",
    gap: 15,
  },
  heading: {
    fontWeight: "540",
    fontSize: 25,
    color: "#F09E61",
  },
  input: {
    borderWidth: 1,
    borderColor: "#F09E61",
    width: "90%",
    color: "#808080",
    borderRadius: 10,
    padding: 12,
    height: 48,
  },
  button: {
    backgroundColor: "#F09E61",
    width: "90%",
    height: 48,
    borderRadius: 10,
  },
  buttonText: {
    marginTop: 8,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
  },
  text: {
    color: "#808080",
    width: "60%",
    padding: 5,
    textAlign: "center",
  },
  loginButtonText: {
    color: "#F09E61",
    fontSize: 17,
    marginTop: 10,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalButton: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalText: {
    fontSize: 18,
  },
  roleButton: {
    color: "#F09E61",
    fontSize: 17,
  },
});

export default RegisterPageScreen;
