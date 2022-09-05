// // // ********************************** TRAVAIL SUR LE DRAG AND DROP ET AUDIO ****************************

// import React,{ Component, useState,useEffect } from 'react';
// import { StyleSheet,View,Text,PanResponder,Animated,Easing,Dimensions,Button } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { Audio } from 'expo-av';
// import * as Sharing from 'expo-sharing';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import axios from 'axios';


// const  ViewportFunction = () => {
//   const [showDraggable , setShowDraggable] = useState(true);
//   const [dropZoneValues , setDropZoneValues] = useState(null);
//   const [pan , setPan] = useState(new Animated.ValueXY());
//   const [recording, setRecording] = React.useState();
//   const [recordings, setRecordings] = React.useState([]);
//   const [message, setMessage] = React.useState("");

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder    : () => true,
//     onPanResponderMove:  Animated.event(
//       [
//         null,
//         { dx: pan.x, dy: pan.y }
//       ],
//       {useNativeDriver: false}
//     ),
//     onPanResponderGrant: (event, gesture) => {
//       startRecording();
//     },
//     onPanResponderRelease : (e, gesture) => {
//         if(isDropZone(gesture)){
//           setRecording(null)
//           setShowDraggable(false)
     
//         }else{
//           console.log("you pressed out in a good area")
//           stopRecording();
//             Animated.spring(
//                 pan,
//                 {toValue:{x:0,y:0}},
//                 {useNativeDriver: false}
//             ).start();
//         }
//     }
//   });

//   const isDropZone = (gesture) => {
//     var dz = dropZoneValues;
//     return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;//Dans le cas ou dz.y < gesture.moveY < dz.y + dz.height
//   }

//   async function startRecording() {
    
//     try {
//       const permission = await Audio.requestPermissionsAsync();

//       if (permission.status === "granted") {
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: true,
//           playsInSilentModeIOS: true
//         });
        
//         const { recording } = await Audio.Recording.createAsync(
//           Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//         );

//         setRecording(recording);
//       } else {
//         setMessage("Please grant permission to app to access microphone");
//       }
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   }

//   async function stopRecording() {
//     setRecording(undefined);
//     await recording.stopAndUnloadAsync();

//     let updatedRecordings = [...recordings];
//     const { sound, status } = await recording.createNewLoadedSoundAsync();
//     updatedRecordings.push({
//       sound: sound,
//       duration: getDurationFormatted(status.durationMillis),
//       file: recording.getURI()
//     });

//     setRecordings(updatedRecordings);
//   }

//   function getDurationFormatted(millis) {
//     const minutes = millis / 1000 / 60;
//     const minutesDisplay = Math.floor(minutes);
//     const seconds = Math.round((minutes - minutesDisplay) * 60);
//     const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
//     return `${minutesDisplay}:${secondsDisplay}`;
//   }

//   const getMimeType = (ext) => {
//     // mime type mapping for few of the sample file types
//     switch (ext) {
//       case 'pdf': return 'application/pdf';
//       case 'jpg': return 'image/jpeg';
//       case 'jpeg': return 'image/jpeg';
//       case 'png': return 'image/png';
//     }
//   }

//   const uploadAudio = async (fileAudio) => {
//     console.log('good place')
//     if(fileAudio){
//       console.log(fileAudio)
//       const fileUri = fileAudio;
//       let filename = fileUri.split('/').pop();
 
//       const extArr = /\.(\w+)$/.exec(filename);
//       //const type = getMimeType(extArr[1]);
//       const type = "audio/mp4"
 
//       let formData = new FormData();
 
//       formData.append('filetoupload', { uri: fileUri, name: filename, type });

 
 
//       const response = await fetch("http://192.168.43.24:80/profil/uploadAudio/", {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Authorization': 'token d0a2941df45c3074c5e45890e8ebd31894bc5f86',
//           'content-type': 'multipart/form-data',
//         },
//       });
//       //startUploading(false);
//       const responseAgain = await response.text();
//       console.log(responseAgain);
//       console.log("juste avant le return")
//       return response;
//     }
// };

//   function getRecordingLines() {
//     return recordings.map((recordingLine, index) => {
//       return (
//         <View key={index} style={styles.row}>
//           <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
//           <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()  } title="Play"></Button>
//           <Button style={styles.button} onPress={() => uploadAudio(recordingLine.file)} title="upload audio" />
//           <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
//         </View>
//       );
//     });
//   }

//   return(
//     <View style={{flex:1,backgroundColor:"green"}}>
//       <View 
//         onLayout={(event) => {
//           setDropZoneValues(event.nativeEvent.layout)
//         }}
//         style={{ height  : 300,backgroundColor:'#2c3e50'}}>
//       </View>
      
//        <Text>{message}</Text>
//        {/* <Button
//          title={recording ? 'Stop Recording' : 'Start Recording'}
//          onPress={recording ? stopRecording : startRecording} /> */}
//        {getRecordingLines()}
//        <StatusBar style="auto" />
     
//       <View style={{ position :'absolute',bottom:30,left: Window.width-CIRCLE_RADIUS * 2,backgroundColor:"red",width :CIRCLE_RADIUS*2,height : CIRCLE_RADIUS*2,borderRadius : CIRCLE_RADIUS}}>
     
//         <Animated.View       
//           {...panResponder.panHandlers}
//           onPressIn = {() => console.log("you pressed in")}
//           style={[pan.getLayout(), {backgroundColor : '#1abc9c',width :CIRCLE_RADIUS*2,height : CIRCLE_RADIUS*2,borderRadius : CIRCLE_RADIUS}]}
//         >
         
//         </Animated.View>
        
//       </View>
//     </View>
//   )
// }

// export default ViewportFunction;

