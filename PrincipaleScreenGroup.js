import React, {useEffect, useState, useRef, useCallback, Component} from 'react';

import {StyleSheet,Text,Modal,View,Image,TextInput,TouchableOpacity,TouchableWithoutFeedback,Keyboard,ScrollView,FlatList,Dimensions,Alert,Pressable,Animated,PanResponder,Easing,Button,RefreshControl} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';


import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';

import ElementAudio from "../ChatIndividualVrai/ElementAudio"

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

  alert("il faut gerer le live")
   
//    axios.post(ipAdress + '/profil/handleLikeMessageChatEventMessagesClass/', {
//      idMessage: item.item._id,
//    }, {
//      headers: {
//        'Authorization': 'Token '+token
//      }
//  })
//    .then(function (response) {
//       setIsLikeMessage(response.data.isLike)
//    })
//    .catch(function (error) {
//      console.log(error);
//    });

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
             item.item.sender._id === currentUser
                 ? 'blue'
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


const ChatIndividualGroup = ({route, navigation}) =>{

  const { groupPriveId , item} = route.params;
    //***************************************POUR LE REDUX ***********************************************/
  
    const ipAdress = useSelector((state) => state.ipAdress);
    const currentUser = useSelector((state) => state.currentUser);
    const winkersChat = useSelector((state) => state.winkersChat);
    const winkersChatWithoutGroup = useSelector((state) => state.winkersChatWithoutGroup);
    const token = useSelector((state) => state.token);
    const ipAdressSocket = useSelector((state) => state.ipAdressSocket);
    const dispatch = useDispatch();
    //********************************************************************************************** */
  
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
      axios.post(ipAdress + '/profil/chatIndividualEventGroup/', {
          "getData" : 1,
          "getMessages" : 0,
          "addMessage" : 0,
          "groupPriveId" : groupPriveId,
        }, {
          headers: {
            'Authorization': 'Token '+token,
          }})
         .then(function (response) {
          setMessages(response.data.data)
          setTitreGroupe(response.data.titreGroupe)
          setListIdWinkerGroup(response.data.listIdWinkerGroup)
  
          //**********ON RENINITALISE MTN LE SEEN DU WinkersChat ******************/
  
            alert("on doit faire sur l'ordre des msg")
         
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
          "groupPriveId":groupPriveId,
          "meId":meId,
          "isAudio":false,
          "isMessage":true,
        }))
      }
    
      useEffect(() => {
        console.log("voici l'groupPriveId : ",groupPriveId)
          ws.current = new WebSocket('ws://'+String(ipAdressSocket)+'/profil/chatEventGroup/'+String(groupPriveId)+'/');
          // ws.current = new WebSocket('ws://192.168.43.24/profil/chatEventGroup/'+String(groupPriveId)+'/');
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
    
                }
                else{
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
    
                }
                else{
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
      
    
      const sendAudioWebSocket = async (ChatEventMessageClassId) => {
    
        console.log("je suis dans sendAudioWebSocket : ",ChatEventMessageClassId)
    
    
          // 👇️ from CURRENT DATE
          const now = new Date();
          const currentTime = now.getHours() + ':' + now.getMinutes();
          console.log(currentTime); // 👉️ 13:27
    
          ws.current.send(JSON.stringify({
            "ChatEventMessageClassId" : ChatEventMessageClassId,
            "currentTime":currentTime,
            "groupPriveId":groupPriveId,
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
          
          formData.append("groupPriveId",groupPriveId)
          formData.append("getData",0)
    
          fetch(ipAdress+"/profil/chatIndividualEventGroup/", {
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
                groupPriveId: groupPriveId,
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
                groupPriveId: groupPriveId,
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
        groupPriveId : groupPriveId,
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
            <Text style={{color:"black",fontSize:18}}>{item.groupPrive.event.titre}</Text>
            
            {/* <TouchableOpacity style={{padding:10}} onPress={() => onModalDetailsGroup()}>
              <Feather name={'more-horizontal'} size={40} style={{color:'black'}} />
            </TouchableOpacity> */}
            
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
  
  
export default ChatIndividualGroup;