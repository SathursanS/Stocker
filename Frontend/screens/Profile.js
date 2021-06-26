import React, { useContext } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { MainContext } from '../context/MainContext';

const Profile = () => {
  const context = useContext(MainContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile :)</Text>
      <Button
        title="Update News"
        onPress={() => context.setUpdateNews(!context.updateNews)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9e9e9e',
  },
});

export default Profile;
