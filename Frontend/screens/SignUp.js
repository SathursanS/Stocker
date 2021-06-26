import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";

const SignUp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Username"
          leftIcon={<Icon name="user" size={24} color="#cfd8dc" />}
        />

        <Input
          placeholder="Email"
          leftIcon={<Icon name="envelope" size={18} color="#cfd8dc" />}
        />

        <Input
          placeholder="Password"
          leftIcon={<Icon name="lock" size={24} color="#cfd8dc" />}
        />

        <Input
          placeholder="Confirm Password"
          leftIcon={<Icon name="lock" size={24} color="#cfd8dc" />}
        />

        <Button title="Sign Up" containerStyle={{ marginTop: 30 }} />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    color: "#1e88e5",
    padding: 10,
    margin: 20,
  },
  inputContainer: {
    width: "75%",
  },
});