// let CIRCLE_RADIUS = 36;
// let Window = Dimensions.get('window');
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fill: {
//     flex: 1,
//     margin: 16
//   },
//   button: {
//     margin: 16
//   }
// });



//****************************************************************************************************** */
//                                                                                                        //
//                                 AUTOCOMPLETE LOCALISATION                                             //
//                                                                                                        //
//******************************************************************************************************* */


// import * as React from 'react';
// import { View, StyleSheet, TextInput } from 'react-native';
// import Constants from 'expo-constants';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// const GOOGLE_PLACES_API_KEY = 'AIzaSyClHOjVYDlalS2gI7chcxUo_6tOEPg0kYk'; // never save your real api key in a snack!

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <GooglePlacesAutocomplete
//         placeholder="Search"
//         query={{
//           key: GOOGLE_PLACES_API_KEY,
//           language: 'en', // language of the results
//         }}
//         onPress={(data, details = null) => console.log(data)}
//         onFail={(error) => console.error(error)}
//         requestUrl={{
//           url:
//             'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
//           useOnPlatform: 'web',
//         }} // this in only required for use on the web. See https://git.io/JflFv more for details.
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     paddingTop: Constants.statusBarHeight + 10,
//     backgroundColor: '#ecf0f1',
//   },
// });



//****************************************************************************************************** */
//                                                                                                        //
//                                 VRAIE PAGE DE LOCALISATION                                             //
//                                                                                                        //
//******************************************************************************************************* */

// import React, { useState, useEffect } from 'react';
// import {StyleSheet,Text,View,TextInput,Image,Dimensions,TouchableOpacity,TouchableWithoutFeedback,Keyboard,} from 'react-native';

// import axios from 'axios';

// import * as Permissions from 'expo-permissions';
// import * as Location from 'expo-location';
// import { Button } from 'react-native-elements';

// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
// import MapView, { Callout, Circle, Marker } from "react-native-maps"





// export default function LocacalisationFunction({navigation}) {

//   const [userLocation , setUserLocation] = useState({});
//   const [adressUser , setAdressUser] = useState({});



//   const _getLocation = async () => {

//     const { status } = await Location.requestForegroundPermissionsAsync();

//     if(status !== 'granted'){
//       console.log('permission not granted')
//       alert('permission not granted')
//     }

//     var _userLocation = await Location.getCurrentPositionAsync();
//     setTimeout(() => {  setUserLocation(_userLocation); }, 2000);
    
//     console.log("here is the userLocation ",userLocation)

//   }

//   const _getAdress = async () => {
//     //Je pense qu'on a juste besoin de mettre la meme adresse
//     const userAdress = await Location.reverseGeocodeAsync(userLocation.coords)
//     setAdressUser(userAdress)
//   }


//   //*************************************POUR LA CARTE ****************************/

// 	const [ pin, setPin ] = React.useState({
// 		latitude: 0,
// 		longitude: 0,
// 	})
// 	const [ region, setRegion ] = React.useState({
// 		latitude: 0,
// 		longitude: 0,
// 		latitudeDelta: 0.0922,
// 		longitudeDelta: 0.0421
// 	})

//   //******************************************************* */

//   useEffect(() => {
//     _getLocation();
//     setPin({
//       latitude: 10,
//       longitude: 10,
//     })
//     setRegion({
//       latitude: 10,
//       longitude: 10,
//       latitudeDelta: 0.0922,
// 		 longitudeDelta: 0.0421
//     })
//   },[]);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "#fff",
//       alignItems: "center",
//       justifyContent: "center"
//     },
//     map: {
//       width: Dimensions.get("window").width,
//       height: Dimensions.get("window").height ,
//     }
//   })


//   return(
//     <View style={{flex:1, backgroundColor:"green"}}>
//       <Text style={{marginTop : 50}}>Localisation : {JSON.stringify(userLocation)}</Text>
//       <Button title="gercity" onPress={() => _getAdress()} />
//       <Text style={{marginTop : 50}}>Adress : {JSON.stringify(adressUser)}</Text>



//       {/* POUR LA CARTE */}
//       <GooglePlacesAutocomplete
// 				placeholder="Search"
// 				fetchDetails={true}
// 				GooglePlacesSearchQuery={{
// 					rankby: "distance"
// 				}}
// 				onPress={(data, details = null) => {
// 					// 'details' is provided when fetchDetails = true
// 					console.log(data, details)
// 					setRegion({
// 						latitude: details.geometry.location.lat,
// 						longitude: details.geometry.location.lng,
// 						latitudeDelta: 0.0922,
// 						longitudeDelta: 0.0421
// 					})
// 				}}
// 				query={{
// 					key: "AIzaSyClHOjVYDlalS2gI7chcxUo_6tOEPg0kYk",
// 					language: "en",
// 					components: "country:us",
// 					types: "establishment",
// 					radius: 30000,
// 					location: `${region.latitude}, ${region.longitude}`
// 				}}
// 				styles={{
// 					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
// 					listView: { backgroundColor: "white" }
// 				}}
// 			/>
// 			<MapView
// 				style={styles.map}
// 				initialRegion={{
// 					latitude: pin.latitude,
// 					longitude: pin.longitude,
// 					latitudeDelta: 0.0922,
// 					longitudeDelta: 0.0421
// 				}}
// 				provider="google"
// 			>
// 				<Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
// 				<Marker
// 					coordinate={pin}
// 					pinColor="black"
// 					draggable={true}
// 					onDragStart={(e) => {
// 						console.log("Drag start", e.nativeEvent.coordinates)
// 					}}
// 					onDragEnd={(e) => {
// 						setPin({
// 							latitude: e.nativeEvent.coordinate.latitude,
// 							longitude: e.nativeEvent.coordinate.longitude
// 						})
// 					}}
// 				>
// 					<Callout>
// 						<Text>I'm here</Text>
// 					</Callout>
// 				</Marker>
// 				<Circle center={pin} radius={1000} />
// 			</MapView>
//     </View>
//   )
// }


//**************************************************************************************************** */
//                                                                                                     //
//                                       DRAG AND DROP                                                 //
//                                                                                                     //
//**************************************************************************************************** */


// import React, { Component, useState } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { Button } from "react-native-elements";

// import SortableGrid from "react-native-sortable-grid";

// const exampleGrid = () => {
//   const [alphabets , setAlphabets] = useState(["A","B","C","D","E","F","G","H","I"])
//   const [newList , setNewList] = useState(alphabets)
//   const [isInDrag , setIsInDrag] = useState(false)

//   const getColor = () => {
//     let r = randomRGB();
//     let g = randomRGB();
//     let b = randomRGB();
//     return "rgb(" + r + ", " + g + ", " + b + ")";
//   }

//   const randomRGB = () => 160 + Math.random() * 85;

//   const mapRender = () => {

//     return alphabets.map((letter, index) => {
//         return (
//           <View
//           key={index}
//           style={[styles.block, { backgroundColor: getColor() }]}
//         >
//           <Text style={{ color: "white", fontSize: 50 }}>{letter}</Text>
//         </View>
//         )
//     })
//   }

//   return(

//   <View style={{flex:1,marginTop:39}}>
//         <Button title="console log la nouvelle liste" onPress={() => console.log(newList)} />
//         <SortableGrid
//         blockTransitionDuration={400}
//         activeBlockCenteringDuration={200}
//         itemsPerRow={3}
//         dragActivationTreshold={200}
//         onDragRelease={(itemOrder) => {
//           setNewList(itemOrder);
//           setIsInDrag(false);
//           console.log(
//             "Drag was released, the blocks are in the following order: ",
//             itemOrder
//           )
//         }

//         }
//         onDragStart={(item) => {
//           setIsInDrag(true)
//           console.log("voici l'itemmmm : ",item)
//           console.log("Some block is being dragged now!")
//         } }
//       >

  
//         {mapRender()}
//       </SortableGrid>
//       {isInDrag &&
//         <View style={{backgroundColor:"red", width:"100%", height:150, position:"absolute", bottom:0}}>
//         </View>
//       }
//   </View>

//   )
// }

// export default exampleGrid;


// const styles = StyleSheet.create({
//   block: {
//     flex: 1,
//     margin: 8,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center"
//   }
// });


//*************************************************************************************************************** */
//                                                                                                                //
//                                              VRAIE PAGE DE LOGIN                                               //
//
//****************************************************************************************************************** */
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { setFirstPhotoLocalisation, setToken } from "./store";
import { setIsLoggedIn } from "./store";
import { setCurrentUser } from "./store";
 

import React, { useState } from 'react';
import {StyleSheet,Text,View,TextInput,Image,Dimensions,TouchableOpacity,TouchableWithoutFeedback,Keyboard,} from 'react-native';

import axios from 'axios';


import { Icon } from 'react-native-elements';

export default function LoginScreen1({navigation}) {

  //***************TRAITREMENT DE REDUX ******************** */

  const dispatch = useDispatch();
  
  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);
  const msg = useSelector((state) => state.msg);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

//************************************************************* */

  const [invalidCredentials , setInvalidCredentials] = useState(false);
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");

  const handleLogin = () => {
  

    axios.post(`${ipAdress}/profil/login`, {
      username: email,
      password: password,
    })
    .then(function (response) {
     
      dispatch(setToken(response.data.token))
      dispatch(setIsLoggedIn())
     
      // Maintenant on a recupere le token, on enregistre le user dans le currentUser du store
      // *********** recuperer le currentUser dans le store ********************//

    fetch(`${ipAdress}/profil/getDataWinker/`,{
      method:"GET",
      headers : {
        'Authorization': `Token ${response.data.token}`
      }
      })
      .then( (response) => response.json() )
      .then( (response) => {
        dispatch(setCurrentUser(response.data))
        dispatch(setFirstPhotoLocalisation(response.setFirstPhotoLocalisation))
      })
      .catch(function(error) {
        throw error;
      });




    })

    .catch(function (error) {
      setInvalidCredentials(true)
      console.log(error);
    });
  


  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.bigCircle}></View>
        <View style={styles.smallCircle}></View>
        <View style={styles.centerizedView}>
          <View style={styles.authBox}>
            <View style={styles.logoBox}>
              <Icon
                color='#fff'
                name='comments'
                type='font-awesome'
                size={50}
              />
            </View>
            <Text style={styles.loginTitleText}>Login</Text>
            {invalidCredentials &&
            <Text style={{color:"red"}}>Votre mail ou votre mot de passe n'est pas bon !</Text>
            }
            
            <View style={styles.hr}></View>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText = {(text) => setEmail(text)}
                keyboardType='email-address'
                textContentType='emailAddress'
              />
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                onChangeText = {(text) => setPassword(text)}
                textContentType='password'
              />
            </View>
            <TouchableOpacity onPress = {() => handleLogin()} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                S'inscrire ?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bigCircle: {
    width: Dimensions.get('window').height * 0.7,
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: '#ff6b81',
    borderRadius: 1000,
    position: 'absolute',
    right: Dimensions.get('window').width * 0.25,
    top: -50,
  },
  smallCircle: {
    width: Dimensions.get('window').height * 0.4,
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: '#ff7979',
    borderRadius: 1000,
    position: 'absolute',
    bottom: Dimensions.get('window').width * -0.2,
    right: Dimensions.get('window').width * -0.3,
  },
  centerizedView: {
    width: '100%',
    top: '15%',
  },
  authBox: {
    width: '80%',
    backgroundColor: '#fafafa',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: '#eb4d4b',
    borderRadius: 1000,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
    marginBottom: -50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginTitleText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  hr: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#444',
    marginTop: 6,
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#dfe4ea',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#ff4757',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});


//*************************************************************************************************************** */
//                                                                                                                //
//                                              POUR LES FICHIERS                                                 //
//                                                                                                                //
//****************************************************************************************************************** */



// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Platform, Text } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';

// export default function DocumentPickerExample() {
//   const [file, setFile] = useState(null);
//   const [image, setImage] = useState(null);
//   const [uploading, startUploading] = useState(false);
//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== 'web') {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//           alert('Sorry, we need camera roll permissions to make this work!');
//         }
//       }
//     })();
//   }, []);
//   const getMimeType = (ext) => {
//     // mime type mapping for few of the sample file types
//     switch (ext) {
//       case 'pdf': return 'application/pdf';
//       case 'jpg': return 'image/jpeg';
//       case 'jpeg': return 'image/jpeg';
//       case 'png': return 'image/png';
//     }
//   }
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
 
//     console.log(result);
 
//     if (!result.cancelled) {
//       setImage(result.uri);
//     }
//   };
//   const pickFile = async () => {
//     let result = await DocumentPicker.getDocumentAsync({
//       type: '*/*'
//     });
 
//     console.log(result);
 
//     if (!result.cancelled) {
//       setFile(result.uri);
//     }
//   };
//   const uploadFile = async () => {
//     if(file||image){
//       const fileUri = file ? file : image;
//       let filename = fileUri.split('/').pop();
 
//       const extArr = /\.(\w+)$/.exec(filename);
//       const type = getMimeType(extArr[1]);
//       setImage(null);
//       setFile(null);
//       startUploading(true);
 
//       let formData = new FormData();
 
//       formData.append('filetoupload', { uri: fileUri, name: filename, type });
 
//       const response = await fetch("http://192.168.43.24:80/profil/upload/", {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Authorization': 'token d0a2941df45c3074c5e45890e8ebd31894bc5f86',
//           'content-type': 'multipart/form-data',
//         },
//       });
//       startUploading(false);
//       const responseAgain = await response.text();
//       console.log(responseAgain);
//       return response;
//     }
// };
 
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button title="Pick a Photo from mobile" onPress={pickImage} />
//       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//       <View style={{ height: 50 }}/>
//       <Button title="Pick a file from mobile" onPress={pickFile} />
//       <View style={{ height: 50 }}/>
//       { uploading ? <Text>Uploading</Text> :
//       <Button title="Upload" onPress={uploadFile} /> }
//     </View>
//   );
// }




//*************************************************************************************************************** */
//                                                                                                                //
//                                              POUR ECOUTER UN AUDIO                                             //
//                                                                                                                //
//****************************************************************************************************************** */


// import * as React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
// import { Audio } from 'expo-av';

// export default function App() {
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log('Loading Sound');
//     const { sound } = await Audio.Sound.createAsync(
//         { uri: 'http://192.168.43.24/media/audio/recording-d2ebb342-ba69-47b5-af5d-5e622583c8dc.m4a' }
//     );
//     setSound(sound);

//     console.log('Playing Sound');
//     await sound.playAsync(); }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log('Unloading Sound');
//           sound.unloadAsync(); }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.container}>
//       <Button title="Play Sound" onPress={playSound} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 10,
//   },
// });






//*************************************************************************************************************** */
//                                                                                                                //
//                                              POUR LES MODALIZE                                             //
//                                                                                                                //
//****************************************************************************************************************** */



// import React, { useRef } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Modalize } from 'react-native-modalize';

// const App = () => {
//   const modalizeRef = useRef(null);

//   const onOpen = () => {
//     modalizeRef.current?.open();
//   };


//   const renderItem = (item) => (
//     <View>
//       <Text style={{color:"red"}}>{JSON.stringify(item.item.heading)}</Text>
//     </View>
//   );

//   return (
//     <>
//       <TouchableOpacity onPress={onOpen}>
//         <Text style={{color:"blue",marginTop:200}}>Open the modal</Text>
//       </TouchableOpacity>

//       <Modalize
//         ref={modalizeRef}
//         modalHeight={400}
//         flatListProps={{
//           data: [{heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},
//           {heading : "voici le heading"},

//         ],
//           renderItem: renderItem,
  
//           keyExtractor: item => item.heading,
//           showsVerticalScrollIndicator: false,
//         }}
//       />
//     </>
//   );
// }

// export default App;


//********************************************************************************************************* */
//                                                                                                          //
//                                      CHAT AVEC WEBSOCKET                                                 //
//                                                                                                          //
//********************************************************************************************************* */

// import React, { Component, useState, useEffect, useRef} from 'react';
// import { AppRegistry, View, Text, Button } from 'react-native';
// import WS from 'react-native-websocket';
// import { w3cwebsocket as W3CWebSocket } from "websocket";


// export default function AppWs() {
//   const [isPaused, setPause] = useState(false);
//   const ws = useRef(null);

//   useEffect(() => {
//       ws.current = new WebSocket('ws://192.168.43.24/profil/chatWinker/7/');
//       ws.current.onopen = () => console.log("ws opened");
//       ws.current.onclose = () => console.log("ws closed");

//       const wsCurrent = ws.current;

//       return () => {
//           wsCurrent.close();
//       };
//   }, []);

//   useEffect(() => {
//       if (!ws.current) return;

//       ws.current.onmessage = e => {
//           if (isPaused) return;
//           const message = JSON.parse(e.data);
//           console.log("e", message);
//       };
//   }, [isPaused]);

//   return (
//       <View>
//           <Button title="rr" onPress={() => setPause(!isPaused)} />
//           <Text>{isPaused ? "Resume" : "Pause"}</Text>
//           <Button title="title of my button" onPress={() => ws.current.send(JSON.stringify({"message":"here is the msg"}))} />

//       </View>
//   );
// }



//************************************* POUR LE CERCLE ANINME DES VOCAUX **********************************/

// import React, { useEffect } from 'react';
// import { useCallback } from 'react';
// import { Dimensions, TouchableOpacity } from 'react-native';
// import { StyleSheet, Text, View } from 'react-native';
// import Animated, {
//   useSharedValue,
//   withTiming,
//   useAnimatedProps,
// } from 'react-native-reanimated';
// import { useDerivedValue } from 'react-native-reanimated';
// import { ReText } from 'react-native-redash';

// import Svg, { Circle } from 'react-native-svg';

// const BACKGROUND_COLOR = '#444B6F';
// const BACKGROUND_STROKE_COLOR = '#303858';
// const STROKE_COLOR = '#A6E1FA';

// const { width, height } = Dimensions.get('window');

// const CIRCLE_LENGTH = 300; // 2PI*R
// const R = CIRCLE_LENGTH / (2 * Math.PI);

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// export default function App() {
//   const progress = useSharedValue(0);

//   const animatedProps = useAnimatedProps(() => ({
//     strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
//   }));

//   const progressText = useDerivedValue(() => {
//     return `${Math.floor(progress.value * 100)}`;
//   });

//   const onPress = useCallback(() => {
//     progress.value = withTiming(progress.value > 0 ? 0 : 1, { duration: 7000 });
//   }, []);

//   return (
//     <View style={styles.container}>
//       <ReText style={{fontSize: 40,color: 'rgba(256,256,256,0.7)',width: 100,textAlign: 'center',}} text={progressText} />
//       <Svg style={{ position: 'absolute' }}>
//         <Circle
//           cx={200}
//           cy={200}
//           r={R}
//           stroke={BACKGROUND_STROKE_COLOR}
//           strokeWidth={3}
//         />
//         <AnimatedCircle
//           cx={200}
//           cy={200}
//           r={R}
//           stroke={STROKE_COLOR}
//           strokeWidth={1.5}
//           strokeDasharray={CIRCLE_LENGTH}
//           animatedProps={animatedProps}
//           strokeLinecap={'round'}
//         />
//       </Svg>
//       <TouchableOpacity onPress={onPress} style={styles.button}>
//         <Text style={styles.buttonText}>Play Audio</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: BACKGROUND_COLOR,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   progressText: {
//     fontSize: 80,
//     color: 'rgba(256,256,256,0.7)',
//     width: 100,
//     textAlign: 'center',
//   },
//   button: {
//     position: 'absolute',
//     bottom: 40,
//     width: width * 0.7,
//     height: 60,
//     backgroundColor: BACKGROUND_STROKE_COLOR,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     fontSize: 25,
//     color: 'white',
//     letterSpacing: 2.0,
//   },
// });

//*********************************** *************************************************//
//                                                                                     //
//                          POUR LE PULL TO REFRESH                                    //
//                                                                                     // 
//************************************************************************************ */


// import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
// import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

// const wait = (timeout) => {
//   return new Promise(resolve => setTimeout(resolve, timeout));
// }

// const App = () => {
//   const [refreshing, setRefreshing] = React.useState(false);

//   const [changeWhenRefresh, setChangeWhenRefresh] = useState(true)

//   useEffect(() =>{
//     console.log("je suis dans le useEffect")
//   }, [])

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
  
//       setChangeWhenRefresh(!changeWhenRefresh)
//       setRefreshing(false)
    
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollView}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//       >
//         <Text>Pull down to see RefreshControl indicator</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: 'pink',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default App;



