import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';

const News = () => {
  //TODO:
  //Add header
  //Add loading indicator when loading the news
  //When you scroll to end of scroll view, load next page of news

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [newsList, setNewsList] = useState([]);

  const fetchNewsFeed = async () => {
    let response;
    let json;
    response = await fetch('http://10.0.0.120:5000/newsFeed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page }),
    });

    json = await response.json();
    setNewsList(json.articles);
  };

  useEffect(() => {
    fetchNewsFeed();
    setLoading(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollContainer}>
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
    marginTop: StatusBar.currentHeight,
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
});

export default News;
