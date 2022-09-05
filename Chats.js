import React, {useEffect, useState, useRef, useCallback, Component} from 'react';

import {StyleSheet,Text,Modal,View,Image,TextInput,TouchableOpacity,TouchableWithoutFeedback,Keyboard,ScrollView,FlatList,Dimensions,Alert,Pressable,Animated,PanResponder,Easing,Button,RefreshControl} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';


import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';

import ElementAudio from "./ElementAudio"

const Stack = createStackNavigator();

import { w3cwebsocket as W3CWebSocket } from "websocket";

import { NavigationContainer } from '@react-navigation/native';

import axios from 'axios';
import { Icon } from 'react-native-elements';

//***************POUR LE REDUX ****************** */

import { useSelector } from "react-redux";
import { setStatusBarTranslucent, StatusBar } from 'expo-status-bar';

import { setWinkersChat, setWinkersChatWithoutGroup } from "../Register/store";

import { useDispatch } from "react-redux";

//***************************************** */

import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';



const NavigatorChats = () => {
return(
        <NavigationContainer
        independent={true}
        screenOptions = {{
            headerShown: false,
        }}
        >
          <Stack.Navigator>
            <Stack.Screen name="Chats" component={Chats} options={{headerShown: false}} />
            <Stack.Screen name="ChatIndividual" component={ChatIndividual} options={{headerShown: false}}  />
            <Stack.Screen name="ChatIndividualGroup" component={ChatIndividualGroup} options={{headerShown: false}}  />
            <Stack.Screen name="ShowEvent" component={ShowEvent} options={{headerShown: false}}  />
        </Stack.Navigator>
        {/* <Stack.Navigator>
            <Stack.Screen name="ChatsIndividual" component={ChatIndividual} />

        </Stack.Navigator> */}
    </NavigationContainer>
)

}

export default NavigatorChats


//************************************************************************************************** */
//                                                                                                   //
//                                 PAGE DE CHAT                                                      //
//                                                                                                   //
//************************************************************************************************** */




const Chats = ({navigation}) => {

     //*****************POUR LE REDUX **************************/

     const ipAdress = useSelector((state) => state.ipAdress);
     const currentUser = useSelector((state) => state.currentUser);
     const winkersChat = useSelector((state) => state.winkersChat);
     const winkersChatWithoutGroup = useSelector((state) => state.winkersChat);
     const token = useSelector((state) => state.token);
     const dispatch = useDispatch();

     //*************************************************************** */

     
    const widthScreen = Dimensions.get('window').width;
    const heightScreen = Dimensions.get('window').height;


     //********************* POUR LA BARRE DE RECHERCHE ***************************************/

     const [isSearchingWinker , setIsSearchingWinker] = useState(false);
     const [dataWinkers, setDataWinkers] = useState( [] );

     useEffect(() => {
      fetch(ipAdress+'/profil/getWinkers/',{
        method:"GET",
        headers: {
          'Authorization': 'Token '+token,
        },
      })
        .then( (response) => response.json() )
        .then( (responseJsonWinker) => {
            setFirstDataWinkers(responseJsonWinker.data)
            setDataWinkers(responseJsonWinker.data);
  
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
           alert(error)
            throw error;
        });
      }, []);
     
     const handleSearchWinker = (searchString) => {
        if(searchString != ""){setIsSearchingWinker(true)}
        else{setIsSearchingWinker(false)}

        setDataWinkers(firstDataWinkers.filter(item => item.username.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())))
      }

    //*********************************** MODAL POUR VOIR LE PROFIL ********************************** */
      const [seeModalProfilWinker, setSeeModalProfilWinker] = useState(false);
      const [itemSeeWinker , setItemSeeWinker] = useState({})


     const onModalProfilWinker = (item) => {
      setSeeModalProfilWinker(true)
      if(item){
        setItemSeeWinker(item)
      }
     }

    //**************************************** POUR LE REFRESH *************************************************/

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
    
      fetch(ipAdress+'/profil/getWinkersChat/',{
        method:"GET",
        headers: {
          'Authorization': 'Token '+token,
        },
      })
        .then( (response) => response.json() )
        .then( (response) => {
            
          dispatch(setWinkersChat(response.data))
          
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
           alert(error)
            throw error;
        });
      

      setRefreshing(false)
      
    }, []);


    