//******************************************************************************************* */
//                                                                                            */
//                      LOCALISATION AVEC CARTE                                               */
//                                                                                            */
//******************************************************************************************** */
// import * as React from "react"
// import { Dimensions, StyleSheet, Text, View } from "react-native"
// import { Button } from "react-native-elements"
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
// import MapView, { Callout, Circle, Marker } from "react-native-maps";
// import * as Location from 'expo-location';

// export default function App() {
// 	const [ pin, setPin ] = React.useState({
// 		latitude: 37.78825,
// 		longitude: -122.4324
// 	})

// 	const [ region, setRegion ] = React.useState({
//     latitude: 48.8566,
//     longitude: 2.3514,
// 		latitudeDelta: 0.0922,
// 		longitudeDelta: 0.0421
// 	})

//   const [adressUser, setAdressUser] = React.useState({})

//     const _getAdress = async () => {
//     //Je pense qu'on a juste besoin de mettre la meme adresse
//     const userAdress = await Location.reverseGeocodeAsync({"longitude" : region.longitude, "latitude":region.latitude})
//     setAdressUser(userAdress)

//     console.log(adressUser)
//   }

// 	return (
// 		<View style={{ marginTop: 50, flex: 1 }}>
// 			<GooglePlacesAutocomplete
// 				placeholder="Search"
// 				fetchDetails={true}
// 				GooglePlacesSearchQuery={{
// 					rankby: "distance"
// 				}}
//         GooglePlacesDetailsQuery={{
//           rankby: "distance",
//           fields: 'geometry',
//         }}
// 				onPress={(data, details = null) => {
// 					// 'details' is provided when fetchDetails = true
// 					console.log("******************kkkkkkkkkkkk******************************************************")
//           console.log(details.geometry)
//           console.log("*******************lllllllllllll*****************************************************")
// 					setRegion({
// 						latitude: details.geometry.location.lat,
// 						longitude: details.geometry.location.lng,
// 						latitudeDelta: 0.0922,
// 						longitudeDelta: 0.0421
// 					})
// 				}}
// 				query={{
// 					key: "AIzaSyDRdQ8vpw3HaX_GMhF_1QeJ5Gvb5n56coI",
// 					language: "fr",
// 					components: "country:fr",
// 					types: "(cities)",
// 					radius: 30000,
// 					location: `${region.latitude}, ${region.longitude}`
// 				}}
// 				styles={{
// 					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1,backgroundColor:"black" },
// 					listView: { backgroundColor: "red" }
// 				}}
// 			/>
// 			<MapView
// 				style={styles.map}
// 				initialRegion={{
// 					latitude: region.latitude,
// 					longitude: region.longitude,
// 					latitudeDelta: 0.0922,
// 					longitudeDelta: 0.0421
// 				}}
// 				provider="google"
// 			>
        
