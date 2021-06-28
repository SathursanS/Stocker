import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setToken = (token) => {
    return SecureStore.setItemAsync('auth_token', token);
  };

  const getToken = () => {
    return SecureStore.getItemAsync('auth_token');
  };

  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        navigation.navigate('Navbar');
      }
    });
  }, []);

  const handleSignIn = async () => {
    let response;
    let json;

    response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    json = await response.json();

    if (json.token) {
      setToken(json.token);
      navigation.navigate('Navbar');
    } else if (json.message === 'verify email') {
      Toast.show({
        text1: 'Verify Email',
        text2:
          'Please verify your account by clicking the link sent to your email.',
        type: 'info',
      });
    } else if (json.message === 'There was an error logging in') {
      Toast.show({
        text1: 'Error',
        text2: 'Your email or password may be incorrect.',
        type: 'error',
      });
    } else {
      Toast.show({
        text1: 'Error',
        text2: 'An error occured while trying to log in. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome</Text>

      <View style={styles.inputContainer}>
        <View style={[styles.action, { marginBottom: 20 }]}>
          <Feather
            style={{ paddingBottom: 10, color: '#1e88e5' }}
            name="mail"
            color="#05375a"
            size={20}
          />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => setEmail(val)}
          />
        </View>

        <View style={styles.action}>
          <Feather
            style={{ paddingBottom: 10, color: '#1e88e5' }}
            name="lock"
            color="#05375a"
            size={20}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => setPassword(val)}
          />
        </View>

        <Button
          title="Sign In"
          containerStyle={{ marginTop: 30 }}
          onPress={handleSignIn}
        />
        <View style={styles.createAccountContainer}>
          <Text>Don't have an account? </Text>
          <Button
            title="Sign Up"
            type="clear"
            buttonStyle={{ padding: 0 }}
            titleStyle={{ fontSize: 14 }}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    color: '#1e88e5',
    padding: 10,
    margin: 20,
  },
  inputContainer: {
    width: '75%',
  },
  createAccountContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    fontSize: 16,
  },
});

export default Login;
