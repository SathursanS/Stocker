import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { ListItem, Icon, Header, Button } from 'react-native-elements';
import { SearchBar } from 'react-native-elements';
import CustomModal from '../components/customModal/customModal';
import * as SecureStore from 'expo-secure-store';
import { Directions } from 'react-native-gesture-handler';
import { MainContext } from '../context/MainContext';

const Stocks = () => {
  const context = useContext(MainContext);
  const [original, setOriginal] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState([]);

  const [userStocks, setUserStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  const [modalInfo, setModalInfo] = useState({});
  const [shares, setShares] = useState('');

  useEffect(() => {
    //setResult(list);
    //setData(list);
    fetchUserStocks();
    fetchStock();
  }, []);

  const getToken = () => {
    return SecureStore.getItemAsync('auth_token');
  };

  const fetchStock = async () => {
    let response = await fetch('http://localhost:5000/listofStocks', {
      method: 'GET',
    });

    let json = await response.json();
    setOriginal(json);
    setData(json);
  };

  const fetchUserStocks = async () => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;
      response = await fetch('http://localhost:5000/api/StockPortfolio', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': authToken,
        },
      });

      json = await response.json();

      setUserStocks([...json.stockPortfolioDICT.tickerArray]);
    });
  };

  const addUserStocks = (item, shares) => {
    let response;
    let json;
    let authToken;
    getToken().then(async (token) => {
      authToken = token;
      response = await fetch('http://localhost:5000/api/StockPortfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': authToken,
        },
        body: JSON.stringify({ TICKER: item.Symbol, SHARE: shares }),
      });

      json = await response.json();

      fetchUserStocks();
      context.updateNewsFunction();
      context.updateProfileFunction();
    });
  };

  const deleteUserStocks = (item, shares) => {
    let response;
    let json;
    let authToken;

    getToken().then(async (token) => {
      authToken = token;
      response = await fetch('http://localhost:5000/api/StockPortfolio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': authToken,
        },
        body: JSON.stringify({ TICKER: item.Symbol, SHARE: shares }),
      });

      json = await response.json();

      fetchUserStocks();
      context.updateNewsFunction();
      context.updateProfileFunction();
    });
  };

  useEffect(() => {
    setResult([...data.slice(0, 10)]);
    setPage(0);
  }, [data]);

  const onSearch = (search) => {
    setSearch(search);
    if (search === '') {
      setData(original);
    } else {
      let newData = original.filter((s) => {
        return (
          s.Symbol.toLowerCase().includes(search.toLowerCase()) ||
          s.Name.toLowerCase().includes(search.toLowerCase())
        ); //FILTER BASED ON NAME AS WELL ASK RISHAN
      });
      setData([...newData]);
    }
  };

  const fetchMore = () => {
    setResult([...result, ...data.slice(10 + 10 * page, 20 + 10 * page)]);
    setPage(page + 1);
  };

  function currencyFormat(num) {
    if (num == null) {
      return '$0.00';
    }
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  const renderItem = ({ item }) => {
    return (
      <ListItem key={item.Symbol} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.Symbol}</ListItem.Title>
          <ListItem.Subtitle>{item.Name}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          <ListItem.Title>{currencyFormat(item.value.ask)}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Content
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
        >
          {!userStocks.includes(item.Symbol) ? ( //ADD CONDITIONAL CHECK FOR BUTTONS
            <Icon
              name="plus-circle-outline"
              type="material-community"
              color="#66bb6a"
              size={35}
              onPress={() => toggleOverlay(item, true)}
            />
          ) : (
            <>
              <Icon
                name="plus-circle-outline"
                type="material-community"
                color="#66bb6a"
                size={35}
                onPress={() => toggleOverlay(item, true)}
              />
              <Icon
                name="close-circle-outline"
                type="material-community"
                color="#ef5350"
                size={35}
                onPress={() => toggleOverlay(item, false)}
              />
            </>
          )}
        </ListItem.Content>
      </ListItem>
    );
  };

  const toggleOverlay = (item, type) => {
    setVisible(!visible);
    if (type) {
      setModalInfo({
        item: item,
        title: `Buy ${item.Symbol} Shares`,
        modifyFunction: addUserStocks,
      });
    } else {
      setModalInfo({
        item: item,
        title: `Sell ${item.Symbol} Shares`,
        modifyFunction: deleteUserStocks,
      });
    }
  };

  return (
    <View>
      <Header
        centerComponent={{
          text: 'Stock Lookup',
          style: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
        }}
        containerStyle={{
          backgroundColor: '#1e88e5',
        }}
      />
      <SearchBar
        placeholder="Type Here..."
        onChangeText={onSearch}
        value={search}
        containerStyle={{
          backgroundColor: '#fff',
          borderBottomWidth: 0,
          elevation: 0,
        }}
        inputContainerStyle={{
          height: 30,
          borderWidth: 0,
          backgroundColor: '#ddd',
        }}
        inputStyle={{ fontSize: 14 }}
        round={true}
      />
      <FlatList
        contentContainerStyle={{ paddingBottom: 40 }}
        data={result}
        extraData={result}
        keyExtractor={(item) => item.Symbol}
        renderItem={renderItem}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
      />
      <CustomModal open={visible} setOpen={setVisible}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, margin: 10 }}>{modalInfo.title}</Text>
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TextInput
              style={{
                padding: 10,
                height: 50,
                fontSize: 16,
                width: '90%',
                borderRadius: 100,
                textAlign: 'center',
                backgroundColor: '#ddd',
              }}
              placeholder="Shares"
              value={shares}
              onChangeText={(value) => setShares(value)}
              keyboardType="numeric"
            />
            <View
              style={{ flexDirection: 'row', marginTop: 10, width: '100%' }}
            >
              <Button
                type={'outline'}
                title={'Cancel'}
                onPress={() => setVisible(false)}
                containerStyle={{ marginRight: 10, flex: 1 }}
              />
              <Button
                type={'solid'}
                title={'Confirm'}
                onPress={() => {
                  modalInfo.modifyFunction(modalInfo.item, shares);
                  setVisible(false);
                  setShares('');
                }}
                containerStyle={{ marginLeft: 10, flex: 1 }}
              />
            </View>
          </View>
        </View>
      </CustomModal>
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

export default Stocks;
