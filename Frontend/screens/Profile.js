import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Button, Header } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { ListItem } from 'react-native-elements';
import { MainContext } from '../context/MainContext';

const Profile = ({ navigation }) => {
  const context = useContext(MainContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [trackers, setTrackers] = useState(0);
  const [tracking, setTracking] = useState(0);
  const [trackerList, setTrackersList] = useState([]);
  const [trackingList, setTrackingList] = useState([]);
  const [tickerList, setTickerList] = useState([]);
  const [shareList, setShareList] = useState([]);
  const [portfolioData, setPortfolioData] = useState({
    tickers: [],
    shares: [],
    totalCost: 0,
    tickerInfoArray: [],
  });

  const getToken = () => {
    return SecureStore.getItemAsync('auth_token');
  };

  const removeToken = () => {
    return SecureStore.deleteItemAsync('auth_token');
  };

  const fetchEmail = async () => {
    let response;
    let json;

    getToken().then(async (token) => {
      response = await fetch('http://localhost:5000/api/userdata', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': token,
        },
      });

      json = await response.json();
      setEmail(json.data.firebase.identities.email[0]);

      fetchStockPortfolio();
    });
  };

  const fetchStockPortfolio = async () => {
    let response;
    let json;

    getToken().then(async (token) => {
      response = await fetch('http://localhost:5000/api/StockPortfolio', {
        method: 'GET',
        headers: {
          'x-access-tokens': token,
        },
      });

      json = await response.json();

      console.log(json);

      setTrackersList(json.stockPortfolioDICT.trackersArray);
      setTrackingList(json.stockPortfolioDICT.trackingArray);
      setTickerList(json.stockPortfolioDICT.tickerArray);
      setShareList(json.stockPortfolioDICT.shareArray);
      setTrackers(trackerList.length);
      setTracking(trackingList.length);
      setUsername(json.stockPortfolioDICT.userName);

      if (trackerList.length === 1 && trackerList[0] === '') {
        setTrackers(0);
      }

      if (trackingList.length === 1 && trackingList[0] === '') {
        setTracking(0);
      }

      fetchUserPortfolio();
    });
  };

  const fetchUserPortfolio = async () => {
    let totalCost = 0;
    let tickerInfoArray = [];
    console.log('fetching user profile');

    getToken().then(async (token) => {
      for (let i = 0; i < tickerList.length; i++) {
        let response;
        let json;

        response = await fetch('http://localhost:5000/stockInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': token,
          },
          body: JSON.stringify({ TICKER: tickerList[i] }),
        });

        json = await response.json();

        totalCost = totalCost + json.regularMarketPrice * shareList[i];

        tickerInfoArray.push({
          longName: json.longName,
          sector: json.sector,
          regularMarketPrice: json.regularMarketPrice,
        });
      }
      setPortfolioData({
        tickers: tickerList,
        shares: shareList,
        totalCost,
        tickerInfoArray,
      });
    });
  };

  useEffect(() => {
    fetchEmail();
  }, [context.updateProfile]);

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
          <ListItem.Title>{portfolioData.shares[index]} shares</ListItem.Title>
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

  return (
    <SafeAreaView>
      <Header
        centerComponent={{
          text: 'Profile',
          style: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
        }}
        containerStyle={{
          backgroundColor: '#1e88e5',
        }}
      />
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage}>
            <Image
              source={require('../assets/smiley.jpg')}
              style={styles.image}
              resizeMode="center"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statsBox,
              {
                borderColor: '#e0e0e0',
                borderRightWidth: 1.2,
              },
            ]}
          >
            <Text style={styles.number}>{trackers}</Text>
            <Text style={styles.subText}>Trackers</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={styles.number}>{tracking}</Text>
            <Text style={styles.subText}>Tracking</Text>
          </View>
        </View>
        <Button
          title="Find People"
          containerStyle={{ margin: 20 }}
          onPress={() => navigation.navigate('Find People')}
        />
        <Button
          title="Sign out"
          type="outline"
          containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 15 }}
          onPress={() => removeToken().then(navigation.navigate('Login'))}
        />

        <Text style={styles.sectionHeading}>My Portfolio</Text>
        <SafeAreaView>
          <FlatList
            keyExtractor={(item) => item.id}
            data={portfolioData.tickers}
            renderItem={renderPortfolioData}
            style={styles.stockContainer}
          />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 20,
  },
  username: {
    color: '#52575D',
    fontWeight: '200',
    fontSize: 20,
  },
  email: {
    color: '#AEB5BC',
    fontSize: 14,
  },
  sectionHeading: {
    color: '#ffa726',
    fontSize: 20,
    margin: 10,
    marginLeft: 20,
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  number: {
    color: '#52575D',
    fontSize: 22,
  },
  subText: {
    fontSize: 15,
    color: '#AEB5BC',
    fontWeight: '500',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    overflow: 'hidden',
  },
  statsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 20,
  },
  statsBox: {
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  stockContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Profile;