//***********************RECUPERATION DES DONNES DES WINKERS POUR LE CHAT ****************** */
     useEffect(() => {
      fetch(ipAdress+'/profil/getWinkersChat/',{
        method:"GET",
        headers: {
          'Authorization': 'Token '+token,
        },
      })
        .then( (response) => response.json() )
        .then( (response) => {
            
          dispatch(setWinkersChat(response.data))
          
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
           alert(error)
            throw error;
        });
      }, []);

  //******************* POUR LA CREATION DE GROUPE ***************************************** */

  const [modalVisiblePaperPlane, setModalVisiblePaperPlane] = useState(false);

  const [titreGroup, setTitreGroup] = useState("");
  

  const onModalPaperPlane = () => {
      setModalVisiblePaperPlane(!modalVisiblePaperPlane);

      fetch(ipAdress+'/profil/getWinkersChatWithoutGroup/',{
          method:"GET",
          headers: {
            'Authorization': 'Token '+token,
          },
        })
          .then( (response) => response.json() )
          .then( (response) => {
              
            dispatch(setWinkersChatWithoutGroup(response.data))
            
          })
          .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             alert(error)
              throw error;
          });

      
      fetch(String(ipAdress)+'/profil/getWinkers/',{ 
              method:"GET",
              headers: {
                'Authorization': 'Token '+token,
              },
          })
          .then( (response) => response.json() )
          .then( (responseJsonWinker) => {
          setFirstDataWinkers(responseJsonWinker.data)
          setDataWinkers(responseJsonWinker.data);
        
          })
          .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          alert(error)
          throw error;
         });


      };
  
  const [listIdUserSendEvent , setListIdUserSendEvent] = useState([]);

  function contains(list , item) {
      // console.log("voici l'item de contains : ",item)

      if(item.winker1.id != currentUser.id){
          var x = item.winker1.id;
      }
      else{
          var x = item.winker2.id;
      }


      for(var u of list){
          if(u == x){
              return true;
          }
      }
      return false;
  }

  function containsDataWinkers(list , x) {
      for(var u of list){
          if(u == x){
              return true;
          }
      }
      return false;
  }

  function addOrRemoveId(item) {

      // console.log("voici l'item de addOrRemoveId : ",ListItemSwipeable)

      if(item.winker1.id != currentUser.id){
          var idWinker = item.winker1.id;
      }
      else{
          var idWinker = item.winker2.id;
      }

      var myClone = listIdUserSendEvent.map((x) => x);

      if(!contains(listIdUserSendEvent ,item)){
          
          myClone.push(idWinker)         
          setListIdUserSendEvent(myClone)

      }
      else{
          var myIndex = myClone.indexOf(idWinker);
          
          if (myIndex !== -1) {
              myClone.splice(myIndex, 1);
              setListIdUserSendEvent(myClone)
          }

      }
      
  }

  function addOrRemoveIdDataWinkers(idWinker) {
      
      var myClone = listIdUserSendEvent.map((x) => x);
      
      if(!containsDataWinkers(listIdUserSendEvent ,idWinker)){
                  
          myClone.push(idWinker)         
          setListIdUserSendEvent(myClone)
      
      }
      else{
          var myIndex = myClone.indexOf(idWinker);
                  
          if (myIndex !== -1) {
              myClone.splice(myIndex, 1);
              setListIdUserSendEvent(myClone)
          }
      
      }
              
  }

  const sendEventFriends = () => {
    if(titreGroup == ""){
      alert("veuillez insérer un titre à votre groupe")
      return
    }

      console.log("voici la list des IdUserSendEvent : ",listIdUserSendEvent)

      axios.post(ipAdress + '/profil/createGroupeChatIndividual/', {
          listIdUserSendEvent: JSON.stringify(listIdUserSendEvent),
          titreGroup : titreGroup,
        }, {
          headers: {
            'Authorization': 'Token '+token
          }
      })
        .then(function (response) {
            alert("le groupe a bien ete crée")
            setModalVisiblePaperPlane(false)
        })
        .catch(function (error) {
          console.log(error);
        });
  
  
  }

  const renderItemEnvoieAmie = ({item}) => { 
      
      if(item.winker1 && item.winker2){//Alors les données viennent de winkersChatWithoutGroup
            return(
      <Pressable onPress = {() => addOrRemoveId(item)}
      style=
      {{
      backgroundColor:  contains(listIdUserSendEvent ,item) ?
          "green" :
          "transparent",
      display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
          <View style={{display:'flex',flexDirection:'row',flex:3}}>
                <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 3,
                        borderColor: '#4c4c4c',
                      }}
                      source={{uri: item.winker1.id != currentUser.id ? item.winker1.photoProfil : item.winker2.photoProfil }}
                  /> 
              {item.winker1.id != currentUser.id ?
                  <Text> {item.winker1.username}</Text>
                  :
                  <Text> {item.winker2.username}</Text>
              }

  
               
          </View>
        
          {/* <View style={{flex:1,}}>
              <Text style={{marginTop:20}}>
                   <Fontisto style={{color:'white'}} name={'paper-plane'} size={20} />
              </Text>
          </View> */}
    
      </Pressable>
      )         
          }
      else{//Alors les données viennent de dataWinkers
              return(
                  <Pressable
                  onPress = {() => addOrRemoveIdDataWinkers(item.id)}
                  style=
                  {{
                  backgroundColor:
                  containsDataWinkers(listIdUserSendEvent,item.id) ?
                      "green" :
                      "transparent",
                  display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
                      <View style={{display:'flex',flexDirection:'row',flex:3}}>
                            <Image
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    borderWidth: 5,
                                    borderColor: '#4c4c4c',
                                  }}
                                  source={{uri: item.photoProfil }}
                              /> 
                              <Text> {item.username}</Text>
                     
          
              
                           
                      </View>
                    
                      <View style={{flex:1,}}>
                          <Text style={{marginTop:20}}>
                               <Fontisto style={{color:'white'}} name={'paper-plane'} size={20} />
                          </Text>
                      </View>
                
                  </Pressable>
              )
          }
      

  }

  //**************************************************************************************************** */
  const [firstDataWinkers, setFirstDataWinkers] = useState( [] );

  const handleNavigation = (item) => {

      //console.log("voici l'item : ",item.id)


        axios.post(ipAdress + '/profil/getChatWinker/', {
            idWinkerRecoit : item.id,
           }, {
            headers: {
              'Authorization': 'Token '+token,
            }})
           .then(function (response) {
               console.log("voici le user2 : ",response.data)
              navigation.navigate("ChatIndividual", {"item" : item,
                                                     "meId" : response.data["meId"],
                                                    "user2Id" : response.data["user2Id"],
                                                    "ChatWinkerId" : response.data["ChatWinkerId"]  })
           })
           .catch(function (error) {
               alert("probleme dans la navigation")
             console.log("voici l'erreur dans le probleme de navigation : ",error);
           });

        
    }

  const handleNavigationGroup = (item) => {
      //console.log("voici l'item de handleNavigationGroup : ",item)
      navigation.navigate("ChatIndividualGroup",{"idParticipeWinker" : item.id, "meId" : currentUser.id, "creatorGroupId" : item.winker1.id , })

    }

    const SPACING = 20;
    const AVATAR_SIZE = 70;
    const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

    const scrollY = React.useRef(new Animated.Value(0)).current;

    return(
    <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: Dimensions.get('window').height - 45}}>                  
        <View style={{backgroundColor:'#fff', flex:2,borderRadius:25}}>
          <Image
            source={require('../Image/GirafeNoir.png')}
            style={StyleSheet.absoluteFillObject}
          />

          
                <TouchableOpacity onPress={() => onModalPaperPlane()} style={{zIndex:2,position:"absolute",top:10,right:20,elevation: 8,backgroundColor: "blue",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5,width:"60%"}}>
                    <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Créer un groupe</Text>
                </TouchableOpacity>

              {!isSearchingWinker ?
                
                <Animated.FlatList
                    reverse={true}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                
                      />
                    }
                    data={winkersChat}
                    onScroll = {Animated.event(
                      [{nativeEvent : {contentOffset : {y : scrollY}}}],
                      { useNativeDriver: true}
                    )}
                    contentContainerStyle={{
                      padding:SPACING / 2,
                      paddingTop:StatusBar.currentHeight || 42
                    }}
                    renderItem={({item , index}) => {
                      const inputRange = [
                        -1,
                        0,
                        ITEM_SIZE * index,
                        ITEM_SIZE * (index + 1),
                      ]

                      const opacityInputRange = [
                        -1,
                        0,
                        ITEM_SIZE * index,
                        ITEM_SIZE * (index + 1),
                      ]

                      const scale = scrollY.interpolate({
                        inputRange,
                        outputRange: [1,1,1,0]
                      })
                      const opacity = scrollY.interpolate({
                        inputRange : opacityInputRange,
                        outputRange: [1,1,1,0]
                      })
                    if(item.winker2){//Dans ce cas il ne s'agit pas d'un groupe de chat

                      if(String(item.winker1.id) == String(currentUser.id)){
                        return (
                          <Animated.View
                            style={{
                            shadowOffset: {
                              width : 0,
                              height: 10,
                            },
                            shadowOpacity: .3,
                            shadowRadius: 20,
                            opacity,
                            transform:[{scale}],
                          }}
                            onPress={() => handleNavigation(item.winker2) }
                          >

                            <TouchableOpacity
                              style={{flexDirection:"row", padding: SPACING, marginBottom: SPACING,backgroundColor: item.seen ? 'rgba(171, 162, 162,0.8)' : 'rgb(148, 235, 235)',borderRadius:12,overflow:"hidden",
                                shadowColor : "#000",
                                shadowOffset: {
                                  width : 0,
                                  height: 10,
                                },
                                shadowOpacity: .3,
                                shadowRadius: 20,
                                opacity,
                                transform:[{scale}],
                              }}
                              onPress={() => handleNavigation(item.winker2)}
                            >
                 
                              <Image style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius:AVATAR_SIZE,
                                  marginRight: SPACING / 2,}}
                                  source={{uri: item.winker2.photoProfil}}
                                  onError ={(error)  => console.warn(error)}
                              />
                              <Pressable onPress={() => handleNavigation(item.winker2)}>
                                <Text style={{color:"white"}}>{item.winker2.username}</Text>
                                <View style={{flexDirection:'row',justifyContent:"space-between"}} >
                                  {item.lastMessage &&
                                    <Text numberOfLines={3}>{item.lastMessage.message}</Text>
                                  }
                                </View>
                              
                              </Pressable>
                            </TouchableOpacity>
                          
                          </Animated.View>
                        )
                        }
                      else{
                          return(
                            <Animated.View
                            style={{
                            shadowOffset: {
                              width : 0,
                              height: 10,
                            },
                            shadowOpacity: .3,
                            shadowRadius: 20,
                            opacity,
                            transform:[{scale}],
                          }}
                            onPress={() => handleNavigation(item.winker1) }
                            >
                            <TouchableOpacity
                              style={{flexDirection:"row", padding: SPACING, marginBottom: SPACING,backgroundColor: item.seen ? 'rgba(171, 162, 162,0.8)' : 'rgb(148, 235, 235)',borderRadius:12,overflow:"hidden",
                                shadowColor : "#000",
                                shadowOffset: {
                                  width : 0,
                                  height: 10,
                                },
                                shadowOpacity: .3,
                                shadowRadius: 20,
                                opacity,
                                transform:[{scale}],
                              }}
                              onPress={() => handleNavigation(item.winker2)}
                            >
                
                              <Image style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius:AVATAR_SIZE,
                                  marginRight: SPACING / 2,}}
                                  source={{uri: item.winker1.photoProfil}}
                                  onError ={(error)  => console.warn(error)}
                              />
                              <Pressable onPress={() => handleNavigation(item.winker1)}>
                                <Text style={{color:"white"}}>{item.winker1.username}</Text>
                                <View style={{flexDirection:'row',justifyContent:"space-between"}} >
                                  {item.lastMessage &&
                                  <Text numberOfLines={3}>{item.lastMessage.message}</Text>
                                  }
                                    
                                </View>
                              
                              </Pressable>                              
                            </TouchableOpacity>

                          </Animated.View>
                          )

                        }          
                    
                      }
                    else{//Dans ce cas c'est qu'il s'agit d'un groupe.
                   
             
                    return(
                      <Animated.View
                      style={{
                      shadowOffset: {
                        width : 0,
                        height: 10,
                      },
                      shadowOpacity: .3,
                      shadowRadius: 20,
                      opacity,
                      transform:[{scale}],
                    }}
                      //onPress={() => handleNavigation(item.winker2) }
                      onPress={() => handleNavigationGroup(item) }
                    >
                           <TouchableOpacity
                              style={{flexDirection:"row", padding: SPACING, marginBottom: SPACING,backgroundColor: item.seen ? 'rgba(171, 162, 162,0.8)' : 'rgb(148, 235, 235)',borderRadius:12,overflow:"hidden",
                                shadowColor : "#000",
                                shadowOffset: {
                                  width : 0,
                                  height: 10,
                                },
                                shadowOpacity: .3,
                                shadowRadius: 20,
                                opacity,
                                transform:[{scale}],
                              }}
                              onPress={() => handleNavigationGroup(item)}
                            >
                                <Image style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius:AVATAR_SIZE,
                                    marginRight: SPACING / 2,}}
                                    source={{uri: ipAdress + "/media/G.jpg"}}
                                    onError ={(error)  => console.warn(error)}
                                />
                                <Pressable 
                                //onPress={() => handleNavigation(item.winker2)}
                                onPress={() => handleNavigationGroup(item)}
                                >
                                  <Text style={{color:"white"}}>Groupe : {item.titreGroupe}</Text>
                                  <View style={{flexDirection:'row',justifyContent:"space-between"}} >
                                    {item.lastMessageGroup &&
                                      <Text numberOfLines={3}>{item.lastMessageGroup.message}</Text>
                                    }
                                  </View>
                                
                                </Pressable>

                            </TouchableOpacity>

                      </Animated.View>
                      ) 
                      
                    }
                      
                  }
                    
                    }
                    //keyExtractor={item => item.id.toString()}  
                />
                ://A partir de la c'est pour la barre de recherche avec les dataWinkers

                <Animated.FlatList
                  data={dataWinkers}
                  onScroll = {Animated.event(
                    [{nativeEvent : {contentOffset : {y : scrollY}}}],
                    { useNativeDriver: true}
                  )}
                  contentContainerStyle={{
                    padding:SPACING / 2,
                    paddingTop:StatusBar.currentHeight || 42
                  }}
                  renderItem={({item , index}) => {
                    const inputRange = [
                      -1,
                      0,
                      ITEM_SIZE * index,
                      ITEM_SIZE * (index + 1),
                    ]

                    const opacityInputRange = [
                      -1,
                      0,
                      ITEM_SIZE * index,
                      ITEM_SIZE * (index + 1),
                    ]

                    const scale = scrollY.interpolate({
                      inputRange,
                      outputRange: [1,1,1,0]
                    })
                    const opacity = scrollY.interpolate({
                      inputRange : opacityInputRange,
                      outputRange: [1,1,1,0]
                    })
                   
                    return (
                      <Animated.View
                        style={{flexDirection:"row", padding: SPACING, marginBottom: SPACING,backgroundColor: 'rgba(171, 162, 162,0.8)',borderRadius:12,overflow:"hidden",
                        shadowColor : "#000",
                        shadowOffset: {
                          width : 0,
                          height: 10,
                        },
                        shadowOpacity: .3,
                        shadowRadius: 20,
                        opacity,
                        transform:[{scale}],
                      }}
                        onPress={() => alert("see profil winker")}
                      >

                        <Pressable onPress={() => onModalProfilWinker(item)} style={{flex:1}}>
                          <Image style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius:AVATAR_SIZE,
                                marginRight: SPACING / 2,}}
                                source={{uri: item.photoProfil}}
                                onError ={(error)  => console.warn(error)}
                            />
                        </Pressable>
                        
                        <Pressable onPress={() => onModalProfilWinker(item)} style={{flex:3}}>
                          
                          <Text>{item.username}</Text>
                          
                          {(item.bio) ?
                            <Text>Bio : {item.bio}</Text>
                            :
                            <Text></Text>
                          }
                          
                        </Pressable>

                        <Pressable style={{position:"absolute",alignItems:"flex-end",width:"100%"}}>
                          <Text onPress={() => handleNavigation(item)} style={{textAlign:"right",alignItems:"flex-end",marginTop:7}}> <Fontisto style={{color:'black'}} name={'paper-plane'} size={30} /></Text>
                        </Pressable>

                        {/* <Text>Voici l'item : {JSON.stringify(item)}</Text> */}
                      </Animated.View>
                    )
                    } 
                  }
                  //keyExtractor={item => item.id.toString()}  
                />
              
              }
            
            <View style={{display:'flex',flexDirection:'row',bottom:4,position:"absolute",backgroundColor:"white",width:"100%",padding:5,justifyContent:"space-between"}} >
                
                <TextInput
                  style={{borderWidth:1,borderColor:'black',width:"90%",borderRadius:10,backgroundColor:'rgba(255,255,255,0.8)'}}
                  placeholder="Chercher un winker !"
                  
                  onChangeText={(searchString) => {handleSearchWinker(searchString)}}
                  underlineColorAndroid="transparent"
                />

                <TouchableOpacity style={{backgroundColor:'transparent'}} >
                  <Fontisto name={'search'} size={27} style={{color:'black'}}  />
                </TouchableOpacity>
            
            </View>
            
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={seeModalProfilWinker}
          onRequestClose={() => {
              alert("Modal has been closed.");
            }}
        >

        <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38}}>
                    
          <TouchableOpacity onPress={() => setSeeModalProfilWinker(false)} style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

          <View style={{backgroundColor:'white', flex:3,borderRadius:45, borderWidth : 4}}>
            <Text>Voila le profil du winker : {JSON.stringify(itemSeeWinker)}</Text>
          </View>

          <TouchableOpacity onPress={() => setSeeModalProfilWinker(false)} style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    
        </View>

        </Modal>


        {/* Pour la création de groupe dans le chat */}
          <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisiblePaperPlane}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={() => setModalVisiblePaperPlane(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>
                      <View style={{height:90}}>
                            <TextInput
                                style={{fontSize:30,marginTop:15,textAlign:"center"}}
                                placeholder="Titre du groupe !"
                                onChangeText={(searchString) => setTitreGroup(searchString)}
                                underlineColorAndroid="transparent"
                            />
                      </View>

                        <View style={{display:'flex',flexDirection:'row',marginTop:15}} >

                            <TextInput
                                style={{borderWidth:1,borderColor:'black',width:"100%",borderRadius:10}}
                                placeholder="Ajouter des winker à votre groupe !"
                                onChangeText={(searchString) => {handleSearchWinker(searchString)}}
                                underlineColorAndroid="transparent"
                            />

                            <TouchableOpacity style={{backgroundColor:'transparent',marginTop:9,transform: [{ translateX: -34 }]}} >
                                <Fontisto name={'search'} size={27} style={{color:'white'}}  />
                            </TouchableOpacity>
                        </View>
                      {!isSearchingWinker ?//Dans ce cas on montre le winkerChatWithoutGroup
                        <FlatList
                              refreshControl={
                                <RefreshControl
                                    //refreshing={refreshing}
                                    onRefresh={() => setModalVisiblePaperPlane(false)}
                                />
                                }
                            data={(winkersChatWithoutGroup.filter(element => element.winker2 != null))}
                            renderItem={renderItemEnvoieAmie}
                            keyExtractor={item => item.id}
                            scrollEnabled={true}
                        />
                        ://Dans ce cas on montre les dataWinkers
                        <FlatList
                          refreshControl={
                              <RefreshControl
                                  //refreshing={refreshing}
                                  onRefresh={() => setModalVisiblePaperPlane(false)}
                              />
                              }
                          data={(dataWinkers)}
                          // keyExtractor={(item) => item.id}
                          renderItem={renderItemEnvoieAmie}
                          keyExtractor={item => item.id}
                          scrollEnabled={true}
                      />

                }


                    </View>

                    {listIdUserSendEvent.length != 0 ?
                    
                        <Button onPress={() =>sendEventFriends() } title="Envoyer" />

                        :

                        <Button title="" />

                    }
                        
                    
                </View>
            
          </Modal>
       


    </View>
    )
}


