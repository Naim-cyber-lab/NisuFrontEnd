import { ListItem, Avatar } from 'react-native-elements';
import React, {useEffect, useState, useRef} from 'react';
import {View, ScrollView, Text, Button, StyleSheet, TextInput,TouchableWithoutFeedback, Image,Dimensions, Pressable,Modal,FlatList} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Swiper from 'react-native-swiper';
import styles from "./styles";
import { TapGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

import axios from 'axios';

import { NavigationContainer } from '@react-navigation/native';

// ***************** POUR REDUX ****************
import { useSelector } from "react-redux";

//************************************* */


const Stack = createStackNavigator();

const NavigatorAttente = () => {
    return(
        <NavigationContainer
            independent={true}
            screenOptions = {{
                headerShown: false,
            }}
            >
              <Stack.Navigator>
                <Stack.Screen name="AttenteWinker" component={AttenteWinker} options={{headerShown: false}} />
                <Stack.Screen name="ShowEvent" component={ShowEvent} options={{headerShown: false}} />
            </Stack.Navigator>
            {/* <Stack.Navigator>
                <Stack.Screen name="ChatsIndividual" component={ChatIndividual} />
    
            </Stack.Navigator> */}
        </NavigationContainer>
    )
    
    }
export default NavigatorAttente


const AttenteWinker = ({navigation}) => {

    // ***************** POUR LE REDUX ****************************
    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);

    //************************************************** */
    const [dataAttente , setDataAttente ] = useState([]);

    const [dataAccepteDemande, setDataAccepteDemande] = useState([])

    const [demandesEvent , setDemandesEvent ] = useState(false);

    const [attenteEvent , setAttenteEvent ] = useState(true);

    const [modalVisibleChangeMessage , setModalVisibleChangeMessage] = useState(false);

    const [newMessage , setNewMessage ] = useState("");

    const [currentItem , setCurrentItem] = useState({})

    const changeMessage = () => {
        axios.post(ipAdress + '/profil/changeMessageDemande/', {
                "newMessage" : newMessage,
                "idEvent" : currentItem.event.id,
                "idAttenteWinker" : currentItem.id,
               }, {
                headers: {
                  'Authorization': 'Token '+token
                }
            })
               .then(function (response) {
                    alert("c'est ok")
                    setModalVisibleChangeMessage(false)
                    
                   // ON DOIT REFAIRE LA RECHERCHE DES ATTENTES WINKER POUR QUE L'UTILISATEUR VOIT QUE SA MODIF DE MESSAGE A BIEN ETE FAITE
                   fetch(ipAdress+"/profil/getAttenteWinker/",{
                    method:"GET",
                    headers: {
                      'Authorization': 'Token '+token,
                    },
                    })
                    .then( (response) => response.json() )
                    .then( (responseJsonOffre) => {             
                        setDataAttente(responseJsonOffre.data)  
                    })
                    .catch(function(error) {
                      console.log('Profil/AttenteWinker.js ligne 100: ' + error.message);
                      console.log(error)
                      throw error;
                    });


                   
               })
               .catch(function (error) {
                 console.log(error);
               });
    }

    const annuleDemande = (EventId) => {
        axios.post(ipAdress + '/profil/annuleDemande/', {
            "EventId" : EventId,
           }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
           .then(function (response) {
                alert("c'est ok")
                setModalVisibleChangeMessage(false)
                
               // ON DOIT REFAIRE LA RECHERCHE DES ATTENTES WINKER POUR QUE L'UTILISATEUR VOIT QUE SA MODIF DE MESSAGE A BIEN ETE FAITE
               fetch(ipAdress+"/profil/getAttenteWinker/",{
                method:"GET",
                headers: {
                  'Authorization': 'Token '+token,
                },
                })
                .then( (response) => response.json() )
                .then( (responseJsonOffre) => {             
                    setDataAttente(responseJsonOffre.data)  
                })
                .catch(function(error) {
                  console.log('Profil/AttenteWinker.js ligne 133: ' + error.message);
                  console.log(error)
                  throw error;
                });


               
           })
           .catch(function (error) {
             console.log(error);
           });
    }

    const ShowModalChangeMessage = (item) => {
        setModalVisibleChangeMessage(!modalVisibleChangeMessage)
        setCurrentItem(item)
        
    }
    
    useEffect(() => {

        //****** POUR AVOIR LES DEMANDES EN ATTENTE *****************/
        fetch(ipAdress+"/profil/getAttenteWinker/",{
          method:"GET",
          headers: {
            'Authorization': 'Token '+token,
          },
          })
          .then( (response) => response.json() )
          .then( (responseJsonOffre) => {             
              setDataAttente(responseJsonOffre.data)  
          })
          .catch(function(error) {
            console.log('Profil/AttenteWinker.js ligne 171: ' + error.message);
            console.log(error)
            throw error;
          });


        //****** POUR ACCEPTER LES DEMANDES *****************/

        fetch(ipAdress+"/profil/getAccepteWinker/",{
            method:"GET",
            headers: {
              'Authorization': 'Token '+token,
            },
            })
            .then( (response) => response.json() )
            .then( (responseJsonOffre) => {             
                setDataAccepteDemande(responseJsonOffre.data)  
            })
            .catch(function(error) {
              console.log('Profil/AttenteWinker.js ligne 171: ' + error.message);
              console.log(error)
              throw error;
        });


     
    },[]);


    const renderDemandeAttente = ({item}) => {
        return (
            <View style={{margin : 7 ,display:"flex" , flexDirection:"column" }}>
                <View style={{ display:'flex',flexDirection:"row",borderWidth:1, borderColor:"black",height:100,width:"100%",backgroundColor:"rgb(125, 132, 132)"}}>
                    <View style={{flex:1}}>
                        <Text>Status : En attente</Text>
                    </View>
                    <View style={{flex:4 , borderWidth:0.5 }}>
                        <ScrollView>
                                <Text>{item.messageDemande}</Text>
                        </ScrollView>
                        
                        
                    </View>
                    <View style={{flex:1}}>
                        <Pressable onPress = {() => navigation.navigate("ShowEvent" , {"event" : item.event})}>
                            <Image
                                style={{width:"100%",height:"100%"}}
                                source={{
                                uri: 'http://192.168.43.24'+item.event.filesEvent[0]["image"],
                                }}
                            />
                        </Pressable>
                        
                    </View>
                
                </View>
                <View style={{display:'flex', flexDirection:'row'}}>
                    <Button style={{margin:5}} title="changer le message" onPress={() =>ShowModalChangeMessage(item)} />
                    <Button style={{margin:5}} title="annuler la demande" onPress={() =>annuleDemande(item.event.id)} />
                </View>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleChangeMessage}
                    onRequestClose={() => {
                    alert("Modal has been closed.");
                    }}
            >

                    <View style={{backgroundColor:"transparent",flex:1}}>
                        
                    <Pressable onPress={() => setModalVisibleChangeMessage(!modalVisibleChangeMessage)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></Pressable>

                        <ScrollView style={{backgroundColor:'green', flex:1,borderRadius:45, borderWidth : 4}}>
                            <Text style={{textAlign:"center",margin:5}}>Changer votre message</Text>
                            <TextInput
                                style={{height: 40,margin: 12,borderWidth: 1,padding: 10,}}
                                onChangeText={(text) => setNewMessage(text)}
                                // value={text}
                            />
                            <Pressable onPress={() => changeMessage()}>
                                <Text>Envoyer</Text>
                            </Pressable>
                            
                        </ScrollView>

                        <Pressable onPress={() => setModalVisibleChangeMessage(!modalVisibleChangeMessage) } style={{flex:1,opacity:0, backgroundColor:'transparent'}}></Pressable>

                        
                    </View>
            </Modal>
            </View>
            
        )
    }


    //*****************POUR ACCEPTER LES DEMANDES  *********************************/

    const AccepterDemande = (item) => {

        
        axios.post(ipAdress + '/profil/addParticipeWinker/', {
            idEvent: item.event.id,
            demandeWinkerId : item.demandeWinker.id
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {

                // ON DOIT REFAIRE LA RECHERCHE DES ATTENTES WINKER POUR QUE L'UTILISATEUR VOIT QUE SA MODIF DE MESSAGE A BIEN ETE FAITE
                fetch(ipAdress+"/profil/getAttenteWinker/",{
                    method:"GET",
                    headers: {
                        'Authorization': 'Token '+token,
                    },
                    })
                    .then( (response) => response.json() )
                    .then( (responseJsonOffre) => {             
                        setDataAttente(responseJsonOffre.data)  
                    })
                    .catch(function(error) {
                        console.log('Profil/AttenteWinker.js ligne 298: ' + error.message);
                        console.log(error)
                        throw error;
                    });

          })
          .catch(function (error) {
            console.log(error);
          });


    }

    const RefuserDemande = (item) => {
        alert("refuser demande")
    }



    const renderAccepteDemande = ({item}) => {
        return(
            <View style={{margin : 7 ,display:"flex" , flexDirection:"column" }}>
                <View style={{ display:'flex',flexDirection:"row",borderWidth:1, borderColor:"black",height:100,width:"100%",backgroundColor:"rgb(125, 132, 132)"}}>
                    <View style={{flex:1}}>
                        <Image
                            style={{width:"100%",height:"100%"}}
                            source={{
                            uri: item.demandeWinker.photoProfil,
                            }}
                        />
                    </View>
                    <View style={{flex:4 , borderWidth:0.5 }}>
                        <ScrollView>
                            <Text>{item.demandeWinker.username}</Text>
                            <Text>{item.demandeWinker.etude}</Text>
                            <Text>{item.demandeWinker.bio}</Text>
                                {/* <Text>{JSON.stringify(item.demandeWinker)}</Text> */}
                        </ScrollView>
                        
                        
                    </View>
                    <View style={{flex:1}}>
                        <Pressable onPress = {() => navigation.navigate("ShowEvent" , {"event" : item.event})}>
                            <Image
                                style={{width:"100%",height:"100%"}}
                                source={{
                                uri: 'http://192.168.43.24'+item.event.filesEvent[0]["image"],
                                }}
                            />
                        </Pressable>
                        
                    </View>
                
                </View>
                <View style={{display:'flex', flexDirection:'row',justifyContent:"space-evenly"}}>
                    <TouchableOpacity style={{padding:5,backgroundColor:"green"}} onPress={() =>AccepterDemande(item)}>
                        <Text style={{color:"white"}}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding:5,backgroundColor:"green"}} onPress={() =>RefuserDemande(item)}>
                        <Text style={{color:"white"}}>Refuser</Text>
                    </TouchableOpacity>
                </View>
   
            </View>
        )
    }


    //********************************************************************* */

    const showEvent = () => {
        setDemandesEvent(true)
        setAttenteEvent(false)
    }

    const showAttente = () => {
        setDemandesEvent(false)
        setAttenteEvent(true)
    }

    // ******************************* POUR LE VISIONNAGE DE SES EVENTS *********************************


    const [myEvents , setMyEvents] = useState(false);

    // **************************************************************************************************

    return(
        <View style={{backgroundColor:'rgb(25, 26, 26)',flex:1}}>
            {attenteEvent &&
            <>
                     <Text style={{color:"white",textAlign:"center"}}>Voici vos demandes en attente</Text>
                    <FlatList
                        style={{ backgroundColor: 'transparent' }}
                        inverted={true}
                        data={dataAttente}
                        renderItem={renderDemandeAttente}
                    />           
            </>

            }
                
            {demandesEvent &&
            <>
                <Text style={{color:"white",textAlign:"center"}}>Des winker veulent participer à vos events !</Text>
                <FlatList
                    style={{ backgroundColor: 'transparent' }}
                    inverted={true}
                    data={dataAccepteDemande}
                    renderItem={renderAccepteDemande}
                />      
            </>

             
            }
            
            <View style={{display:'flex', flexDirection:'row',justifyContent:"space-evenly",marginBottom:25}}>
                <Button style={{margin:5}} title="accepter demande" onPress={() =>showEvent()} />
                <Button style={{margin:5}} title="en attente" onPress={() =>showAttente()} />
            </View>     
        </View>
    )
           
}


const ShowEvent = ({route , navigation}) => {
    const { event } = route.params;
  
    return(
      <View style={{flex:1, backgroundColor:"green"}}>
        <Text>Nous montrons l'event  : {JSON.stringify(event)}</Text>
      </View>
    )
  }