// 				<Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
// 				<Marker
// 					coordinate={pin}
// 					pinColor="black"
// 					draggable={true}
// 					onDragStart={(e) => {
// 						console.log("Drag start", e.nativeEvent.coordinates)
// 					}}
// 					onDragEnd={(e) => {
// 						setPin({
// 							latitude: e.nativeEvent.coordinate.latitude,
// 							longitude: e.nativeEvent.coordinate.longitude
// 						})
// 					}}
// 				>
// 					<Callout>
// 						<Text style={{color:"red",fontSize:30}}>I'm here</Text>

// 					</Callout>
// 				</Marker>
    
// 			</MapView>
//       <Circle
//           center={
//             {longitude:region.longitude,
//             latitude:region.latitude}
//           }
//           radius={60}
//           strokeColor="blue"

//           />
//           <Button title="lkghlkg" onPress={() => _getAdress()}/>

// 				<Circle center={pin} radius={1000} />
// 		</View>
// 	)
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		alignItems: "center",
// 		justifyContent: "center"
// 	},
// 	map: {
// 		width: Dimensions.get("window").width,
// 		height: Dimensions.get("window").height
// 	}
// })

//************************************************************************************************ */
//
//                    POUR LE PLAY AND PAUSE DE LA VIDEO                                          */
//
//*********************************************************************************************** */

