import React, {useState, useEffect} from "react";
import { StyleSheet, Text, SafeAreaView,View, ScrollView } from "react-native";
import { ListItem, Avatar, Header } from 'react-native-elements'
import { SearchBar } from 'react-native-elements';

const list = [
  {
    name: 'GME',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'NYSE'
  },
  {
    name: 'H',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'RY',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'GME',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'NYSE'
  },
  {
    name: 'H',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'RY',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'GME',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'NYSE'
  },
  {
    name: 'H',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'RY',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'GME',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'NYSE'
  },
  {
    name: 'H',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
  {
    name: 'RY',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'TSX'
  },
]

const Stocks = () => {
  
  let data;
  const [result,setResult] = useState([]);
  const [search, setSearch] = useState('');

  useEffect( ()=>{
    data = list;
    setResult(list);
    console.log(data);
  },[]);

  const onSearch = (search) => {
    setSearch(search);
    if(search === ''){
      setResult(data);
    }else{
      setResult(data.filter((stock) => {return stock.includes(search)}));
    }
  };

  return (
  <View>
      <Header
        centerComponent={{ text: 'Stocker', style: { color: '#fff' } }}
        containerStyle={{
          backgroundColor: '#000000',
        }}
      />
      <SearchBar
        placeholder="Type Here..."
        onChangeText={onSearch}
        value={search}
        containerStyle={{ backgroundColor:'#fff', borderBottomWidth: 0, elevation: 0}}
        inputContainerStyle={{height:30, borderWidth:0, backgroundColor:'#ddd'}}
        inputStyle={{fontSize: 14}}
        round = {true}
      />
    <ScrollView>
    { result.map((l, index) => (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{l.name}</ListItem.Title>
          <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title>{l.name}</ListItem.Title>
          <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content>
          <ListItem.Title>{l.name}</ListItem.Title>
          <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      ))
    }
    </ScrollView>
  </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9e9e9e",
  },
});

export default Stocks;