let recording = new Audio.Recording();

const RenderMessageComponent = ({navigation , item}) => {


     //*****************POUR LE REDUX **************************/

     const ipAdress = useSelector((state) => state.ipAdress);
     const currentUser = useSelector((state) => state.currentUser);
     const winkersChat = useSelector((state) => state.winkersChat);
     const token = useSelector((state) => state.token);
     const dispatch = useDispatch();

     //*************************************************************** */

     const widthScreen = Dimensions.get('window').width;
     const heightScreen = Dimensions.get('window').height;


     //******************************************************************* */

     const [isLikeMessage , setIsLikeMessage] = useState(item.isLiked)

     
  //*********************** POUR LE LONG PRESS DU MESSAGE ******************** */

  const [itemLongPressMessage , setItemLongPressMessage] = useState({})

  const [visibleModalLongPress , setVisibleModalLongPress] = useState(false)

  const handleLongPressMessage = (item) => {

    setItemLongPressMessage(item)
    setVisibleModalLongPress(true)
  }

  //********************************************************************************* */

  //************************************************************* */

  function isEvent(event){
    if(event == null){
      return false
    }
    else{
      return true
    }
  }

  function isAudio(audio){
    if(audio == null){
      return false
    }
    else{
      return true
    }
  }

  function isMessage(message){
    if(message == null){
      return false
    }
    else{
      return true
    }
  }

  const handleLikeMessage = () => {

    if(item._id){
      
      axios.post(ipAdress + '/profil/handleLikeMessageChatWinkerMessagesClass/', {
        idMessage: item.item._id,
      }, {
        headers: {
          'Authorization': 'Token '+token
        }
    })
      .then(function (response) {
         setIsLikeMessage(response.data.isLike)
      })
      .catch(function (error) {
        console.log(error);
      });

    }



  }

  return(
    <TouchableWithoutFeedback onPress={() => handleLikeMessage()} onLongPress={() => handleLongPressMessage(item.item)} >
    <View style={{ marginTop: 6 }}>
      {/* <Text style={{color:"red"}}>{JSON.stringify(item.item)}</Text> */}
        {isMessage(item.item.message)  &&
          <View
            style={{
              maxWidth: Dimensions.get('screen').width * 0.8,
              backgroundColor: 
                item.item.sender._id === currentUser.id
                    ? 'rgb(79, 149, 189)'
                    : 'rgb(79, 80, 81)',
               alignSelf:
                item.item.sender._id === currentUser.id
                  ? 'flex-end'
                  : 'flex-start' ,
              marginHorizontal: 10,
              padding: 10,
              borderRadius: 8,
              borderBottomLeftRadius:
                item.item.sender._id === currentUser.id ? 8 : 0,
              borderBottomRightRadius:
                item.item.sender._id === currentUser.id ? 0 : 8,
            }}
          >
            
              <Text style={{color: '#fff',fontSize: 16,}}>{item.item.message}</Text>
              <Text style={{color: '#dfe4ea',fontSize: 14,alignSelf: 'flex-end',}}>{item.item.time}</Text>
              {isLikeMessage &&
                <AntDesign name={'heart'} size={15} style={{color:'red'}} />
              }
              
          </View>
        }
        {isEvent(item.item.event) &&
          <Pressable
          onPress = {() => navigation.navigate('ShowEvent' , {"event" : item.item.event})}
          style={{
            width: 150,height: 230,backgroundColor: '#transparent',

            alignSelf:
              item.item.sender._id === currentUser.id
              ? 'flex-end' 
              : 'flex-start',
              
            borderBottomLeftRadius:
              item.item.sender._id === currentUser.id ? 8 : 0,
            borderBottomRightRadius:
              item.item._id === currentUser.id ? 0 : 8,
    
            marginHorizontal: 10,padding: 10,borderRadius: 8,borderWidth:1,borderColor:"black"
          }}
        >
          {item.item.event.filesEvent[0].image != null &&
            <Image        
              style={{width:"100%" , height:"100%"}}
              source={{
                uri: ipAdress +item.item.event.filesEvent[0].image,
              }}
            />
          }
          {!(item.item.event.filesEvent[0].image) == null &&
            <Video        
              style={{width:"100%" , height:"100%"}}
              source={{
                uri: "http://192.168.43.24"+item.item.event.filesEvent[0].video,
              }}
              muted = {true}
              paused = {true}
              shouldPlay = {false}
            />
          }
          
          </Pressable>
        }
        {isAudio(item.item.audio) &&
          <ElementAudio idUserMessage = {item.item.sender._id} idCurrentUser={currentUser.id} fileAudio={item.item.audio} />
        }

      <Modal
          animationType="slide"
          transparent={true}
          visible={visibleModalLongPress}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
      >
        <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
            <TouchableOpacity onPress={() => setVisibleModalLongPress(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
            <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}> 

            </View>              
        </View>
            
      </Modal>

    </View>
</TouchableWithoutFeedback>
  )
}

const ChatIndividual = ({route , navigation}) => {


  //************************************************************************************************* */
  //                                                                                                  //
  //                                       NOTE SUR LA PAGE                                           //
  //                                                                                                  //
  //  user2 represente le user qui va recevoir les messages                                           //
  //  inputMessage est la variable qui contient le message à envoyer                                  //
  //  LA fonction sendMessage est la fonction qui envoie le message                                   //
  //                                                                                                  //
  //                                                                                                  //
  //************************************************************************************************* */

  //***************************************POUR LE REDUX ***********************************************/

     const ipAdress = useSelector((state) => state.ipAdress);
     const currentUser = useSelector((state) => state.currentUser);
     const winkersChat = useSelector((state) => state.winkersChat);
     const token = useSelector((state) => state.token);
     const ipAdressSocket = useSelector((state) => state.ipAdressSocket)
     const dispatch = useDispatch();
     //********************************************************************************************** */

  const [data , setData] = useState(route.params["item"]) //correspond aux donnees du current user

  const [meId , setMeId] = useState(route.params["meId"])

  const[user2 , setUser2] = useState(route.params["user2Id"])

  const [chatWinkerId , setChatWinkerId] = useState(route.params["ChatWinkerId"])

  const [messages , setMessages] = useState([])

  const [listNewMessages , setListNewMessages] = useState([])


  const widthScreen = Dimensions.get('window').width;
  const heightScreen = Dimensions.get('window').height;

  //*********************************  RECUPERATION DES MESSAGES  *****************************************/

  useEffect(() => {
    axios.post(ipAdress + '/profil/chatIndividual/', {
        "getData" : 1,
        "getMessages" : 0,
        "addMessage" : 0,
        "winkerIdRecoit": data.id,
        "user2" : user2,
       }, {
        headers: {
          'Authorization': 'Token '+token,
        }})
       .then(function (response) {
        console.log("j'essaye de get les datas")
        setMessages(response.data.data)

        //**********ON RENINITALISE MTN LE SEEN DU WinkersChat ******************/

        fetch(ipAdress+'/profil/getWinkersChat/',{
          method:"GET",
          headers: {
            'Authorization': 'Token '+token,
          },
        })
          .then( (response) => response.json() )
          .then( (response) => {
              
            dispatch(setWinkersChat(response.data))
            
          })
          .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             alert(error)
              throw error;
          });
       })
       .catch(function (error) {
         console.log(error);
       });


  }, []);


  //****************************************************************************************** */


  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon
              name='angle-left'
              type='font-awesome'
              size={30}
              color='#fff'
            />
          </TouchableOpacity>

        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => {
            Alert.alert('Audio Call', 'Audio Call Button Pressed');
          }}
        >
          <Icon name='call' size={28} color='#fff' />
        </TouchableOpacity>
      ),
    });
  }, []);


  const renderMessage = (item) => {

    //console.log("voici le item.item :",item.item)
    // console.log("voici le current user :",currentUser.id)
    return(
      <View>
        <RenderMessageComponent navigation={navigation} item = {item} />
      </View>
    )
  }

  //******************************* POUR GERER L'AUDIO *********************************************/

  const [showDraggable , setShowDraggable] = useState(false);
  const [dropZoneValues , setDropZoneValues] = useState(null);
  const [pan , setPan] = useState(new Animated.ValueXY());
  const [recording, setRecording] = React.useState();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder    : () => true,
    onPanResponderMove:  Animated.event(
      [
        null,
        { dx: pan.x, dy: pan.y }
      ],
      {useNativeDriver: false}
    ),
    onPanResponderGrant: (event, gesture) => {
      setShowDraggable(true)
      setRecording(null)
      startRecording();
    },
    onPanResponderRelease : (e, gesture) => {
        if(isDropZone(gesture)){
          setRecording(undefined)
          setShowDraggable(false)
          console.log("you pressed out in a false area")
          Animated.spring(
            pan,
            {toValue:{x:0,y:0}},
            {useNativeDriver: false}
        ).start();
     
        }else{
          console.log("you pressed out in a good area")
          stopRecording()
          console.log("stop recording")
          setRecording(undefined)
          setShowDraggable(false)
            Animated.spring(
                pan,
                {toValue:{x:0,y:0}},
                {useNativeDriver: false}
            ).start();
        }
    }
  });

  const isDropZone = (gesture) => {
    //Une hauteur de 400 en partant du haut
    return gesture.moveY < 400;
    }

  async function startRecording() {
    setRecording(undefined)
    
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        console.log("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }


  async function stopRecording() {

    //******************** D'ABORD ON ENREGISTRE LE VOCAL DANS LA BDD *******************/
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    const { sound, status } = await recording.createNewLoadedSoundAsync();
 
    uploadAudio(recording.getURI())

    //sendAudioWebSocket(recording.getURI())


    //******************* ENSUITE IL FAUT L'AFFICHER SUR L'ECRAN ************************/

    // let t = getTime(new Date());
    // setMessages([
      
    //   {
    //     _id : messages[messages.length - 1]["_id"] + 1,
    //     event : null,
    //     message: null,
    //     audio : recording.getURI(),
    //     sender: {
    //       _id : currentUser.id,
    //       name: currentUser.name,
    //       avatar : currentUser.avatar,
    //     },
    //     time: t,
    //   },
    //   ...messages
    // ]);


  }
  

  const sendAudioWebSocket = async (ChatWinkerMessageClassId) => {

    console.log("je suis dans sendAudioWebSocket : ",ChatWinkerMessageClassId)


      // 👇️ from CURRENT DATE
      const now = new Date();
      const currentTime = now.getHours() + ':' + now.getMinutes();
      console.log(currentTime); // 👉️ 13:27

      ws.current.send(JSON.stringify({
        "ChatWinkerMessageClassId" : ChatWinkerMessageClassId,
        "currentTime":currentTime,
        "chatWinkerId":chatWinkerId,
        "user2Id": user2,
        "meId":meId,
        "isAudio":true,
        "isMessage":false,
      }))


    }

  const uploadAudio = async (fileAudio) => {
    
    if(fileAudio){
      console.log("je suis dans uploadAudio")

      console.log(fileAudio)
      const fileUri = fileAudio;
      let filename = fileUri.split('/').pop();
 
      const extArr = /\.(\w+)$/.exec(filename);
      //const type = getMimeType(extArr[1]);
      const type = "audio/mp4"
 
      let formData = new FormData();

      formData.append("addAudio",1)
 
      formData.append('audioToUpload', { uri: fileUri, name: filename, type });
      formData.append("getData",0)
      formData.append("addMessage",0)
      formData.append("getMessages",0)
      
      formData.append("chatWinkerId",data.chatWinkerId)
      formData.append("winkerIdRecoit",data.id)
      formData.append("getData",0)
      formData.append("user2",user2)

      fetch(ipAdress+"/profil/chatIndividual/", {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'token '+token,
          'content-type': 'multipart/form-data',
        },
      })
        .then( (response) => response.json() )
        .then( (responseJson) => {
          console.log("rtttttttttttttttr ",responseJson)
          sendAudioWebSocket(responseJson.messageEnvoye)
        })
        .catch(function(error) {
          console.log('Home/EventItem/event.js Comment ligne 153 There has been a problem with your fetch operation: ' + error.message);
           alert(error)
            throw error;
        });

    }

};

  //************************************ TRAVAIL SUR LES WEBSOCKET ****************************************/

  const [isPaused, setPause] = useState(false);
  const ws = useRef(null);

  const sendMessageWebSocket = () => {

    if(inputMessage == ""){
      alert("le message ne doit pas etre vide")
      return
    }

    // 👇️ from CURRENT DATE
    const now = new Date();
    const currentTime = now.getHours() + ':' + now.getMinutes();
    console.log(currentTime); // 👉️ 13:27

    console.log("voici l'id du winker qui recoit le msg : ",user2)

    ws.current.send(JSON.stringify({
      "inputMessage":String(inputMessage),
      "currentTime":currentTime,
      "chatWinkerId":chatWinkerId,
      "user2Id": user2,
      "meId":meId,
      "isAudio":false,
      "isMessage":true,
    }))
  }

  useEffect(() => {
    ws.current = new WebSocket('ws://'+String(ipAdressSocket)+'/profil/chatWinker/'+String(chatWinkerId)+'/');
      // ws.current = new WebSocket('ws://192.168.43.24/profil/chatWinker/'+String(chatWinkerId)+'/');
      ws.current.onopen = () => console.log("ws opened");
      ws.current.onclose = () => console.log("ws closed");

      const wsCurrent = ws.current;

      return () => {
          wsCurrent.close();
      };
  }, []);

  useEffect(() => {

      if (!ws.current) return;

      ws.current.onmessage = e => {
          if (isPaused) return;
          const data = JSON.parse(e.data);
          console.log("e", data);

          console.log("voici les msg de listNewMessages avant d'avoir actualisé : ",listNewMessages)

          console.log(listNewMessages.length)

          var clone = listNewMessages.map((x) => x);

          
          if(Boolean(data["isMessage"])){
          
            if(listNewMessages.length != 0){

              console.log("je suis dans le if pour les messages")

              console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)

              setListNewMessages(oldArray => [
                {
                  _id : listNewMessages[listNewMessages.length - 1]["_id"] + 1,
                  event : null,
                  message: data["inputMessage"],
                  audio: null,
                  sender: {
                    _id : currentUser.id,
                    name: currentUser.name,
                    avatar : currentUser.avatar,
                  },
                  time: data["currentTime"],
                },
                ...oldArray,
              ]
              );

              console.log("voici le listNewMessages apres actualiser : ",listNewMessages)

            }else{
              console.log("je suis dans le else pour les messages")

              console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)

              setListNewMessages(oldArray => [
                {
                  _id : 0,
                  event : null,
                  message: data["inputMessage"],
                  audio: null,
                  sender: {
                    _id : currentUser.id,
                    name: currentUser.name,
                    avatar : currentUser.avatar,
                  },
                  time: data["currentTime"],
                },
                ...oldArray
              ]);

              
              console.log("voici le listNewMessages apres actualiser : ",listNewMessages)
            }

          }

          if(Boolean(data["isAudio"])){

            console.log("voici l'uri de l'audio : ",data["audioUri"])
                      
            if(listNewMessages.length != 0){

              console.log("je suis dans le if pour les messages")

              console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)


              setListNewMessages(oldArray => [
                {
                  _id : listNewMessages[listNewMessages.length - 1]["_id"] + 1,
                  event : null,
                  message: null,
                  audio: ipAdress + "/media/" + data["audioUri"],
                  sender: {
                    _id : currentUser.id,
                    name: currentUser.name,
                    avatar : currentUser.avatar,
                  },
                  time: data["currentTime"],
                },
                ...oldArray,
              ]);

              console.log("voici le listNewMessages apres actualiser : ",listNewMessages)

            }else{
              console.log("je suis dans le else pour les messages")

              console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)



              setListNewMessages(oldArray => [
                {
                  _id : 0,
                  event : null,
                  message: null,
                  audio: ipAdress + "/media/" + data["audioUri"],
                  sender: {
                    _id : currentUser.id,
                    name: currentUser.name,
                    avatar : currentUser.avatar,
                  },
                  time: data["currentTime"],
                },
                ...oldArray,
              ]);

              
              console.log("voici le listNewMessages apres actualiser : ",listNewMessages)
            }



          }


      
      };

  }, [isPaused]);

  //**************************************************************************************************** */

  //*********************************************************************************************** */

  return (
    <TouchableWithoutFeedback style={{backgroundColor:"transparent"}} onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>

        <TouchableOpacity onLongPress={() => alert("you long pressed")} style={{top:0,backgroundColor:"grey",width: widthScreen - 10 ,height:70,borderRadius:40,opacity:0.7,flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
        <Image
            style={{width: 50,height: 50,borderRadius: 25,borderWidth: 3,borderColor: '#4c4c4c',}}
            source={{uri: data.photoProfil}}
        /> 
          <Text style={{color:"black"}}>{data.username}</Text>
        </TouchableOpacity>

        {showDraggable &&
          <View style={{top:0,height:400, backgroundColor:"red",alignItems:"center",justifyContent:"center",opacity:0.5}}>
            <Entypo name={'trash'} size={65} style={{color:'white'}}  />
          </View>
        }

          <FlatList
            style={{ backgroundColor: '#f2f2ff' }}
            inverted={true}
            contentContainerStyle={{
              flexGrow: 1, justifyContent: 'flex-end',
            }}
            
            data={listNewMessages.concat(messages)}
            renderItem={renderMessage}
          />

        <View style={{ paddingVertical: 10,backgroundColor:"black" }}>
          <View style={styles.messageInputView}>
            
            {/* Micro pour enregistrer l'audio */}
            <TouchableOpacity
              style={styles.messageSendView}
            >
              
               <View 
                onLayout={(event) => {
                  setDropZoneValues(event.nativeEvent.layout)
                }}
              >
                  <Animated.View       
                    {...panResponder.panHandlers}
                    style={[pan.getLayout(), {}]}
                  >

                        <Icon name='microphone' type='font-awesome' />

                  </Animated.View>
              </View>

            </TouchableOpacity>
            
            {/* TextInput pour ecrire le message */}
            <TextInput
              defaultValue={inputMessage}
              value={inputMessage}
              style={styles.messageInput}
              placeholder='Message'
              onChangeText={(text) => setInputMessage(text)}
              onSubmitEditing={() => {
                console.log("msg submitted")
                sendMessageWebSocket();
                setInputMessage("")
                //sendMessage();
              }}
           
            />
            
            {/* Pour l'envoie d'un message ecrit */}
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={() => {
                //sendMessage();
                //sendMessage2();
                sendMessageWebSocket();
                setInputMessage("")
                }}
            >
              <Icon name='send' type='material' />
            </TouchableOpacity>
          </View>
        </View>
      
      </View>
    </TouchableWithoutFeedback>
  );

}


const ShowEvent = ({route , navigation}) => {
  const { event } = route.params;

  return(
    <View style={{flex:1, backgroundColor:"green"}}>
      <Text>Nous montrons l'event  : {JSON.stringify(event)}</Text>
    </View>
  )
}


//*************************************************************************************************** */
//                                                                                                    */
//                                CHAT INDIVIDUAL GROUP                                               */
//                                                                                                    */
//*************************************************************************************************** */

const ChatIndividualGroup = ({route, navigation}) =>{
  //***************************************POUR LE REDUX ***********************************************/

  const ipAdress = useSelector((state) => state.ipAdress);
  const currentUser = useSelector((state) => state.currentUser);
  const winkersChat = useSelector((state) => state.winkersChat);
  const winkersChatWithoutGroup = useSelector((state) => state.winkersChatWithoutGroup);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  //********************************************************************************************** */

  const [idChatWinker , setIdChatWinker] = useState(route.params["idParticipeWinker"])
  const [creatorGroupId , setCreatorGroupId] = useState(route.params["creatorGroupId"])
  const [messages , setMessages] = useState([]);

  const [listNewMessages , setListNewMessages] = useState([]);

  const [meId , setMeId] = useState(currentUser.id);

  //******************************************************************************************** */

  const [titreGroupe , setTitreGroupe] = useState("");
  const [listIdWinkerGroupe , setListIdWinkerGroup] = useState([])

  const widthScreen = Dimensions.get('window').width;
  const heightScreen = Dimensions.get('window').height;

  //*********************************  RECUPERATION DES MESSAGES  *****************************************/

  useEffect(() => {
    axios.post(ipAdress + '/profil/chatIndividualGroup/', {
        "getData" : 1,
        "getMessages" : 0,
        "addMessage" : 0,
        "idChatWinker" : idChatWinker,
      }, {
        headers: {
          'Authorization': 'Token '+token,
        }})
       .then(function (response) {
        console.log("j'essaye de get les datas")
        setMessages(response.data.data)
        setTitreGroupe(response.data.titreGroupe)
        setListIdWinkerGroup(response.data.listIdWinkerGroup)

        //**********ON RENINITALISE MTN LE SEEN DU WinkersChat ******************/

        fetch(ipAdress+'/profil/getWinkersChat/',{
          method:"GET",
          headers: {
            'Authorization': 'Token '+token,
          },
        })
          .then( (response) => response.json() )
          .then( (response) => {
              
            dispatch(setWinkersChat(response.data))
            
          })
          .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             alert(error)
              throw error;
          });
       })
       .catch(function (error) {
         console.log(error);
       });


  }, []);

    //****************************************************************************************** */

    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
      navigation.setOptions({
        title: '',
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                name='angle-left'
                type='font-awesome'
                size={30}
                color='#fff'
              />
            </TouchableOpacity>
  
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => {
              Alert.alert('Audio Call', 'Audio Call Button Pressed');
            }}
          >
            <Icon name='call' size={28} color='#fff' />
          </TouchableOpacity>
        ),
      });
    }, []);
  
  
    const renderMessage = (item) => {
  
      //console.log("voici le item.item :",item.item)
      // console.log("voici le current user :",currentUser.id)
      return(
        <View>
          <RenderMessageComponent navigation={navigation} item = {item} />
        </View>
      )
    }
    //************************************ TRAVAIL SUR LES WEBSOCKET ****************************************/

    const [isPaused, setPause] = useState(false);
    const ws = useRef(null);
  
    const sendMessageWebSocket = () => {
  
      if(inputMessage == ""){
        alert("le message ne doit pas etre vide")
        return
      }
  
      // 👇️ from CURRENT DATE
      const now = new Date();
      const currentTime = now.getHours() + ':' + now.getMinutes();
      console.log(currentTime); // 👉️ 13:27
  
  
      ws.current.send(JSON.stringify({
        "inputMessage":String(inputMessage),
        "currentTime":currentTime,
        "chatWinkerId":idChatWinker,
        "meId":meId,
        "isAudio":false,
        "isMessage":true,
      }))
    }
  
    useEffect(() => {
      console.log("voici l'idChatWinker : ",idChatWinker)
        ws.current = new WebSocket('ws://'+String(ipAdressSocket)+'/profil/chatWinkerGroup/'+String(idChatWinker)+'/');
        //ws.current = new WebSocket('ws://192.168.43.24/profil/chatWinkerGroup/'+String(idChatWinker)+'/');
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");
  
        const wsCurrent = ws.current;
  
        return () => {
            wsCurrent.close();
        };
    }, []);
  
    useEffect(() => {
  
        if (!ws.current) return;
  
        ws.current.onmessage = e => {
            if (isPaused) return;
            const data = JSON.parse(e.data);
            console.log("e", data);
  
            console.log("voici les msg de listNewMessages avant d'avoir actualisé : ",listNewMessages)
  
            console.log(listNewMessages.length)
  
            var clone = listNewMessages.map((x) => x);
  
            
            if(Boolean(data["isMessage"])){
            
              if(listNewMessages.length != 0){
  
                console.log("je suis dans le if pour les messages")
  
                console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)
  
                setListNewMessages(oldArray => [
                  {
                    _id : listNewMessages[listNewMessages.length - 1]["_id"] + 1,
                    event : null,
                    message: data["inputMessage"],
                    audio: null,
                    sender: {
                      _id : currentUser.id,
                      name: currentUser.name,
                      avatar : currentUser.avatar,
                    },
                    time: data["currentTime"],
                  },
                  ...oldArray
                ]);
  
                console.log("voici le listNewMessages apres actualiser : ",listNewMessages)
  
              }else{
                console.log("je suis dans le else pour les messages")
  
                console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)
  
                setListNewMessages(oldArray => [
                  {
                    _id : 0,
                    event : null,
                    message: data["inputMessage"],
                    audio: null,
                    sender: {
                      _id : currentUser.id,
                      name: currentUser.name,
                      avatar : currentUser.avatar,
                    },
                    time: data["currentTime"],
                  },
                  ...oldArray
                ]);
  
                
                console.log("voici le listNewMessages apres actualiser : ",listNewMessages)
              }
  
            }
  
            if(Boolean(data["isAudio"])){
  
              console.log("voici l'uri de l'audio : ",data["audioUri"])
                        
              if(listNewMessages.length != 0){
  
                console.log("je suis dans le if pour les messages")
  
                console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)
  
  
                setListNewMessages(oldArray => [
                  {
                    _id : listNewMessages[listNewMessages.length - 1]["_id"] + 1,
                    event : null,
                    message: null,
                    audio: ipAdress + "/media/" + data["audioUri"],
                    sender: {
                      _id : currentUser.id,
                      name: currentUser.name,
                      avatar : currentUser.avatar,
                    },
                    time: data["currentTime"],
                  },
                  ...oldArray
                ]);
  
                console.log("voici le listNewMessages apres actualiser : ",listNewMessages)
  
              }else{
                console.log("je suis dans le else pour les messages")
  
                console.log("voici le listNewMessages avant d'actualiser : ",listNewMessages)
  
  
  
                setListNewMessages(oldArray => [
                  {
                    _id : 0,
                    event : null,
                    message: null,
                    audio: ipAdress + "/media/" + data["audioUri"],
                    sender: {
                      _id : currentUser.id,
                      name: currentUser.name,
                      avatar : currentUser.avatar,
                    },
                    time: data["currentTime"],
                  },
                  ...oldArray
                ]);
  
                
                console.log("voici le listNewMessages apres actualiser : ",listNewMessages)
              }
  
  
  
            }
   
        };
  
    }, [isPaused]);
  
    //**************************************************************************************************** */
  

    //******************************* POUR GERER L'AUDIO *********************************************/

    const [showDraggable , setShowDraggable] = useState(false);
    const [dropZoneValues , setDropZoneValues] = useState(null);
    const [pan , setPan] = useState(new Animated.ValueXY());
    const [recording, setRecording] = React.useState();
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder    : () => true,
      onPanResponderMove:  Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        {useNativeDriver: false}
      ),
      onPanResponderGrant: (event, gesture) => {
        setShowDraggable(true)
        setRecording(null)
        startRecording();
      },
      onPanResponderRelease : (e, gesture) => {
          if(isDropZone(gesture)){
            setRecording(undefined)
            setShowDraggable(false)
            console.log("you pressed out in a false area")
            Animated.spring(
              pan,
              {toValue:{x:0,y:0}},
              {useNativeDriver: false}
          ).start();
       
          }else{
            console.log("you pressed out in a good area")
            stopRecording()
            console.log("stop recording")
            setRecording(undefined)
            setShowDraggable(false)
              Animated.spring(
                  pan,
                  {toValue:{x:0,y:0}},
                  {useNativeDriver: false}
              ).start();
          }
      }
    });
  
    const isDropZone = (gesture) => {
      //Une hauteur de 400 en partant du haut
      return gesture.moveY < 400;
      }
  
    async function startRecording() {
      setRecording(undefined)
      
      try {
        const permission = await Audio.requestPermissionsAsync();
  
        if (permission.status === "granted") {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true
          });
          
          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
  
          setRecording(recording);
        } else {
          console.log("Please grant permission to app to access microphone");
        }
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    }
  
  
    async function stopRecording() {
  
      //******************** D'ABORD ON ENREGISTRE LE VOCAL DANS LA BDD *******************/
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
  
      const { sound, status } = await recording.createNewLoadedSoundAsync();
   
      uploadAudio(recording.getURI())
  
      //sendAudioWebSocket(recording.getURI())
  
  
      //******************* ENSUITE IL FAUT L'AFFICHER SUR L'ECRAN ************************/
  
      // let t = getTime(new Date());
      // setMessages([
        
      //   {
      //     _id : messages[messages.length - 1]["_id"] + 1,
      //     event : null,
      //     message: null,
      //     audio : recording.getURI(),
      //     sender: {
      //       _id : currentUser.id,
      //       name: currentUser.name,
      //       avatar : currentUser.avatar,
      //     },
      //     time: t,
      //   },
      //   ...messages
      // ]);
  
  
    }
    
  
    const sendAudioWebSocket = async (ChatWinkerMessageClassId) => {
  
      console.log("je suis dans sendAudioWebSocket : ",ChatWinkerMessageClassId)
  
  
        // 👇️ from CURRENT DATE
        const now = new Date();
        const currentTime = now.getHours() + ':' + now.getMinutes();
        console.log(currentTime); // 👉️ 13:27
  
        ws.current.send(JSON.stringify({
          "ChatWinkerMessageClassId" : ChatWinkerMessageClassId,
          "currentTime":currentTime,
          "chatWinkerId":idChatWinker,
          //"meId":meId,
          "isAudio":true,
          "isMessage":false,
        }))
  
  
      }
  
    const uploadAudio = async (fileAudio) => {
      
      if(fileAudio){
        console.log("je suis dans uploadAudio")
  
        console.log(fileAudio)
        const fileUri = fileAudio;
        let filename = fileUri.split('/').pop();
   
        const extArr = /\.(\w+)$/.exec(filename);
        //const type = getMimeType(extArr[1]);
        const type = "audio/mp4"
   
        let formData = new FormData();
  
        formData.append("addAudio",1)
   
        formData.append('audioToUpload', { uri: fileUri, name: filename, type });
        formData.append("getData",0)
        formData.append("addMessage",0)
        formData.append("getMessages",0)
        
        formData.append("chatWinkerId",idChatWinker)
        formData.append("getData",0)
  
        fetch(ipAdress+"/profil/chatIndividualGroup/", {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': 'token '+token,
            'content-type': 'multipart/form-data',
          },
        })
          .then( (response) => response.json() )
          .then( (responseJson) => {
            console.log("rtttttttttttttttr ",responseJson)
            if(responseJson.messageEnvoye){
              sendAudioWebSocket(responseJson.messageEnvoye)
            }
            else{
              alert("un pb a eu lieu lors de votre audio")
            }
          })
          .catch(function(error) {
            console.log('Home/EventItem/event.js Comment ligne 153 There has been a problem with your fetch operation: ' + error.message);
             alert(error)
              throw error;
          });
  
      }
  
  };

  //*********************************** POUR LES DETAILS DU GROUPE ************************************* */

  const [modalVisibleDetailsGroup , setModalVisibleDetailsGroup] = useState(false);
  const [dataWinkersGroup , setDataWinkersGroup] = useState([]);


  const exclureGroup = (idWinkerExclure , username) => {

    return Alert.alert(
      "Are your sure?",
      " you want to exclude the user : " + username,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
    
            axios.post(ipAdress + '/profil/exclureWinkerGroup/', {
              idChatWinker: idChatWinker,
              idWinkerExclure : idWinkerExclure,
              }, {
                  headers: {
                    'Authorization': 'Token '+token
                  }
              })
                .then(function (response) {
                  
                  alert("l'operation a reussie")
                  setModalVisibleDetailsGroup(false)
        
                })
                .catch(function (error) {
                  console.log(error);
                });
            
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );

  }

  const renderItemWinkerGroup = ({item}) => {
    return(
      <View style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly",padding:5,borderColor:"black",borderWidth:1,borderRadius:7,margin:4,alignItems:"center"}}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#4c4c4c',
            }}
            source={{uri: item.photoProfil }}
          /> 
          <Text >{item.username}</Text>

          {item.id == creatorGroupId &&
          <FontAwesome5 name="crown" size={20} color="yellow" />
          }
          {(item.id != creatorGroupId && currentUser.id == creatorGroupId) &&
          <TouchableOpacity onPress={() => exclureGroup(item.id, item.username)} style={{backgroundColor:"rgb(116, 116, 186)",padding:8,borderRadius:6}}>
              <Text>Exclure</Text>
          </TouchableOpacity>
    
          }
      </View>
    )
  }

  const QuitterGroupe = () => {

    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to leave this event ?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
    
            axios.post(ipAdress + '/profil/quitterGroupChatWinker/', {
              idChatWinker: idChatWinker,
              }, {
                  headers: {
                    'Authorization': 'Token '+token
                  }
              })
                .then(function (response) {
        
                  setDataWinkersGroup(response.data.data)
        
                })
                .catch(function (error) {
                  console.log(error);
                });
            
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );




    //****************************************************************************** */

  }

  const onModalDetailsGroup = () => {
    setModalVisibleDetailsGroup(!modalVisibleDetailsGroup);

    axios.post(ipAdress + '/profil/participantIndividualGroup/', {
      listIdWinkerGroupe: listIdWinkerGroupe,
  }, {
          headers: {
            'Authorization': 'Token '+token
          }
      })
        .then(function (response) {

          setDataWinkersGroup(response.data.data)

        })
        .catch(function (error) {
          console.log(error);
        });

  }

  //*******************************MODAL POUR AJOUTER DES PARTICIPANTS ********************************/

  const [modalVisibleAddParticipant , setModalVisibleAddParticipant] = useState(false);


  const [isSearchingWinker , setIsSearchingWinker] = useState(false);
  const [dataWinkers, setDataWinkers] = useState( {} );
  const [firstDataWinkers, setFirstDataWinkers] = useState( [] );

  const handleSearchWinker = (searchString) => {
          if(searchString != ""){setIsSearchingWinker(true)}
          else{setIsSearchingWinker(false)}
  
          setDataWinkers(firstDataWinkers.filter(item => item.username.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())))
        }
  
  const onModalAddParticipant = () => {
    setModalVisibleAddParticipant(!modalVisibleAddParticipant);


    //**********POUR LA BARRE DE RECHERCHE******************** */

    fetch(ipAdress+'/profil/getWinkers/',{
      method:"GET",
      headers: {
        'Authorization': 'Token '+token,
      },
    })
      .then( (response) => response.json() )
      .then( (responseJsonWinker) => {
          setFirstDataWinkers(responseJsonWinker.data)
          setDataWinkers(responseJsonWinker.data);

      })
      .catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
         alert(error)
          throw error;
      });




  }

  const renderItemAddParticipant = ({item}) => { 
      
    if(item.winker1 && item.winker2){//Alors les données viennent de winkersChatWithoutGroup
          return(
    <Pressable onPress = {() => addOrRemoveId(item)}
    style=
    {{
    backgroundColor:  contains(listIdUserSendEvent ,item) ?
        "green" :
        "transparent",
    display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
        <View style={{display:'flex',flexDirection:'row',flex:3}}>
              <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      borderWidth: 3,
                      borderColor: '#4c4c4c',
                    }}
                    source={{uri: item.winker1.id != currentUser.id ? item.winker1.photoProfil : item.winker2.photoProfil }}
                /> 
            {item.winker1.id != currentUser.id ?
                <Text> {item.winker1.username}</Text>
                :
                <Text> {item.winker2.username}</Text>
            }


             
        </View>
      
  
  
    </Pressable>
    )         
        }
    else{//Alors les données viennent de dataWinkers
            return(
                <Pressable
                onPress = {() => addOrRemoveIdDataWinkers(item.id)}
                style=
                {{
                backgroundColor:
                containsDataWinkers(listIdUserSendEvent,item.id) ?
                    "green" :
                    "transparent",
                display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
                    <View style={{display:'flex',flexDirection:'row',flex:3}}>
                          <Image
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 25,
                                  borderWidth: 5,
                                  borderColor: '#4c4c4c',
                                }}
                                source={{uri: item.photoProfil }}
                            /> 
                            <Text> {item.username}</Text>
                   
        
            
                         
                    </View>
                  
                    <View style={{flex:1,}}>
                        <Text style={{marginTop:20}}>
                             <Fontisto style={{color:'white'}} name={'paper-plane'} size={20} />
                        </Text>
                    </View>
              
                </Pressable>
            )
        }
    

  }

  const [listIdUserSendEvent , setListIdUserSendEvent] = useState([]);

  function contains(list , item) {
      // console.log("voici l'item de contains : ",item)

      if(item.winker1.id != currentUser.id){
          var x = item.winker1.id;
      }
      else{
          var x = item.winker2.id;
      }


      for(var u of list){
          if(u == x){
              return true;
          }
      }
      return false;
  }

  function containsDataWinkers(list , x) {
      for(var u of list){
          if(u == x){
              return true;
          }
      }
      return false;
  }

  function addOrRemoveId(item) {

      // console.log("voici l'item de addOrRemoveId : ",ListItemSwipeable)

      if(item.winker1.id != currentUser.id){
          var idWinker = item.winker1.id;
      }
      else{
          var idWinker = item.winker2.id;
      }

      var myClone = listIdUserSendEvent.map((x) => x);

      if(!contains(listIdUserSendEvent ,item)){
          
          myClone.push(idWinker)         
          setListIdUserSendEvent(myClone)

      }
      else{
          var myIndex = myClone.indexOf(idWinker);
          
          if (myIndex !== -1) {
              myClone.splice(myIndex, 1);
              setListIdUserSendEvent(myClone)
          }

      }
      
  }

  function addOrRemoveIdDataWinkers(idWinker) {
      
      var myClone = listIdUserSendEvent.map((x) => x);
      
      if(!containsDataWinkers(listIdUserSendEvent ,idWinker)){
                  
          myClone.push(idWinker)         
          setListIdUserSendEvent(myClone)
      
      }
      else{
          var myIndex = myClone.indexOf(idWinker);
                  
          if (myIndex !== -1) {
              myClone.splice(myIndex, 1);
              setListIdUserSendEvent(myClone)
          }
      
      }
              
  }

  const addParticipants = () => {
    console.log("voici la liste à ajouter : ",listIdUserSendEvent)

    axios.post(ipAdress + '/profil/addWinkerGroupChatIndividualVrai/', {
      listIdUserSendEvent: listIdUserSendEvent,
      idChatWinker : idChatWinker,
  }, {
          headers: {
            'Authorization': 'Token '+token
          }
      })
        .then(function (response) {

          alert("la modification a bien été éffectuée")

          setModalVisibleAddParticipant(false)
          setModalVisibleDetailsGroup(false)

        })
        .catch(function (error) {
          console.log(error);
        });
  }

  //*************************************************************************************************** */
  
  return(
    <View style={{flex:1,backgroundColor:"transparent"}}>

        <Pressable onLongPress={() => alert("you long pressed")} style={{top:0,backgroundColor:"grey",width: widthScreen - 10 ,height:70,borderRadius:40,opacity:0.7,flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
          <Text style={{color:"black"}}>{titreGroupe}</Text>
          
          <TouchableOpacity style={{padding:10}} onPress={() => onModalDetailsGroup()}>
            <Feather name={'more-horizontal'} size={40} style={{color:'black'}} />
          </TouchableOpacity>
          
        </Pressable>

        {showDraggable &&
          <View style={{top:0,height:400, backgroundColor:"red",alignItems:"center",justifyContent:"center",opacity:0.5}}>
            <Entypo name={'trash'} size={65} style={{color:'white'}}  />
          </View>
        }

        <FlatList
          style={{ backgroundColor: '#f2f2ff' }}
          inverted={true}
          //data={messages.concat(listNewMessages)}
          data={listNewMessages.concat(messages)}
          renderItem={renderMessage}
        />



        <View style={{ paddingVertical: 10,backgroundColor:"black" }}>
          <View style={styles.messageInputView}>
            
            {/* Micro pour enregistrer l'audio */}
            <TouchableOpacity
              style={styles.messageSendView}
            >
              
               <View 
                onLayout={(event) => {
                  setDropZoneValues(event.nativeEvent.layout)
                }}
              >
                  <Animated.View       
                    {...panResponder.panHandlers}
                    style={[pan.getLayout(), {}]}
                  >

                        <Icon name='microphone' type='font-awesome' />

                  </Animated.View>
              </View>

            </TouchableOpacity>
            
            {/* TextInput pour ecrire le message */}
            <TextInput
              defaultValue={inputMessage}
              style={styles.messageInput}
              placeholder='Message'
              onChangeText={(text) => setInputMessage(text)}
              //onSubmitEditing = { (e)=> { this.update(e); } }
              onSubmitEditing={() => {
                sendMessageWebSocket();
                setInputMessage("");
                //sendMessage();
              }}
            />
            
            {/* Pour l'envoie d'un message ecrit */}
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={() => {
                //sendMessage();
                //sendMessage2();
                sendMessageWebSocket();
                setInputMessage("")
                }}
            >
              <Icon name='send' type='material' />
            </TouchableOpacity>
          </View>
        </View>


                {/* Pour les details du groupe */}
          <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDetailsGroup}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleDetailsGroup(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View style={{backgroundColor:'grey', flex:3,borderRadius:25,color:"white"}}>

                    <TouchableOpacity onPress={() => onModalAddParticipant()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                      <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Inviter des participants </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => QuitterGroupe()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                      <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Quitter le groupe </Text>
                    </TouchableOpacity>
                  
                    <FlatList
                      refreshControl={
                          <RefreshControl
                            onRefresh={() => setModalVisibleDetailsGroup(false)}
                          />
                        }
                        data={dataWinkersGroup}
                        renderItem={renderItemWinkerGroup}
                        keyExtractor={item => item.id}
                        scrollEnabled={true}
                      />

                        
                    </View>
                
                </View>
            
          </Modal>

                {/* Pour ajouter des winkers au groupe */}
          <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAddParticipant}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleAddParticipant(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>


                        <View style={{display:'flex',flexDirection:'row',marginTop:15}} >

                            <TextInput
                                style={{borderWidth:1,borderColor:'black',width:"100%",borderRadius:10}}
                                placeholder="Ajouter des winker à votre groupe !"
                                onChangeText={(searchString) => {handleSearchWinker(searchString)}}
                                underlineColorAndroid="transparent"
                            />

                            <TouchableOpacity style={{backgroundColor:'transparent',marginTop:9,transform: [{ translateX: -34 }]}} >
                                <Fontisto name={'search'} size={27} style={{color:'white'}}  />
                            </TouchableOpacity>
                        </View>
                      {!isSearchingWinker ?//Dans ce cas on montre le winkerChatWithoutGroup
                        <FlatList
                              refreshControl={
                                <RefreshControl
                                    //refreshing={refreshing}
                                    onRefresh={() => setModalVisibleAddParticipant(false)}
                                />
                                }
                            data={(winkersChat.filter(element => element.winker2 != null))}
                            renderItem={renderItemAddParticipant}
                            keyExtractor={item => item.id}
                            scrollEnabled={true}
                        />
                        ://Dans ce cas on montre les dataWinkers
                        <FlatList
                          refreshControl={
                              <RefreshControl
                                  //refreshing={refreshing}
                                  onRefresh={() => setModalVisibleAddParticipant(false)}
                              />
                              }
                          data={(dataWinkers)}
                          // keyExtractor={(item) => item.id}
                          renderItem={renderItemAddParticipant}
                          keyExtractor={item => item.id}
                          scrollEnabled={true}
                      />

                }


                    </View>

                    {listIdUserSendEvent.length != 0 ?
                    
                        <Button onPress={() =>addParticipants() } title="Envoyer" />

                        :

                        <Button title="" />

                    }
                        
                    
                </View>
            
          </Modal>
       

    </View>
  )

}


const styles = StyleSheet.create({
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: { height: '100%', aspectRatio: 1, borderRadius: 100 },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  messageInputView: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});



