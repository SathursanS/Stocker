import React, {useState, useEffect} from "react";
import { StyleSheet, Text, SafeAreaView,View, ScrollView, FlatList } from "react-native";
import { ListItem, Icon, Overlay, Header, Button } from 'react-native-elements'
import { SearchBar } from 'react-native-elements';

const Stocks = () => {

  const [original,setOriginal]=useState([]);
  const [data,setData]=useState([]);
  const [page,setPage]=useState(0);
  const [result,setResult] = useState([]);
  const [search, setSearch] = useState('');
  const [visible,setVisible]=useState(false);

  useEffect( ()=>{
    //setResult(list);
    //setData(list);
    fetchStock();
  },[]);

  const fetchStock= async () =>{
    let response = await fetch('http://192.168.2.15:5000/listofStocks', {
      method: 'GET',});
    
    let json = await response.json();
    setOriginal(json);
    setData(json);
  }


  const onSearch = (search) => {
    setSearch(search);
    console.log(search)
    if(search === ''){
      setData(original);
    }else{
      let newData = original.filter((s)=>{
          return (s.Symbol.toLowerCase().includes(search.toLowerCase()) || s.Name.toLowerCase().includes(search.toLowerCase())) //FILTER BASED ON NAME AS WELL ASK RISHAN
        });
      setData([...newData]);
    }
  };

  const fetchMore = () => {
    console.log('Work Plz');
    setResult([...result,...data.slice(10+10*page,20+10*page)]);
    setPage(page+1);
  }

  useEffect(()=> {
    setResult([...data.slice(0,10)]);
    setPage(0);
  },[data])

  const renderItem = ({ item }) => {
    return (
      <ListItem key={item.Symbol} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.Symbol}</ListItem.Title>
          <ListItem.Subtitle>{item.Name}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content style={{ justifyContent:'center'}}>
          <ListItem.Title>{item.Sector}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Content style={{flexDirection:"row", justifyContent:'flex-end'}}>
          {false? //ADD CONDITIONAL CHECK FOR BUTTONS
            <Icon
            name='plus-circle-outline'
            type='material-community'
            color='#07ad47'
            size={35}
            onPress={() => console.log('hello')} />
          :<>
            <Icon
              name='pencil-circle-outline'
              type='material-community'
              color='#000000'
              size={35}
              onPress={() => console.log('hello')} />
            <Icon
              name='close-circle-outline'
              type='material-community'
              color='#ba2b39'
              size={35}
              onPress={() => console.log('hello')} />
          </>}
            
        </ListItem.Content>
      </ListItem>
    );
  };

  const toggleOverlay = ()=>{
    setVisible(!visible);
  }

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
    <FlatList
      contentContainerStyle={{paddingBottom:40}}
      data={result}
      extraData={result}
      keyExtractor={item => item.Symbol}
      renderItem={renderItem}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.6}
    />
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <Button onPress={toggleOverlay}>Test</Button>
    </Overlay>
  </View>
  )};


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
