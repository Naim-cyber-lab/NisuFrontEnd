import React, { useState,useEffect } from "react";
import { createStackNavigator } from '@react-navigation/stack';

import Login from './login.js'
import Register from './register.js'
import FirstPreference from './firstPreference.js'
import FirstPhotoLocalisation from './firstPhotoLocalisation.js';
import axios from 'axios';

import Index from '../../navigation/index'

//**********POUR REDUX *********************/
import { store } from "./store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";

import { setListParticipeWinker } from "./store";

//************************************************* */
import { View, Text, Image, TouchableHighlight, TouchableWithoutFeedback, Modal, Dimensions, TouchableOpacity, ScrollView  } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ColorSchemeName, Pressable } from 'react-native';


import { FontAwesome } from '@expo/vector-icons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


import { Video, AVPlaybackStatus } from 'expo-av';


import Home from '../Home/Home.js';
import indexProfil from '../Profil/index.js';
import indexChat from '../ChatIndividual/index.js';
import indexFiltre from '../Filtre/index.js';
import indexChatVrai from '../ChatIndividualVrai/index.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();


function Navigator(props) {

//********************************** POUR REDUX ******************************************/
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const currentUser = useSelector((state) => state.currentUser);


  const firstPreference = useSelector((state) => state.firstPreference);
  const firstPhotoLocalisation = useSelector((state) => state.firstPhotoLocalisation);
  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();

  //************************************************************************************** */

const [eventsParticipe, setEventsParticipe] = useState([])
const renderItem = ({ item }) => {


  const getPicture = () => {
    if(item.event != null){//Alors il s'agit d'un chat lié à un event normal

    for(var element in item.event.filesEvent){
      // console.log("voici l'element de getPicture : ",item.event.filesEvent[element])
      // console.log("seconde chance : ",element)
      if(item.event.filesEvent[element]["image"] != null){
        return[ipAdress + item.event.filesEvent[element]["image"],true]
      }
    }
    return[{},false]

    }
    else{//Alors il s'agit d'un groupPrive

      for(var element in item.groupPrive.event.filesEvent){
        // console.log("voici l'element de getPicture : ",item.event.filesEvent[element])
        // console.log("seconde chance : ",element)
        if(item.groupPrive.event.filesEvent[element]["image"] != null){
          return[ipAdress + item.groupPrive.event.filesEvent[element]["image"],true]
        }
      }
      return[{},false]

    }

  }

  const getVideo = () => {

    if(item.event != null){
      for(var element in item.event.filesEvent){
        // console.log("voici l'element de getPicture : ",item.event.filesEvent[element])
        // console.log("seconde chance : ",element)
        if(item.event.filesEvent[element]["video"] != null){
          return[ipAdress + item.event.filesEvent[element]["video"],true]
        }
      }
      return[{},false]
    }
    else{
      for(var element in item.groupPrive.event.filesEvent){
        // console.log("voici l'element de getPicture : ",item.event.filesEvent[element])
        // console.log("seconde chance : ",element)
        if(item.groupPrive.event.filesEvent[element]["video"] != null){
          return[ipAdress + item.groupPrive.event.filesEvent[element]["video"],true]
        }
      }
      return[{},false]
    }
    
  
  }

  const handleNavigationEvent = () => {
    
    axios.post(ipAdress + '/profil/getEventChat/', {
      eventId: item.event.id,
    }, {
      headers: {
        'Authorization': 'Token '+token
      }
  })
    .then(function (response) {
      props.navigation.navigate('indexChat' , {"item": item , "chatEventId" : response.data.chatEventId})
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  const handleNavigationEventGroup = () => {

    props.navigation.navigate('indexChat' , {"item": item , "groupPriveId" : item.groupPrive.id})

  }

  if(item.groupPrive != null){
    return(
      <Pressable onPress={() => handleNavigationEventGroup() }>
        {getPicture()[1] ?
        <>
        <Image
        source={{
          uri : ipAdress + "/media/G.jpg"
        }}
        onError ={(error)  => console.warn(error)}
        style={{width:70,height:60,borderRadius:50,}}
        />
          <Image
            source={{
              uri : String(getPicture()[0])
            }}
            onError ={(error)  => console.warn(error)}
            style={{width:70,height:60,borderRadius:50,position:"absolute",marginLeft:15,marginBottom:8,opacity:0.7}}
          />     
        </>

            :
          <Video                              
            source={{uri: getVideo()[0]}}
            style={{width:70,height:60,borderRadius:50}}
            onError={(e) => console.log(e)}
            repeat={false}
            shouldPlay = {false}
            isLooping = {false}
            muted={true}
            resizeMode="contain"
            posterStyle={{ resizeMode: 'cover', height: '100%' }}
          />
        }
      </Pressable> 
      )   
  }
  else{
    return(
      <Pressable onPress={() => handleNavigationEvent() }>
        {getPicture()[1] ?
          <Image
            source={{
              uri : String(getPicture()[0])
            }}
            onError ={(error)  => console.warn(error)}
            style={{width:70,height:60,borderRadius:50}}
          />
            :
          <Video                              
            source={{uri: getVideo()[0]}}
            style={{width:70,height:60,borderRadius:50}}
            onError={(e) => console.log(e)}
            repeat={false}
            shouldPlay = {false}
            isLooping = {false}
            muted={true}
            resizeMode="contain"
            posterStyle={{ resizeMode: 'cover', height: '100%' }}
          />
        }
      </Pressable> 
      )      
  }

};
  
  const [modalVisibleGroup, setModalVisibleGroup] = useState(false);
  const onModalGroup = () => {
    
    fetch(ipAdress + '/profil/getParticipeWinker/',{
      method:"GET",
      headers : {
        'Authorization': `Token ${token}`
      }
      })
      .then( (response) => response.json() )
      .then( (response) => {

        
          dispatch(setListParticipeWinker(response.data))
          setEventsParticipe(response.data)


      })
      .catch(function(error) {
          alert('erreur dans index.tsx !' + error.message)
          throw error;
      });

    setModalVisibleGroup(!modalVisibleGroup);
  
  };

  const DisplayUp = () => {
  
    return(
    <View>
        <Text>kjhgk</Text>
   </View>)
  }
  

  if(!isLoggedIn){//Quand il n'est pas connécté
    return(
    <Provider store={store}>
      <Stack.Navigator initialRouteName="Login">
            <>
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            </>
         
      </Stack.Navigator>
    </Provider>
      )
  }
  else{//Il est connécté
    if(Boolean(!(currentUser.firstPreference))){//Il n'a pas encore passé l'étape du first Preference
    return(
      <Provider store={store}>
        <Stack.Navigator initialRouteName="FirstPreference">
              
                <Stack.Screen name="FirstPreference" component={FirstPreference} options={{ headerShown: false }} />
              
        </Stack.Navigator>
      </Provider>      
      )
    }
    else{//Il a passé l'étape du first préférence
      if(Boolean(!(currentUser.firstPhotoLocalisation))){//Il n'a pas encore passé l'étape de la bio + langue + photo
        return(
          <Provider store={store}>
            <Stack.Navigator initialRouteName="FirstPhotoLocalisation">    
              <Stack.Screen name="FirstPhotoLocalisation" component={FirstPhotoLocalisation} options={{ headerShown: false }} />
            </Stack.Navigator>
          </Provider>
        )
      }else{//Il a passé l'étape de la bio + langue + photo ( donc il est vraiment sur le site)
       return(
       <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleGroup}
          onRequestClose={() => {
          setModalVisibleGroup(!modalVisibleGroup);
          }}
  >
        <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: Dimensions.get('window').height}}>
            
            <TouchableOpacity onPress={onModalGroup} style={{flex:18,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
              <View style={{backgroundColor:'grey', flex:4,borderRadius:25,borderWidth: 3,borderColor: "white",overflow:'hidden'}}>
                  {/* <ScrollView horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    // style={{flexDirection:"row"}}
                    //contentContainerStyle={{flexDirection:'row'}}  
                    > */}
                      <FlatList
                        numColumns={5}
                        data={eventsParticipe}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                      />
                    
                    
                  {/* </ScrollView > */}
            </View>
            <TouchableOpacity onPress={onModalGroup} style={{flex:1.8,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
            
        </View>

        </Modal>
        
        <Provider store={store}>
        <BottomTab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
            // tabBarActiveTintColor: Colors[colorScheme].tint,
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor:"white",
            "tabBarStyle": {
              "backgroundColor": "black",
            }
          }}>
            <BottomTab.Screen
              name="Home"
              component={Home}
              options={{
                title: '',
                tabBarIcon: ({ color }) => <AntDesign name="home" color={color} size={30} style={{marginTop:8}}  />,
              }}
              />      
            <BottomTab.Screen
                name="Chat"
                component={indexChatVrai}
                options={{
                  title: '',
                  tabBarIcon: ({ color }) => <Entypo name="paper-plane" color={color} size={30} style={{marginTop:8}}  />,
                }}
              />
              <BottomTab.Screen
                  name="Button" 
                  component={DisplayUp} 
                  options={{
                      tabBarBadge: 3,
                      tabBarButton:()=>
                  <Pressable onPress={() => alert("bb")} style={{position:'relative',bottom:15,alignItems:'center', justifyContent:'space-around',height:85}}>
                    <FontAwesome 
                      name="arrow-up"
                      type = "material-community" 
                      reverse
                      color={'white'}
                      reverseColor='black'
                      containerStyle={{padding:0,margin:0,elevation:4}}
                      onPress={onModalGroup}
                      size={30}/>
                  </Pressable>
                }}
              />
            <BottomTab.Screen
                name="Filtre"
                style={{marginLeft:10}}
                component={indexFiltre}
                options={{
                  title: '',
                  tabBarIcon: ({ color }) => <FontAwesome name="search" color={color} size={25} style={{marginTop:8}} />,
                }}
              />
            <BottomTab.Screen
              name="profil"
              component={indexProfil}
              options={{
              title: '',
              tabBarIcon: ({ color }) =>      <Image
              style={{    width: 40, height: 40,
              borderRadius: 25,
              borderWidth: 2,
              borderColor: '#fff',}}
              source={{uri : currentUser.photoProfil}}
              onError ={(error)  => console.warn(error)}
            />,
              }}
              />

        </BottomTab.Navigator> 
        </Provider>
       </> 
       )
        
      }
      
    }

  }
  
}

export default Navigator;

