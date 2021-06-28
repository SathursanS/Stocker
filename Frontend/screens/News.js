import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Card, ListItem, Button, Icon, Header } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { MainContext } from '../context/MainContext';

const News = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [newsList, setNewsList] = useState([]);

  const context = useContext(MainContext);

  const getToken = () => {
    return SecureStore.getItemAsync('auth_token');
  };

  const fetchNewsFeed = async () => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;

      response = await fetch('http://localhost:5000/newsFeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': authToken,
        },
        body: JSON.stringify({ page }),
      });

      json = await response.json();
      setNewsList(json.articles);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchNewsFeed();
  }, [context.updateNews]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header
        centerComponent={{
          text: 'News',
          style: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
        }}
        containerStyle={{
          backgroundColor: '#1e88e5',
        }}
      />
      {loading && <ActivityIndicator size="large" color="#0066CC" />}
      <ScrollView style={styles.scrollContainer}>
        {newsList.length === 0 && !loading && (
          <View style={styles.emptyMessage}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
            >
              Get news on stocks added to your portfolio.
            </Text>
            <Text style={{ fontSize: 16 }}>
              To add stocks to your porfolio, go to the stocks lookup tab,
              search for the stocks you invest in, and click the + icon to add
              it to your portfolio.
            </Text>
          </View>
        )}
        {newsList.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(item.url).catch((err) => {
                  console.error('Failed opening page because: ', err);
                  alert('Failed to open page');
                });
              }}
              activeOpacity={0.75}
            >
              <Card
                containerStyle={{
                  padding: 0,
                  borderRadius: 15,
                  paddingBottom: 10,
                }}
              >
                <Card.Image
                  source={{
                    uri: item.urlToImage,
                  }}
                  style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
                ></Card.Image>
                <Card.Title
                  style={{
                    marginBottom: 1,
                    marginTop: 5,
                    textAlign: 'left',
                    paddingHorizontal: 5,
                    fontSize: 16,
                  }}
                >
                  {item.title}
                </Card.Title>
                <Text style={{ marginTop: 0, paddingHorizontal: 5 }}>
                  {item.description}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 15 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    padding: 20,
  },
});

export default News;