// import { StatusBar } from 'expo-status-bar';
// import { PresenceTransition } from 'native-base';
// import React, { useCallback, useRef, useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Dimensions,
//   ImageBackground,
//   VideoBackground,
//   Pressable,
// } from 'react-native';
// import { TapGestureHandler } from 'react-native-gesture-handler';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';

// const AnimatedImage = Animated.createAnimatedComponent(Image);


// export default function App() {
//   const scale = useSharedValue(0);
//   const opacityPauseVideo = useSharedValue(1);

//   const [shouldPlay , setShouldPlay] = useState(true)

//   const doubleTapRef = useRef();

//   const rStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: Math.max(scale.value, 0) }],
//   }));

//   const rTextStyle = useAnimatedStyle(() => ({
//     opacity: opacityPauseVideo.value,
//   }));

//   // useEffect(() => {
//   //   console.log("je suis ds le useEffect")
//   //   setShouldPlay(!shouldPlay)
//   // }, []);

//   const handlePauseImage = useCallback(() => {
//     console.log(shouldPlay)
//     if(!shouldPlay){//On met la video en pause
//       alert("j'suis dans le if")

//      scale.value =  withSpring(0)
//      setShouldPlay(true);
//       console.log("doit afficher true")
//       console.log(shouldPlay)
      
//       // scale.value = withSpring(0, undefined, (isFinished) => {
//       //   if (isFinished) {
//       //     scale.value = withDelay(500, withSpring(0));
//       //   }
//       // });
    
//     }
//     else{

//       alert("j'suis dans le else")

//       scale.value =  withSpring(1)
//       console.log("doit afficher false")
//       setShouldPlay(false);
//       console.log(shouldPlay)

//       // scale.value = withSpring(1, undefined, (isFinished) => {
//       //   if (isFinished) {
//       //     scale.value = withDelay(500, withSpring(0));
//       //   }
//       // });

//     }



//   }, []);


//   return (
//       <Pressable
//         onPress={() => onDoubleTap()}
//         >

