import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { ListItem, Avatar, Header } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { SearchBar, Button } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import CustomModal from '../components/customModal/customModal';
import { MainContext } from '../context/MainContext';

const FindPeople = () => {
  const context = useContext(MainContext);

  const [search, setSearch] = useState('');
  const [currentTracking, setCurrentTracking] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioData, setPortfolioData] = useState({
    tickers: [],
    shares: [],
    totalCost: 0,
    tickerInfoArray: [],
  });

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

      response = await fetch('http://localhost:5000/api/StockPortfolio', {
        method: 'GET',
        headers: {
          'x-access-tokens': authToken,
        },
      });

      json = await response.json();

      setCurrentTracking(json.stockPortfolioDICT.trackingArray);
      context.updateProfileFunction();
    });
  };

  useEffect(() => {
    handleFetchPeople();
  }, [currentTracking]);

  useEffect(() => {
    handleFetchTracking();
  }, []);

  const handlePersonPortfolio = async (item) => {
    let totalCost = 0;
    let tickerInfoArray = [];

    setLoading(true);

    getToken().then(async (token) => {
      for (let i = 0; i < item.tickerArray.length; i++) {
        let response;
        let json;
        response = await fetch('http://localhost:5000/stockInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': token,
          },
          body: JSON.stringify({ TICKER: item.tickerArray[i] }),
        });

        json = await response.json();

        totalCost = totalCost + json.regularMarketPrice * item.shareArray[i];
        tickerInfoArray.push({
          longName: json.longName,
          sector: json.sector,
          regularMarketPrice: json.regularMarketPrice,
        });
      }
      setPortfolioName(item.userName);
      setPortfolioData({
        tickers: item.tickerArray,
        shares: item.shareArray,
        totalCost,
        tickerInfoArray,
      });
      setOpen(true);
      setLoading(false);
    });
  };

  const handleFetchPeople = async () => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;

      response = await fetch('http://localhost:5000/api/getAllPortfolio', {
        method: 'GET',
        headers: {
          'x-access-tokens': authToken,
        },
      });

      json = await response.json();
      setData(json.data);
    });
  };

  const renderPortfolioData = ({ item, index }) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item}</ListItem.Title>
          <ListItem.Subtitle>
            {portfolioData.tickerInfoArray[index].longName}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content style={{ justifyContent: 'center' }}>
          <ListItem.Title>
            {portfolioData.tickerInfoArray[index].sector}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Content
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          <ListItem.Title>
            {`${(
              ((portfolioData.tickerInfoArray[index].regularMarketPrice *
                portfolioData.shares[index]) /
                portfolioData.totalCost) *
              100
            ).toFixed(2)}%`}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  const handleTrackOrRemove = async (username, tracking) => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;

      if (tracking) {
        response = await fetch('http://localhost:5000/api/unfollow', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': authToken,
          },
          body: JSON.stringify({ userName: username }),
        });
      } else {
        response = await fetch('http://localhost:5000/api/follow', {
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
      <>
        {isTracking && (
          <TouchableOpacity
            onPress={() => handlePersonPortfolio(item)}
            style={styles.item}
          >
            <View>
              {loading && <ActivityIndicator size="large" color="#0066CC" />}
              {!loading && <Text style={styles.username}>{item.userName}</Text>}
            </View>

            <Button
              title="Remove"
              type="outline"
              buttonStyle={{
                width: 90,
                height: 30,
                borderColor: '#ff6b6b',
                borderWidth: 1,
              }}
              onPress={() => handleTrackOrRemove(item.userName, isTracking)}
              titleStyle={{
                color: '#ff6b6b',
              }}
            />
          </TouchableOpacity>
        )}
        {!isTracking && (
          <View style={styles.item}>
            <View>
              {loading && <ActivityIndicator size="large" color="#0066CC" />}
              {!loading && <Text style={styles.username}>{item.userName}</Text>}
            </View>

            <Button
              title="Track"
              type="solid"
              buttonStyle={{
                width: 90,
                height: 30,
              }}
              onPress={() => handleTrackOrRemove(item.userName, isTracking)}
              titleStyle={{
                color: 'white',
              }}
            />
          </View>
        )}
      </>
    );
  };

  return (
    <>
      <CustomModal open={open} setOpen={setOpen}>
        <View style={{ backgroundColor: 'white', width: '100%' }}>
          <Text
            style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}
          >{`${portfolioName}'s Portfolio`}</Text>
          <FlatList
            data={portfolioData.tickers}
            renderItem={renderPortfolioData}
            keyExtractor={(item) => item.id}
          />
        </View>
      </CustomModal>
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
    </>
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
