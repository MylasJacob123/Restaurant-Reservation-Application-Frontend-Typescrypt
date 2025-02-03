import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  { Login: undefined },
  "Login"
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPassword: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://restaurant-reservation-application-bq2w.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email.");
      } else {
        Alert.alert(
          "Email Sent",
          "A password reset email link has been sent to your email address."
        );
        navigation.navigate("Reset-Password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity> */}

      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your email address below, and we'll send you instructions to reset
        your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Reset link"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
//   goBackButton: {
//     position: "absolute",
//     top: 30,
//     left: 20,
//     padding: 10,
//   },
//   goBackText: {
//     fontSize: 25,
//     color: "#F09E61",
//     fontWeight: "bold",
//   },
  heading: {
    fontWeight: "540",
    fontSize: 25,
    color: "#F09E61",
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#F09E61",
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#F09E61",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default ForgotPassword;
