import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { ListItem, Avatar, Header } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { SearchBar, Button } from 'react-native-elements';
import Toast from 'react-native-toast-message';

const FindPeople = () => {
  const [search, setSearch] = useState('');
  const [currentTracking, setCurrentTracking] = useState([]);

  const getToken = () => {
    return SecureStore.getItemAsync('auth_token');
  };

  const [data, setData] = useState([]);

  const [result, setResult] = useState([]);

  const handleFetchTracking = async () => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;

      response = await fetch('http://10.0.0.120:5000/api/StockPortfolio', {
        method: 'GET',
        headers: {
          'x-access-tokens': authToken,
        },
      });

      json = await response.json();

      setCurrentTracking(json.stockPortfolioDICT.trackingArray);
    });
  };

  useEffect(() => {
    handleFetchPeople();
  }, [currentTracking]);

  useEffect(() => {
    handleFetchTracking();
  }, []);

  const handleFetchPeople = async () => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;

      response = await fetch('http://10.0.0.120:5000/api/getAllPortfolio', {
        method: 'GET',
        headers: {
          'x-access-tokens': authToken,
        },
      });

      json = await response.json();
      setData(json.data);
    });
  };

  const handleTrackOrRemove = async (username, tracking) => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;

      if (tracking) {
        response = await fetch('http://10.0.0.120:5000/api/unfollow', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': authToken,
          },
          body: JSON.stringify({ userName: username }),
        });
      } else {
        response = await fetch('http://10.0.0.120:5000/api/follow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': authToken,
          },
          body: JSON.stringify({ userName: username }),
        });
      }
      json = await response.json();

      if (json.message === 'You do not track anyone') {
        Toast.show({
          text1: 'Error',
          text2: 'You are not tracking anyone.',
          type: 'error',
        });
      } else if (json.message === 'You do not have any followers') {
        Toast.show({
          text1: 'Error',
          text2:
            'The person that you are trying to remove does not have any trackers.',
          type: 'error',
        });
      } else if (
        json.message === 'You have unfollowed' ||
        json.message === 'Tracking!'
      ) {
        //REFETCH DATA
        handleFetchTracking();
      }
    });
  };

  useEffect(() => {
    if (search === '') {
      setResult(
        data.filter((person) => currentTracking.includes(person.userName))
      );
    } else {
      setResult(
        data.filter((person) =>
          person.userName.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, data]);

  const renderItem = ({ item }) => {
    let isTracking = currentTracking.includes(item.userName);
    return (
      <View style={styles.item}>
        <View>
          <Text style={styles.username}>{item.userName}</Text>
        </View>

        <Button
          title={isTracking ? 'Remove' : 'Track'}
          type={isTracking ? 'outline' : 'solid'}
          buttonStyle={{
            width: 90,
            height: 30,
            borderColor: isTracking ? '#ff6b6b' : null,
            borderWidth: isTracking ? 1 : null,
          }}
          onPress={() => handleTrackOrRemove(item.userName, isTracking)}
          titleStyle={{
            color: isTracking ? '#ff6b6b' : 'white',
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ height: '100%' }}>
      <SearchBar
        placeholder="Search for people..."
        onChangeText={(search) => {
          setSearch(search);
        }}
        value={search}
        containerStyle={{
          backgroundColor: '#fff',
          borderBottomWidth: 0,
          elevation: 0,
        }}
        inputContainerStyle={{
          height: 40,
          borderWidth: 0,
          backgroundColor: '#ddd',
        }}
        inputStyle={{ fontSize: 14 }}
        round={true}
      />
      <SafeAreaView style={styles.container}>
        {search === '' && (
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              padding: 10,
            }}
          >
            Currently Tracking:
          </Text>
        )}
        {result.length === 0 && (
          <Text style={{ fontSize: 30, padding: 10, textAlign: 'center' }}>
            Nobody :(
          </Text>
        )}
        <FlatList
          data={result}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    height: 75,
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  email: {
    color: '#636e72',
    fontSize: 14,
  },
});

export default FindPeople;