//           <Animated.View>
//             <ImageBackground
//               source={{uri : "https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg)/origin-imgresizer.eurosport.com/2022/05/06/3367543-68831128-2560-1440.jpg"}}
//               style={styles.image}
//             >
//               <AnimatedImage
//               onPress={() => onDoubleTap() }
//                 source={{uri : "https://image.shutterstock.com/image-vector/stop-media-player-video-icon-260nw-1049594234.jpg"}}
//                 style={[
//                   styles.image,
//                   {
//                     shadowOffset: { width: 0, height: 20 },
//                     shadowOpacity: 0.35,
//                     shadowRadius: 35,
//                   },
//                   rStyle,
//                 ]}
//                 resizeMode={'center'}
//               />
//             </ImageBackground>
//             <Animated.Text style={[styles.turtles, rTextStyle]}>
//               🐢🐢🐢🐢
//             </Animated.Text>
//           </Animated.View>
//       </Pressable>
//   );
// }

// const { width: SIZE } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: SIZE,
//     height: SIZE,
//   },
//   turtles: { fontSize: 40, textAlign: 'center', marginTop: 30 },
// });



//****************************************************************************************************** */
//                                                                                                        //
//                             POUR LE FIRST PREFERENCE                                                   //
//                                                                                                        //
//******************************************************************************************************* */


// import { useDispatch } from "react-redux";
 
// import React, { useState } from 'react';
// import {View,Text, Pressable, ScrollView, Image, StyleSheet, Dimensions , Button, Modal, TouchableOpacity, FlatList, RefreshControl} from 'react-native';

// import axios from 'axios';


// //************************REDUX************************** */

// import { store } from "./store";
// import { useSelector } from "react-redux";

// import { Provider } from "react-redux";


// import { setToken } from "./store";
// import { setIsLoggedIn } from "./store";
// import { setFirstPhotoLocalisation } from "./store";
// import { setCurrentUser } from "./store";

// //********************************************************* */

// function firstPreference({ navigation, route, props }){

//     //*****************POUR LE REDUX **************************/

//   const ipAdress = useSelector((state) => state.ipAdress);
//   const token = useSelector((state) => state.token);

//   const dispatch = useDispatch();

//   //********************************************************* */

//   const margin = 16;
//   const borderRadius = 5;
//   const width = Dimensions.get("window").width / 2 - margin * 2;
//   const [opacity, setOpacity] = useState(0.3);
//   const [pressedSport , setPressedSport] = useState(false);
//   const [pressedSoiree , setPressedSoiree] = useState(false);
//   const [pressedNourriture , setPressedNourriture] = useState(false);
//   const [pressedCulture , setPressedCulture] = useState(false);
//   const [pressedVoyage , setPressedVoyage] = useState(false);
//   const[pressedManifestation , setPressedManifestation] = useState(false);
//   const[pressedHumanitaire , setPressedHumanitaire] = useState(false);
//   const[pressedVisiter , setPressedVisiter] = useState(false);
//   const[pressedGratuit , setPressedGratuit] = useState(false);
//   const[pressedInsolite , setPressedInsolite] = useState(false);
//   const[pressedAttraction , setPressedAttraction] = useState(false);
//   const[pressedAutre , setPressedAutre] = useState(false);


//   const [listPreference , setListPreference] = useState([])

//   const goSuivant = () => {

//     console.log("voici la liste  listPreference : ",listPreference)

//     axios.post(`${ipAdress}/profil/firstPreference/`, {
//       listPreference : listPreference
//       }, {
//         headers: {
//           'Authorization': 'Token d0a2941df45c3074c5e45890e8ebd31894bc5f86'
//         }
//     })
//       .then(function (response) {

//           //************ MAINTENANT ON MODIFIE LE CURRENTUSER ***************************/
//           fetch(`${ipAdress}/profil/getDataWinker/`,{
//             method:"GET",
//             headers : {
//               //'Authorization': `Token ${token}`
//               'Authorization': `Token d0a2941df45c3074c5e45890e8ebd31894bc5f86`
    
//             }
//             })
//             .then( (response) => response.json() )
//             .then( (response) => {
//               dispatch(setCurrentUser(response.data))
//             })
//             .catch(function(error) {
//               throw error;
//             });

//         console.log(response)
//       })
//       .catch(function (error) {
        
//         console.log(error);
//       });
  
//   }

//   const handlePressPreference = (boolPreference , preference) => {

//     // console.log("je suis dans handlePressPreference")
//     // console.log("voici le boolean : ",boolPreference)
//     // console.log("voici le name : ",preference)

//     if(!boolPreference){
//       setListPreference(oldArray => [...oldArray , preference])
//     }
//     else{
//       var newList = []
//       listPreference.forEach(function (element, index) {
   
//         if (element !== preference) {
//             newList.push(element)
//         }

//       });

//       setListPreference(newList)
     
//     }
//   }

//   const contains = (el , list) => {
//     for(const element of list){
//       if(element == el){
//         return true;
//       }
//     }
//     return false;
//   }
//   //****************************************************************************************** */

//   const widthScreen = Dimensions.get('window').width;
//   const heightScreen = Dimensions.get('window').height;

//   //****************************************************************************************** */
//   const renderItem = ({item}) => {

//     return(
//       <Pressable onPress={() =>  handlePressPreference(contains(item.name , listPreference) , item.name)} style={{flexDirection:'row' , height: 70 , borderRadius:5 , borderWidth : 1 , borderColor : "black",justifyContent:"center" , alignItems:"center",margin:5, backgroundColor : contains(item.name , listPreference) ? "green" : "transparent"}}>
//         <Text style={{fontSize:20}}>{item.name}</Text>
//       </Pressable>
//     )
//   }

//   const [visibleModalCulture , setVisibleModalCulture] = useState(false);
//   const [dataCulture , setDataCulture] = useState([
//     {
//       "id":1,
//       "name":"Jeux_de_société",
//     },
//     {
//       "id":2,
//       "name":"Musée",
//     },
//     {
//       "id":3,
//       "name":"Cinéma",
//     },
//     {
//       "id":4,
//       "name":"Manga",
//     },
//     {
//       "id":5,
//       "name":"Dessin",
//     },
//     {
//       "id":6,
//       "name":"Dance",
//     },
//     {
//       "id":7,
//       "name":"Musique",
//     },
//     {
//       "id":8,
//       "name":"Concert",
//     },
//     {
//       "id":9,
//       "name":"Festival",
//     },
//     {
//       "id":10,
//       "name":"Spectacle_humoristique",
//     },
//     {
//       "id":11,
//       "name":"Cirque",
//     },
//     {
//       "id":12,
//       "name":"Lecture",
//     },
//     {
//       "id":13,
//       "name":"Autre_Culture"
//     },
//   ])

