import React, { useEffect, useRef, useState } from 'react';
import {View, Text,  Dimensions, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
// import EventItem from "../EventItem/event";
import EventItem  from '../EventItem/event';

import styles from './styles';
import { FlatList } from "react-native-gesture-handler";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



//***************POUR LE REDUX ****************** */

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import axios from 'axios';
import { store } from "../../Register/store";


import { Provider } from "react-redux";



//************************************************* */


const Tab = createMaterialTopTabNavigator();

const  App = ({route}) => {
  return (
    <Provider store={store}>
      <Tab.Navigator
        independent={true}
        style={{marginTop:25}}
        swipeEnabled="false"
        initialRouteName="HastagEvent"
        screenOptions = {{
          "title":route.params["item"]["hastag"],
          "tabBarActiveTintColor": "white",
            "tabBarLabelStyle": {
              "fontSize": 12
            },
            "tabBarStyle": {
              "backgroundColor": "black"
            },
            "swipeEnabled":false,
            

        }}
  
        >
        
          <Tab.Screen initialParams={{item : route.params["item"]}} name="Hastag Event" component={HastagEvent} />
          {/* <Tab.Screen name="Entreprise" component={Entreprise} /> */}
          
          {/* <Tab.Screen name="Particulié" component={Particulie} /> */}
      </Tab.Navigator>
    </Provider>
      
  );
}


export default App


const HastagEvent = ({ route, navigation }) => {

    const { item } = route.params;

     //*****************POUR LE REDUX **************************/
     const ipAdress = useSelector((state) => state.ipAdress);
     const token = useSelector((state) => state.token);

     //************************************************** */

     const [data , setData] = useState([]);

     const mediaRefs = useRef([])


     const onViewableItemsChanged = useRef(({viewableItems, changed }) => {

      //console.log("INDEX*****************************voici le viewableItems*************************** :",viewableItems)
      //console.log("INDEX*****************************voici le changed************************************:",changed)
  
      const mediaa = mediaRefs.current;
  
      //console.log("INDEX**************************voici les mediaa**************************: ",mediaa)
  
      for (let index in mediaa){
        
        try{
          if(mediaa[index] != null){
            mediaa[index].stop();
          }
        }
        catch{
          console.log("il y a une erreur dans index.js de EventLists pour le stop")
        }
        
  
      }
  
      const cell = mediaRefs.current[changed[0].key]
      
      if (cell) {
        if (changed[0].isViewable) {
            //console.log("EventLists index play")
            cell.play()
        }
        else {
            console.log("EventLists index pause")
            cell.stop()
        }
      }
      else{
        //console.log("voici le cell :",cell)
      }
  
  
  })
  
    const renderItem = ({ item }) => {
      return (
          <View style={{ flex:1 ,backgroundColor: 'black' }}>
              <EventItem item={item} ref={EventItemRef => (mediaRefs.current[item.id] = EventItemRef)} />
          </View>
      )
  }
    
    useEffect(() => {
      console.log("voici l'item du getHastagEvents : ",item.hastag)
      axios.post(String(ipAdress)+'/profil/getHastagEvents/', {
        hastag: (item.hastag).substr(1) ,//On enleve le premier pour retirer le #
      },
     { headers: {
          'Authorization': 'Token ' + token
      }})
      .then(function (response) {
          setData(response.data.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  
    } , []);
    
    return(
      <View>
      {(data.length) != 0 ?
          <TouchableWithoutFeedback style={styles.container}>
          <FlatList
            disableIntervalMomentum={true}
            data={data}
            renderItem={renderItem} // ici, on defini ce qui va apparaitre dans les props de notre EventItem
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            snapToAlignment={"start"}
            decelerationRate={0.5}
    
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews
            windowSize={20}
            viewabilityConfig={{
              itemVisiblePercentThreshold : 50
            }}
    
            // decelerationRate={1500}
            snapToInterval={Dimensions.get('window').height - 38}
            snapToEnd={'true'}
            onViewableItemsChanged={onViewableItemsChanged.current}
          />
      </TouchableWithoutFeedback>
      :
     
        <ActivityIndicator style={ {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:300
      }} size="large" color="#00ff00" />
    
          }
    
        </View>
    )
  }






  