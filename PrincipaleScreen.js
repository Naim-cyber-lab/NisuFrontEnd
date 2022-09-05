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



const NavigatorChats = ({route}) => {
  return(
          <NavigationContainer
          independent={true}
          screenOptions = {{
              headerShown: false,
          }}
          >
            <Stack.Navigator>
              <Stack.Screen initialParams={{ item: route.params["item"]  , chatEventId : route.params["chatEventId"]}} name="ChatIndividual" component={ChatIndividual} options={{headerShown: false}}  />
              <Stack.Screen initialParams={{ item: route.params["item"] ,  chatEventId : route.params["chatEventId"] }} name="ShowEvent" component={ShowEvent} options={{headerShown: false}}  />
          </Stack.Navigator>
          {/* <Stack.Navigator>
              <Stack.Screen name="ChatsIndividual" component={ChatIndividual} />
  
          </Stack.Navigator> */}
      </NavigationContainer>
  )
  
  }
  
export default NavigatorChats


const RenderMessageComponent = ({navigation , item}) => {

  useEffect(() => {
console.log("voici l'item de RenderMessageComponent : ",item.item)
  },[])


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
   
   axios.post(ipAdress + '/profil/handleLikeMessageChatEventMessagesClass/', {
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

const ChatIndividual = ({route , navigation}) => {


//************************************************************************************************* */
//                                                                                                  //
//                                       NOTE SUR LA PAGE                                           //
//                                                                                                  //
//                                            //
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
  const ipAdressSocket = useSelector((state) => state.ipAdressSocket);
  
  const dispatch = useDispatch();
  //********************************************************************************************** */

const [data , setData] = useState(route.params["item"]) //correspond aux donnees du current user

const [meId , setMeId] = useState(currentUser.id)

const[eventId , setEventId] = useState(route.params["item"]["event"]["id"])


const [chatEventId , setChatEventId] = useState(route.params["chatEventId"])


const [messages , setMessages] = useState([])

const [listNewMessages , setListNewMessages] = useState([])


const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

//*********************************  RECUPERATION DES MESSAGES  *****************************************/


useEffect(() => {
 axios.post(ipAdress + '/profil/chatIndividualEvent/', {
     "getData" : 1,
     "getMessages" : 0,
     "addMessage" : 0,
     "chatEventId":chatEventId,
    }, {
     headers: {
       'Authorization': 'Token '+token,
     }})
    .then(function (response) {
     console.log("j'essaye de get les datas")
     setMessages(response.data.data)

     //**********ON RENINITALISE MTN LE SEEN DU WinkersChat ******************/

     alert("il reste du taff à faire par rapport à l'ordre des msg à la ligne 359")

    //  fetch(ipAdress+'/profil/getWinkersChat/',{
    //    method:"GET",
    //    headers: {
    //      'Authorization': 'Token '+token,
    //    },
    //  })
    //    .then( (response) => response.json() )
    //    .then( (response) => {
           
    //      dispatch(setWinkersChat(response.data))
         
    //    })
    //    .catch(function(error) {
    //      console.log('There has been a problem with your fetch operation: ' + error.message);
    //       alert(error)
    //        throw error;
    //    });
    
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


const sendAudioWebSocket = async (ChatEventMessageClassId) => {

 console.log("je suis dans sendAudioWebSocket : ",ChatEventMessageClassId)


   // 👇️ from CURRENT DATE
   const now = new Date();
   const currentTime = now.getHours() + ':' + now.getMinutes();
   console.log(currentTime); // 👉️ 13:27

   ws.current.send(JSON.stringify({
     "ChatEventMessageClassId" : ChatEventMessageClassId,
     "currentTime":currentTime,
     "chatEventId":chatEventId,
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
   formData.append("eventId",eventId)
   
   formData.append("chatEventId",chatEventId)
   formData.append("getData",0)

   fetch(ipAdress+"/profil/chatIndividualEvent/", {
     method: 'POST',
     body: formData,
     headers: {
       'Authorization': 'token '+token,
       'content-type': 'multipart/form-data',
     },
   })
     .then( (response) => response.json() )
     .then( (responseJson) => {
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


 ws.current.send(JSON.stringify({
   "inputMessage":String(inputMessage),
   "currentTime":currentTime,
   "chatEventId":chatEventId,
   "meId":meId,
   "isAudio":false,
   "isMessage":true,
 }))
}

useEffect(() => {
   ws.current = new WebSocket('ws://'+String(ipAdressSocket)+'/profil/chatEvent/'+String(chatEventId)+'/');
   //ws.current = new WebSocket('ws://192.168.43.24/profil/chatEvent/'+String(chatEventId)+'/');
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
       <Text style={{color:"black",fontSize:20}}>{route.params["item"]["event"]["titre"]}</Text>
     </TouchableOpacity>

     {showDraggable &&
       <View style={{top:0,height:400, backgroundColor:"red",alignItems:"center",justifyContent:"center",opacity:0.5}}>
         <Entypo name={'trash'} size={65} style={{color:'white'}}  />
       </View>
     }

{/* <Text>hhhhhh : {JSON.stringify(listNewMessages.concat(messages))}</Text> */}
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