//   const [visibleModalSport , setVisibleModalSport] = useState(false);
//   const [dataSport , setDataSport] = useState([
//     {
//       "id":1,
//       "name":"Foot",
//     },
//     {
//       "id":2,
//       "name":"Basket",
//     },
//     {
//       "id":12,
//       "name":"Musculation",
//     },
//     {
//       "id":3,
//       "name":"Tennis",
//     },
//     {
//       "id":4,
//       "name":"HandBall",
//     },
//     {
//       "id":5,
//       "name":"VolleyBall",
//     },
//     {
//       "id":6,
//       "name":"Vélo",
//     },
//     {
//       "id":7,
//       "name":"Sport_de_combat",
//     },
//     {
//       "id":8,
//       "name":"Randonné",
//     },
//     {
//       "id":9,
//       "name":"Sport_extrême",
//     },
//     {
//       "id":10,
//       "name":"Badminton",
//     },
//     {
//       "id":11,
//       "name":"Patinoire",
//     },

//     {
//       "id":13,
//       "name":"Autre_Sport"
//     },
//   ])

//   const [visibleModalArcade , setVisibleModalArcade] = useState(false);
//   const [dataArcade , setDataArcade] = useState([
//     {
//       "id":1,
//       "name":"Escape_Game"
//     },
//     {
//       "id":2,
//       "name":"Bowling"
//     },
//     {
//       "id":3,
//       "name":"Laser_Game"
//     },
//     {
//       "id":4,
//       "name":"Billard"
//     },
//     {
//       "id":5,
//       "name":"Karaoké"
//     },
//     {
//       "id":6,
//       "name":"Autre_Arcade"
//     }
//   ])

//   const [visibleModalSoirée , setVisibleModalSoirée] = useState(false);
//   const [dataSoirée, setDataSoirée] = useState([
//     {
//       "id":1,
//       "name":"Rave_party"
//     },
//     {
//       "id":2,
//       "name":"Erasmus"
//     },
//     {
//       "id":3,
//       "name":"After"
//     },
//     {
//       "id":4,
//       "name":"Latino"
//     },
//     {
//       "id":5,
//       "name" : "Autre_Soiree"
//     }
//   ])

//   const [visibleModalGame , setVisibleModalGame] = useState(false);
//   const [dataGame , setDataGame] = useState([
//     {
//       "id":1,
//       "name":"Jeux_de_sport"
//     },
//     {
//       "id":2,
//       "name":"Jeux_de_stratégie"
//     },
//     {
//       "id":3,
//       "name":"Jeux_de_guerre"
//     },
//     {
//       "id":4,
//       "name":"Autre_Jeux"
//     },
//   ])

//   const [visibleModalPorteOuverte , setVisibleModalPorteOuverte] = useState(false);
//   const [dataPorteOuverte , setDataPorteOuverte] = useState([
//     {
//       "id":1,
//       "name":"Santé",
//     },
//     {
//       "id":2,
//       "name":"Dessin"
//     },
//     {
//       "id":3,
//       "name":"Géopolitique"
//     },
//     {
//       "id":4,
//       "name":"Science"
//     },
//     {
//       "id":5,
//       "name":"Etudiant"
//     },
//   ])

//   //****************************************************************************************** */

//    const styles = StyleSheet.create({
//     container: {
//       width,
//       height: width * 1.3,
//       marginTop: 16,
//       justifyContent:"center",
//       alignItems:"center",
//       borderRadius,
//     },
//     textOnImage: {
//       color:"black",
//       fontSize:25,
//       position:'absolute',
//       marginTop:0,
//       zIndex:1,
//       textAlign:'center'
//     },

//     image: {
//     ...StyleSheet.absoluteFillObject,
//     width: undefined,
//     height: undefined,
//     resizeMode: "cover",
//     borderRadius,
//     },
//     button: {
//     width:"50%",
//     margin:5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 4,
//     elevation: 3,
//     backgroundColor: 'purple',
//     },
//     buttonValider: {
//         width:"50%",
//         margin:5,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 32,
//         borderRadius: 4,
//         elevation: 3,
//         backgroundColor: 'green',
//     },
//     text: {
//         fontSize: 16,
//         lineHeight: 21,
//         fontWeight: 'bold',
//         letterSpacing: 0.25,
//         color: 'white',
//     },
// });


//   return(
//   <View style={{flex:1 , backgroundColor:"rgb(156, 161, 161)"}}>
//     <View style={{marginTop:40 , borderColor:"black", borderWidth:1}}>
//         <Text style={{fontSize:25 , fontStyle:'italic',textAlign:"center"}}>Choisissez les thèmes que vous aimez pour améliorer nos propositions ! :)</Text>
//     </View>
    
//     <ScrollView>
//         <View style={ {flexDirection: "row",flexWrap: "wrap",justifyContent: "space-evenly",}}>

//           <Pressable onPress={() => {
//                   setVisibleModalSoirée(true);
//                   setPressedSoiree(!pressedSoiree);      
//                 }
            
//                }> 
//                 <View style={{...styles.container, opacity : pressedSoiree ? 1 : 0.3 }}>
//                     <Text style={styles.textOnImage}>Nos soirées</Text>
//                     <Image source={require("../Filtre/Image/soireePreference.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() =>{
//                 setPressedNourriture(!pressedNourriture)
//                 handlePressPreference(pressedNourriture, "Nouriture")
//                 }}> 
//                 <View style={{...styles.container, opacity : pressedNourriture ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Nouriture</Text>
//                     <Image source={require("../Filtre/Image/Nouriture.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() =>{
//                 setVisibleModalCulture(true)
//                 setPressedCulture(!pressedCulture)
//                 handlePressPreference(pressedCulture, "pressedCulture")
//               }}>

//                 <View style={{...styles.container, opacity : pressedCulture ? 1 : 0.3}}>
//                 <Text style={styles.textOnImage}>Culture</Text>
//                     <Image source={require("../Filtre/Image/culturePreference.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setVisibleModalSport(true)
//               setPressedSport(!pressedSport)
//               handlePressPreference(pressedSport, "pressedSport")
//             }}> 

//                 <View style={{...styles.container, opacity : pressedSport ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Sport</Text>
//                     <Image source={require("../Filtre/Image/sportPreference.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedHumanitaire(!pressedHumanitaire)
//               handlePressPreference(pressedHumanitaire, "Humanitaire")
//             }}> 

//                 <View style={{...styles.container, opacity : pressedHumanitaire ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Humanitaire</Text>
//                     <Image source={require("../Filtre/Image/Humanitaire.png")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedManifestation(!pressedManifestation)
//               handlePressPreference(pressedManifestation, "Manifestation")
//             }}> 
            
