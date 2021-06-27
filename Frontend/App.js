import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainProvider } from './context/MainContext';
import Navbar from './components/navbar/navbar';
import Toast from 'react-native-toast-message';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import FindPeople from './screens/FindPeople';

const Stack = createStackNavigator();

export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* <Text>Stocker App for Eng Hack 2021!</Text>
    //   <StatusBar style="auto" /> */}

    // </View>
    <MainProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={Login}
          ></Stack.Screen>
          <Stack.Screen name="Signup" component={SignUp}></Stack.Screen>
          <Stack.Screen
            name="Find People"
            component={FindPeople}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Navbar"
            component={Navbar}
          ></Stack.Screen>
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </MainProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