//                 <View style={{...styles.container, opacity : pressedManifestation ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Manifestation</Text>
//                     <Image source={require("../Filtre/Image/Manifestation.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedVisiter(!pressedVisiter)
//               handlePressPreference(pressedVisiter, "Visiter")
//             }}> 
            
//                 <View style={{...styles.container, opacity : pressedVisiter ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Lieu à visiter</Text>
//                     <Image source={require("../Filtre/Image/Visiter.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedGratuit(!pressedGratuit)
//               handlePressPreference(pressedGratuit, "Gratuit")
//             }}> 
            
//                 <View style={{...styles.container, opacity : pressedGratuit ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Gratuit</Text>
//                     <Image source={require("../Filtre/Image/Gratuit.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedInsolite(!pressedInsolite)
//               handlePressPreference(pressedInsolite, "Insolite")
//             }}> 
            
//                 <View style={{...styles.container, opacity : pressedInsolite ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Evenement insolite</Text>
//                     <Image source={require("../Filtre/Image/Insolite.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedAttraction(!pressedAttraction)
//               handlePressPreference(pressedAttraction, "Attraction")
//             }}> 
            
//                 <View style={{...styles.container, opacity : pressedAttraction ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Attraction</Text>
//                     <Image source={require("../Filtre/Image/Attraction.jpg")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedVoyage(!pressedVoyage);
//               handlePressPreference(pressedVoyage, "Voyage");
//             }}> 
//                 <View style={{...styles.container, opacity : pressedVoyage ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Voyage</Text>
//                     <Image source={require("../Filtre/Image/voyagePreference.jpg")}  style={styles.image}  />
//                 </View>
//             </Pressable>

//             <Pressable onPress={() => {
//               setPressedAutre(!pressedAutre)
//               handlePressPreference(pressedAttraction, "Attraction")
//             }}> 
            
//                 <View style={{...styles.container, opacity : pressedAutre ? 1 : 0.3}}>
//                     <Text style={styles.textOnImage}>Autre</Text>
//                     <Image source={require("../Filtre/Image/Autre.png")}  style={styles.image}  />
//                 </View>
                
//             </Pressable>
        
//         </View>
//     </ScrollView>

//     {listPreference.length != 0 &&
//       <Button title="Valider" onPress={() => goSuivant()} />
//     }

//         {/* Pour la culture */}
//     <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={visibleModalCulture}
//                 onRequestClose={() => {
//                 Alert.alert("Modal has been closed.");
//                 setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
//                     <TouchableOpacity onPress={() => setVisibleModalCulture(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
//                     <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

//                       <View style={{height:10}}>

//                       </View>

//                         <FlatList
//                             refreshControl={
//                                 <RefreshControl
//                                     onRefresh={() => setVisibleModalCulture(false)}
//                                 />
//                             }
//                             data={dataCulture}
//                             renderItem={renderItem}
//                             keyExtractor={item => item.id}
//                             scrollEnabled={true}
//                         />

//                     </View>

              

//                 </View>
            
//     </Modal>

//             {/* Pour le sport */}
//     <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={visibleModalSport}
//                 onRequestClose={() => {
//                 Alert.alert("Modal has been closed.");
//                 setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
//                     <TouchableOpacity onPress={() => setVisibleModalSport(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
//                     <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

//                       <View style={{height:10}}>

//                       </View>

//                         <FlatList
//                             refreshControl={
//                                 <RefreshControl
//                                     onRefresh={() => setVisibleModalSport(false)}
//                                 />
//                             }
//                             data={dataSport}
//                             renderItem={renderItem}
//                             keyExtractor={item => item.id}
//                             scrollEnabled={true}
//                         />

//                     </View>

              

//                 </View>
            
//     </Modal>

//           {/* Pour les soirées */}
//     <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={visibleModalSoirée}
//                 onRequestClose={() => {
//                 Alert.alert("Modal has been closed.");
//                 setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
//                     <TouchableOpacity onPress={() => setVisibleModalSoirée(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
//                     <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

//                       <View style={{height:10}}>

//                       </View>

//                         <FlatList
//                             refreshControl={
//                                 <RefreshControl
//                                     onRefresh={() => setVisibleModalSoirée(false)}
//                                 />
//                             }
//                             data={dataSoirée}
//                             renderItem={renderItem}
//                             keyExtractor={item => item.id}
//                             scrollEnabled={true}
//                         />

//                     </View>

              

//                 </View>
            
//     </Modal>

//           {/* Pour les jeux vidéos */}
//     <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={visibleModalGame}
//                 onRequestClose={() => {
//                 Alert.alert("Modal has been closed.");
//                 setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
//                     <TouchableOpacity onPress={() => setVisibleModalGame(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
//                     <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

//                       <View style={{height:10}}>

//                       </View>

//                         <FlatList
//                             refreshControl={
//                                 <RefreshControl
//                                     onRefresh={() => setVisibleModalGame(false)}
//                                 />
//                             }
//                             data={dataGame}
//                             renderItem={renderItem}
//                             keyExtractor={item => item.id}
//                             scrollEnabled={true}
//                         />

//                     </View>

              

//                 </View>
            
//     </Modal>

//           {/* Pour les arcades */}
//     <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={visibleModalArcade}
//                 onRequestClose={() => {
//                 Alert.alert("Modal has been closed.");
//                 setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
//                     <TouchableOpacity onPress={() => setVisibleModalArcade(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
//                     <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

//                       <View style={{height:10}}>

//                       </View>

//                         <FlatList
//                             refreshControl={
//                                 <RefreshControl
//                                     onRefresh={() => setVisibleModalArcade(false)}
//                                 />
//                             }
//                             data={dataArcade}
//                             renderItem={renderItem}
//                             keyExtractor={item => item.id}
//                             scrollEnabled={true}
//                         />

//                     </View>

              

//                 </View>
            
//     </Modal>

//           {/* Pour les portes ouvertes */}
//     <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={visibleModalPorteOuverte}
//                 onRequestClose={() => {
//                 Alert.alert("Modal has been closed.");
//                 setModalVisible(!modalVisible);
//                 }}
//             >
//                 <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
//                     <TouchableOpacity onPress={() => setVisibleModalPorteOuverte(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
//                     <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

//                       <View style={{height:10}}>

//                       </View>

//                         <FlatList
//                             refreshControl={
//                                 <RefreshControl
//                                     onRefresh={() => setVisibleModalPorteOuverte(false)}
//                                 />
//                             }
//                             data={dataPorteOuverte}
//                             renderItem={renderItem}
//                             keyExtractor={item => item.id}
//                             scrollEnabled={true}
//                         />

//                     </View>

              

//                 </View>
            
//     </Modal>

       
    
//   </View>
//   )
// }

// export default firstPreference;

