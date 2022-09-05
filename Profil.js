import { ListItem, Avatar } from 'react-native-elements';
import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {View, Text, Button, StyleSheet, TextInput,TouchableWithoutFeedback, Image,Dimensions, Pressable,Modal, ImageBackground, TouchableOpacity,RefreshControl,ActivityIndicator} from 'react-native';

import SortableGrid from "react-native-sortable-grid";

import DoubleClick from "double-click-react-native";

import { Video, AVPlaybackStatus } from 'expo-av';


import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Swiper from 'react-native-swiper';
//import styles from "./styles";
import { TapGestureHandler, TouchableHighlight } from 'react-native-gesture-handler';
//***************POUR LE REDUX *************************/
import { setToken } from "../Register/store";
import { setIsLoggedIn } from "../Register/store";
import { setCurrentUser } from "../Register/store";
import { setDataPreference } from "../Register/store";
import { setListFilesWinker } from "../Register/store";
import { setListParticipeWinker } from "../Register/store";

import { store } from "../Register/store";
import { useDispatch, useSelector } from "react-redux";

import { Provider } from "react-redux";
//************************************* */

import * as Location from 'expo-location';

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { SwiperFlatList } from 'react-native-swiper-flatlist';


import axios from 'axios';

import {StatusBar,Platform,Easing} from 'react-native';

import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';

import seeEventsIndex from "./MyEvents/index";
//import firstPreference from "../Register/firstPreference"



import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import MapView, { Callout, Circle, Marker } from "react-native-maps";



const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import {ScrollView,FlatList} from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
//import BottomSheet from "react-native-gesture-bottom-sheet";

import { SafeAreaView } from 'react-native-safe-area-context';

import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators, CardStyleInterpolators } from "@react-navigation/stack";
import { useDisclose } from 'native-base';
import { abs } from 'react-native-reanimated';

//************************** NAVIGATION DE LA PAGE *******************************************/

// inpire de la video : https://www.youtube.com/watch?v=Opu3nfusnMo
 
  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 50,
      mass: 3,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }
  }
  
  const closeConfig = {
    animation: 'timing',
    config: {
      duration: 200,
      easing: Easing.linear,
    }
  }
  
  const customTransition = {
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              })
            },
            {
              rotate: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["180deg", "0deg"],
              }),
            },
            {
              scale: next ?
                next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }) : 1,
            }
          ]
        },
        opacity: current.opacity,
      }
    }
  }

  const widthScreen = Dimensions.get('window').width;
  const heightScreen = Dimensions.get('window').height;

const Stack = createStackNavigator();

const Index = ({navigation}) => {
    return(
    <Provider store={store}>
      <Stack.Navigator
           screenOptions={{
            gestureEnabled: false,
            //gestureDirection: 'horizontal',
          }}
      initialRouteName="Profil">
        <Stack.Screen name="Profil" component={Profil} options={{ headerShown: false }} />
        <Stack.Screen name="firstPreference" component={firstPreference} options={{ headerShown: false }} />
        <Stack.Screen name="seeEventsIndex" component={seeEventsIndex} options={{ headerShown: false }} />    
        <Stack.Screen name="addOrDeletePicture" component={addOrDeletePicture}
        
           // options={{...customTransition,}}
        
           // options={{
        //     gestureDirection: 'horizontal',
        //     cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
        //   }}

        options={{
            transitionSpec: {
              open: config,
              close: closeConfig,
           
            },
            headerShown:false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
          />

          <Stack.Screen name="seeEventIndividual" component={seeEventIndividual}
            options={{
                transitionSpec: {
                  open: config,
                  close: closeConfig,
                
                },
                headerShown:false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
          />
          <Stack.Screen name="settings" component={settings}
          options={{
            transitionSpec: {
              open: config,
              close: closeConfig,
           
            },
            headerShown:false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
          
          />
      </Stack.Navigator>
    </Provider>
    )
  
}

export default Index


const settings = ({navigation}) => {

  //*********************************POUR LE REDUX **********************************************/

  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.currentUser);

  const dispatch = useDispatch();


  //***************************** POUR LA LOCALISATION *************************************************************** */

  const [userLocation , setUserLocation] = useState({});
  const [adressUser , setAdressUser] = useState({});

  const[issueLocalisation , setIssueLocalisation] = useState(false)
  
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const _getLocation = async () => {

        const { status } = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
          console.log('permission not granted')
          alert('permission not granted')
        }
    
        var _userLocation = await Location.getCurrentPositionAsync();
        setTimeout(() => {  setUserLocation(_userLocation); }, 2000);
    
        if(isEmpty(userLocation)){//Dans ce cas c'est qu'il y a un beug et que userLocation ne c'est pas bien mit
            console.log("il y a un probleme ds userLocation donc on re fait le test");
            var _userLocation = await Location.getCurrentPositionAsync();
            setTimeout(() => {  setUserLocation(_userLocation); }, 2000);
        }

    
    
    console.log("here is the userLocation ",userLocation)

  }

  const _getAdress = async () => {
    //Je pense qu'on a juste besoin de mettre la meme adresse
    if(isEmpty(userLocation)){//Dans ce cas c'est qu'il y a un beug et que userLocation ne c'est pas bien mit
        console.log("il y a un probleme ds userLocation donc on re fait le test et cette fois ds _getAdress");
        setIssueLocalisation(true)
        return
        
    }
    try{
        const userAdress = await Location.reverseGeocodeAsync(userLocation.coords)
        setAdressUser(userAdress)
        setIssueLocalisation(false)
    }
    catch(e){
        console.log(e)
    }
   
  }

  const PressCurrentLocation = () => {
    _getLocation()
    .then(result =>  _getAdress())
   
  }


     //********************** POUR CHANGER LA LOCALISATION AVEC LA CARTE **************************/

  const [visibleModalMap , setVisibleModalMap] = useState(false)

  const [ pin, setPin ] = useState({
         latitude: 37.78825,
         longitude: -122.4324
     })
 
  const [ region, setRegion ] = useState({
     latitude: currentUser.lat,
     longitude: currentUser.lon,
     latitudeDelta: 0.0922,
     longitudeDelta: 0.0421
     })
 
  const _getAdressMap = async () => {

     //Je pense qu'on a juste besoin de mettre la meme adresse
     const userAdress = await Location.reverseGeocodeAsync({"longitude" : region.longitude, "latitude":region.latitude})
     setAdressUser(userAdress)
 
     console.log(adressUser)

     setVisibleModalMap(false)

   }

  //*********************************** POUR LA LANGUE  *****************************************/

  const [espagnol , setEspagnol] = useState(false)
  const [anglais , setAnglais] = useState(false)
  const [francais , setFrancais] = useState(true)
  const [italien , setItalien] = useState(false)

  const handleLangue = (langue) => {
    if(langue == "italien"){
        setEspagnol(false);
        setAnglais(false);
        setFrancais(false);
        setItalien(true);
    }

    if(langue == "francais"){
        setEspagnol(false);
        setAnglais(false);
        setFrancais(true);
        setItalien(false);
    }

    if(langue == "anglais"){
        setEspagnol(false);
        setAnglais(true);
        setFrancais(false);
        setItalien(false);
    }

    if(langue == "espagnol"){
        setEspagnol(true);
        setAnglais(false);
        setFrancais(false);
        setItalien(false);
    }
  }


    //******************************************************************************************* */

    const handleModification = () => {

    //************** DES FOIS IL PEUT Y AVOIR DES ERREURS SUR LE ADRESSUSER DONC ON FAIT CA POUR LIIMITER LES ERREURS */

  

    //****************************************************************************************************** */
    axios.post(ipAdress + '/profil/settingsChange/', {
      francais : francais,
      anglais : anglais,
      italien : italien,
      espagnol : espagnol,
      lat : userLocation["latitude"],
      lon : userLocation["longitude"],
      ville : adressUser[0]["city"],
      codePostale : adressUser[0]["postalCode"],
    }, {
      headers: {
        'Authorization': 'Token '+token
      }
  })
    .then(function (response) {
     navigation.navigate("Profil")
    })
    .catch(function (error) {
      
    });
    }

  //   useEffect(() =>{
  //     _getLocation()
  //     _getAdress()
  // }, [])

  //********************************** POUR LA LOCALISATION *********************************** */

  const [modalVisibleCalendar , setModalVisibleCalendar] = useState(false)


  //****************************************************************************************** */


  return(
    <View style={{flex:1 , backgroundColor:"magenta", justifyContent:"space-evenly",alignItems:"center",}}>

        <View style={{backgroundColor:'white', flex:2,borderRadius:45, borderWidth : 4}}>
                    <Text>Votre localisation actuelle : {currentUser.city}</Text>
            <Pressable  style={{flex:0.40,borderRadius:12,justifyContent:"center",alignItems:"center"}}>
                        
                {issueLocalisation &&
                  <Text style={{color:"red"}}>Probleme lors de votre location, veuillez réappuyer </Text>
                }

                        <TouchableOpacity onPress={() => PressCurrentLocation()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12}}>
                            <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Utiliser votre position actuelle ?</Text>
                        </TouchableOpacity>
                        
                        <Text style={{color:"purple"}}>
                           <Text></Text>
                            <MaterialIcons name="place" size={15}  style={{color:'purple',marginTop:8,marginLeft:20,marginRight:30}} />
                            {adressUser[0] &&
                                <Text style={{marginTop : 50}}>Localisation : {JSON.stringify(adressUser[0].city)}</Text>
                            }
                        </Text>

                       
                     
                    </Pressable>

                    <Pressable onPress={() => PressCurrentLocation()}   style={{flex:0.40,borderRadius:12,justifyContent:"center",alignItems:"center"}}>
                   
                    <TouchableOpacity onPress={() => setVisibleModalMap(true)} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12}}>
                            <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Utiliser une autre position ?</Text>
                        </TouchableOpacity>
                        <Text style={{color:"purple"}}>
                            <Text></Text>
                            <MaterialIcons name="place" size={15}  style={{color:'purple',marginTop:8,marginLeft:20,marginRight:30}} />
                            {adressUser[0] &&
                                <Text style={{marginTop : 50}}>Localisation : {JSON.stringify(adressUser[0].city)}</Text>
                            }
                        </Text>

                    </Pressable>

        </View>
    
    
    <View style={{flex:1,display:"flex",flexDirection:"row",borderWidth:1,borderColor:"purple",justifyContent:"center",alignItems:"center"}}>
        <View style={{flex:1}}>
            <Text>Langue : </Text>
        </View>
        <View style={{flex:2, flexDirection:"row",justifyContent:"space-around",padding:10}}>

            <Pressable  onPress={() => handleLangue("francais")}>
                <Image
                    style={{width: 50,height:30,opacity: francais ? 1 : 0.3 }}
                    source={{
                        uri: ipAdress + "/media/Drapeaux/france.png",
                    }}
                />
            </Pressable>
            
            <Pressable  onPress={() => handleLangue("anglais")}>
                <Image
                    style={{width: 50,height:30,opacity: anglais ? 1 : 0.3 }}
                    source={{
                    uri: ipAdress + "/media/Drapeaux/uk.png",
                    }}
                />            
            </Pressable>
            
            <Pressable  onPress={() => handleLangue("italien")}>
                <Image
                    style={{width: 50,height:30,opacity: italien ? 1 : 0.3 }}
                    source={{
                        uri: ipAdress + "/media/Drapeaux/italie.png",
                    }}
                />
            </Pressable>
            
            <Pressable  onPress={() => handleLangue("espagnol")}>
                <Image
                    style={{width: 50,height:30,opacity: espagnol ? 1 : 0.3 }}
                    source={{
                        uri: ipAdress + "/media/Drapeaux/espagne.jpg",
                    }}
                />
            </Pressable>
        
        </View>
    </View>

    <View style={{display:"flex",flexDirection:"row"}}>
      
    <TouchableOpacity onPress={() => navigation.navigate("Profil")} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12}}>
        <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Retour </Text>
    </TouchableOpacity>

    
    <TouchableOpacity onPress={() => handleModification()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12}}>
        <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Valider </Text>
    </TouchableOpacity>
    </View>


       {/* Pour changer la localisation avec la CARTE */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visibleModalMap}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >

        <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38}}>
                    
      <GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
        GooglePlacesDetailsQuery={{
          rankby: "distance",
          fields: 'geometry',
        }}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log("******************kkkkkkkkkkkk******************************************************")
          console.log(details.geometry)
          setUserLocation({
            "latitude": details.geometry.location.lat,
            "longitude": details.geometry.location.lng,
          })
          console.log("*******************lllllllllllll*****************************************************")
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					})
				}}
				query={{
					key: "AIzaSyDRdQ8vpw3HaX_GMhF_1QeJ5Gvb5n56coI",
					language: "fr",
					components: "country:fr",
					types: "(cities)",
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1,backgroundColor:"black" },
					listView: { backgroundColor: "red" }
				}}
			/>

			<MapView
				style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 45
        }}
				initialRegion={{
					latitude: region.latitude,
					longitude: region.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421
				}}
				provider="google"
			>
        
				<Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
				<Marker
					coordinate={pin}
					pinColor="black"
					draggable={true}
					onDragStart={(e) => {
						console.log("Drag start", e.nativeEvent.coordinates)
					}}
					onDragEnd={(e) => {
						setPin({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude
						})
					}}
				>
					<Callout>
						<Text style={{color:"red",fontSize:30}}>I'm here</Text>

					</Callout>
				</Marker>
    
			</MapView>
     
      <Circle
          center={
            {longitude:region.longitude,
            latitude:region.latitude}
          }
          radius={60}
          strokeColor="blue"
        />

        <TouchableOpacity onPress={() => _getAdressMap()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5,marginBottom:100}}>
                <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Valider !</Text>
        </TouchableOpacity>
  
				<Circle center={pin} radius={1000} />
                    
        </View>

      </Modal>

  </View>
  )
}

var globaldeletedPicture = [];


//Fonction qui ressort la liste de dictionnaire contenant les images du winker


//**************************************************************************************************************** */
//
//                                        PAGE DE MODIF DES PHOTOS DE PROFIL                                                          */
//
//**************************************************************************************************************** */



const PhotoGallery = () => {

  //********************POUR LE REDUX ********************************/
  const dispatch = useDispatch();

  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.currentUser);


//******************************************************** */

  //***************POUR L'UPLOAD DE L'IMAGE ********************************/
  const [image, setImage] = useState(null);
  const [uploading, startUploading] = useState(false);
  useEffect(() => {
              (async () => {
                if (Platform.OS !== 'web') {
                  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                  }
                }
              })();
  }, []);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
           
    console.log(result);
           
    if (!result.cancelled) {
      setImage(result.uri)
      //.then(result => uploadFile())
    }
    
  };
      
  const uploadFile = async () => {
    if(image){

    console.log("voici l'image : ",image)
    const fileUri = image;
    let filename = fileUri.split('/').pop();
           
    const extArr = /\.(\w+)$/.exec(filename);
    //const type = getMimeType(extArr[1]);
    const type = "image/png";
    setImage(null);
    startUploading(true);
           
    let formData = new FormData();
           
    formData.append('filetoupload', { uri: fileUri, name: filename, type });
          
    const response = await fetch(ipAdress+"/profil/uploadImageProfil/", {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'token '+token,
      'content-type': 'multipart/form-data',
    },
    })
    .then( (response) => response.json() )
    .then( (responseJson) => {
      dispatch(setCurrentUser(responseJson.data))
              
      var  listDataFileWinker = []
     
      listDataFileWinker.push({
        id : 1,
        type : 'photoProfil',
        picture : responseJson.data.photoProfil
      },
      )
            
      var listPhotos = [];
            
      var id = 1;
            
      for (var dict of responseJson.data.filesWinker){
        id = id + 1
        listPhotos.push({
          id : id + 1,
          type : "photoFilesWinker",
          picture : ipAdress+dict["image"]
        })
      }
            
      listDataFileWinker = listDataFileWinker.concat(listPhotos)          
      dispatch(setListFilesWinker(listDataFileWinker))
    })


    //****************************************************************** */
    startUploading(false);
    const responseAgain = await response.text();
    console.log(responseAgain);
    return response;
    }
    else{
      alert("you don't have uploaded any file")
    }
  };
  return(
    
    <Pressable onPress={pickImage} style={{alignItems:"center",borderStyle: 'dotted',borderWidth: 1,borderRadius: 1,height:200,width:windowWidth / 3.4,margin:10,backgroundColor:'blue',borderColor:"white"}}>
      {!image && 
        <Text style={{textAlign:"center",textAlignVertical:"center",marginTop:"40%",fontSize:20}}>Ajouter une nouvelle photo <AntDesign name={'camera'} size={40} style={{color:'black'}} /></Text>
      }
      
      {image &&
        <ImageBackground source={{ uri: image }} style={{ width: "100%", height: "100%" ,alignItems:"center",justifyContent:"center"}}>
          <Button title="Upload" onPress={uploadFile} />
        </ImageBackground>               
      }
    </Pressable>
  )
}

const ChangePhotoProfil = () => {

  //********************POUR LE REDUX ********************************/

  const dispatch = useDispatch();

  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.currentUser);
  const listFilesWinker = useSelector((state) => state.listFilesWinker);


//******************************************************** */

  //***************POUR L'UPLOAD DE L'IMAGE ********************************/
  const [image, setImage] = useState(null);
  const [uploading, startUploading] = useState(false);
  useEffect(() => {
              (async () => {
                if (Platform.OS !== 'web') {
                  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                  }
                }
              })();
  }, []);
      
  const getMimeType = (ext) => {
    // mime type mapping for few of the sample file types
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'jpg': return 'image/jpeg';
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
    }
    }
    
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
           
    console.log(result);
           
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
    
  const uploadFile =  () => {
      
    if(image){
        const fileUri = image;
        let filename = fileUri.split('/').pop();
           
        const extArr = /\.(\w+)$/.exec(filename);
        // const type = getMimeType(extArr[1]);
        const type = "image/png";
        setImage(null);
        startUploading(true);
           
        let formData = new FormData();
           
        formData.append('filetoupload', { uri: fileUri, name: filename, type });
        
           
        fetch(ipAdress+"/profil/uploadImagePhotoProfil/", {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': 'token '+token,
            'content-type': 'multipart/form-data',
          },
          })
          .then( (response) => response.json() )
          .then( (responseJson) => {
              dispatch(setCurrentUser(responseJson.data))
              //console.log("maintenant on change le listFilesWinker")
              var  listDataFileWinker = []
     
              listDataFileWinker.push({
                id : 1,
                type : 'photoProfil',
                picture : responseJson.data.photoProfil
              },
              )
            
              var listPhotos = [];
            
              var id = 1;
            
              for (var dict of responseJson.data.filesWinker){
                id = id + 1
                  listPhotos.push({
                      id : id + 1,
                      type : "photoFilesWinker",
                      picture : ipAdress+dict["image"]
                  })
              }
            
              listDataFileWinker = listDataFileWinker.concat(listPhotos)
              //console.log("voici la dataPictureeeeeeees : ",listDataFileWinker)
              dispatch(setListFilesWinker(listDataFileWinker))
          })
            
          startUploading(false);
          
          return ;
        }
        else{
          alert("you don't have uploaded any file")
        }

  };
    
    return(
      <Pressable onPress={pickImage} style={{alignItems:"center",borderStyle: 'dotted',borderWidth: 1,borderRadius: 1,height:200,width:windowWidth / 3.4,margin:10,backgroundColor:'blue',borderColor:"white"}}>
        {!image ? 
          <Text style={{textAlign:"center",textAlignVertical:"center",marginTop:"40%",fontSize:20}}>Changer de photo de profil <AntDesign name={'camera'} size={40} style={{color:'black'}} /></Text>
            :
          <ImageBackground source={{ uri: image }} style={{ width: "100%", height: "100%" ,alignItems:"center",justifyContent:"center"}}>
            <Button title="Upload Photo Profil" onPress={uploadFile} />
          </ImageBackground>    
        }
      </Pressable>
    )

}

const addOrDeletePicture = ({route , navigation})=>{

    //********************POUR LE REDUX ********************************/
    const dispatch = useDispatch();

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
    const currentUser = useSelector((state) => state.currentUser);
    const listFilesWinker = useSelector((state) => state.listFilesWinker);


  //******************************************************** */

  //const { dataPictures, } = route.params;

  //**********POUR CHANGER LES PHOTOS QUAND ELLES ONT ETE MODIFIEES ******************* */

  const [dataPictures , setDataPictures] = useState([])


  const [doItOnce , setDoItOnce] = useState(false)
  useEffect(() =>{
    getListDataFileWinker()
  }, [doItOnce])

  const getListDataFileWinker = () => {

    console.log("je suis dans getListDataFileWinker")
    //******************************************************** */
   
     fetch(`${ipAdress}/profil/getDataWinker/`,{
       method:"GET",
       headers : {
         'Authorization': `Token ${token}`
       }
       })
       .then( (response) => response.json() )
       .then( (response) => {
         dispatch(setCurrentUser(response.data))
         //console.log("voici maintenant le currentUser : ",currentUser)
   
         // **************** Maintenant que l'on a recup le currentUser, on crée la liste de filesWinker *******************
         var  listDataFileWinker = []
   
         listDataFileWinker.push({
           id : 1,
           type : 'photoProfil',
           picture : currentUser.photoProfil
         },
         )
       
         var listPhotos = [];
       
         var id = 1;
       
         for (var dict of currentUser.filesWinker){
          id = id + 1
             listPhotos.push({
                 id : id + 1,
                 type : "photoFilesWinker",
                 picture : ipAdress+dict["image"]
             })
         }
       
         listDataFileWinker = listDataFileWinker.concat(listPhotos)
         console.log("voici la dataPictureeeeeeees : ",listDataFileWinker)
         dispatch(setListFilesWinker(listDataFileWinker))
         //setDataPictures(listDataFileWinker)
       })
       .catch(function(error) {
         throw error;
       });
   
   
   }


  //**************************************************************************************** */
  //***********************POUR SUPPRIMER LES PHOTOS *************************************** */

  const [wantDeletePictures , setWantDeletePictures] = useState(false)

  const handlePressedPicture = (item) => {

    alert("you pressed on this picture")
    console.log("voici l'uri : ",item)

    axios.post(ipAdress + '/profil/deletePcture/', {
      type : item.type,
      uri: item.picture,
    }, {
      headers: {
        'Authorization': 'Token '+token
      }
  })
    .then( (responseJson) => {
      console.log("voici la responseJson.data : ",responseJson.data)
        dispatch(setCurrentUser(responseJson.data.data))
                
        var  listDataFileWinker = []
       
        listDataFileWinker.push({
          id : 1,
          type : 'photoProfil',
          picture : responseJson.data.data.photoProfil
        },
        )
              
        var listPhotos = [];
              
        var id = 1;
              
        for (var dict of responseJson.data.data.filesWinker){
          id = id + 1
          listPhotos.push({
            id : id + 1,
            type : "photoFilesWinker",
            picture : ipAdress+dict["image"]
          })
        }
              
        listDataFileWinker = listDataFileWinker.concat(listPhotos)          
        dispatch(setListFilesWinker(listDataFileWinker))
      })  
  .catch(function (error) {
      console.log(error);
    });

             
  }

  const renderPictureDeleted = ({item}) => {
    return(
      <Pressable key={item.id} onPress={()=> handlePressedPicture(item)} style={{height:250,width:windowWidth / 2.3,margin:10}}>
        <ImageBackground
          style={{width:"100%",height:"100%",opacity:  1}}
          source={{uri : item.picture}}
        >
        </ImageBackground>
      </Pressable>
    )
  }


  //**************************************************************************************** */




//************************************************************************* */

    return (
        <View style={{backgroundColor:'black', flex:1}}>      
          
          <View style={{display : "flex", flexDirection:"row"}}>
              <PhotoGallery />
              <ChangePhotoProfil />
              <Pressable onPress={() =>setWantDeletePictures(true)}  style={{alignItems:"center",borderStyle: 'dotted',borderWidth: 1,borderRadius: 1,height:200,width:windowWidth / 3.6,margin:10,backgroundColor:'blue',borderColor:"white",justifyContent:"center",alignItems:"center"}}>
          
                <Text style={{fontSize:20}}>Supprimer des photos</Text>
                
            </Pressable>
          </View>
          <DoubleClick
              singleTap={() => {
                alert("you clicked once")
                //swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index - 1)%(listFilesWinker.length))})
              }}
              doubleTap={() => {
                navigation.navigate('Profil')
              }}
              delay={250}
              //style={{width:(Dimensions.get("window").width - 5) / 2,height:"100%" , backgroundColor:"transparent"}}
          >

          <FlatList
            nestedScrollEnabled 
            data={listFilesWinker}
            contentContainerStyle={{marginTop:10,display:"flex",flexWrap:"wrap",flexDirection:"row"}}
            renderItem={({item}) => (


              <DoubleClick
              singleTap={() => {
                alert("you clicked once")
                //swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index - 1)%(listFilesWinker.length))})
              }}
              doubleTap={() => {
                navigation.navigate('Profil')
              }}
              delay={250}
              style={{height:250,width:windowWidth / 2.3,margin:10}}          >
              
              <ImageBackground
                style={{width:"100%",height:"100%",opacity: 1}}
                source={{uri : item.picture}}
              >
              </ImageBackground>
            </DoubleClick>




            )}
            keyExtractor={item => item.id}
          />


          </DoubleClick>
      
     
 
          <View style={{position:'absolute',bottom:5,display:"flex",flexDirection:"row"}}>
            <AntDesign onPress={() => navigation.navigate('Profil')}  name="back" size={50} style={{color:'white',marginRight:10}} />
          </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={wantDeletePictures}
                onRequestClose={() => {
                alert("Modal has been closed.");
                }}
            >

                <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={() => setWantDeletePictures(false)} style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    <View style={{backgroundColor:'white', flex:3,borderRadius:45, borderWidth : 4}}>
                      <Text style={{textAlign:"center",fontSize:24}}>Appuyé sur la photo à supprimer</Text>
                      <FlatList
                        data={listFilesWinker}
                        contentContainerStyle={{marginTop:10,display:"flex",flexWrap:"wrap",flexDirection:"row"}}
                        renderItem={renderPictureDeleted}
                        keyExtractor={item => item.id}
                      /> 
                    </View>

                    <TouchableOpacity onPress={() => setWantDeletePictures(false)} style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    
                </View>

            </Modal>

        </View>
    )
}


//**************************************************************************************************************** */
//
//                                        PAGE DE PROFIL                                                           */
//
//**************************************************************************************************************** */




const Profil = ({navigation}) => {  
        //********************POUR LE REDUX ********************************/
        const dispatch = useDispatch();

        const ipAdress = useSelector((state) => state.ipAdress);
        const token = useSelector((state) => state.token);
        const currentUser = useSelector((state) => state.currentUser);
        const listFilesWinker = useSelector((state) => state.listFilesWinker);
        const dataPreference = useSelector((state) => state.dataPreference);
        const apiKey = useSelector((state) => state.apiKey);

        const listParticipeWinker = useSelector((state) => state.listParticipeWinker);
    
      //***************************************************************** */

      //***************************POUR LE REFRSH ****************************/

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      
      getListDataFileWinker();

      alert("the page is refreshed")
    
      setRefreshing(false)
      
    }, []);

      //**************************POUR LES FILES************************** */

    const [dataPictures , setDataPictures] = useState([])

  const getListDataFileWinker = () => {
    //******************************************************** */
   
     fetch(`${ipAdress}/profil/getDataWinker/`,{
       method:"GET",
       headers : {
         'Authorization': `Token ${token}`
       }
       })
       .then( (response) => response.json() )
       .then( (response) => {
         dispatch(setCurrentUser(response.data))
         //console.log("voici maintenant le currentUser : ",currentUser)
   
         // **************** Maintenant que l'on a recup le currentUser, on crée la liste de filesWinker *******************
         var  listDataFileWinker = []
   
         listDataFileWinker.push({
           id : 1,
           type : 'photoProfil',
           picture : currentUser.photoProfil
         },
         )
       
         var listPhotos = [];
       
         var id = 1;
       
         for (var dict of currentUser.filesWinker){
            id = id + 1;
             listPhotos.push({
                 id : id + 1,
                 type : "photoFilesWinker",
                 picture : ipAdress+dict["image"]
             })
         }
       
         listDataFileWinker = listDataFileWinker.concat(listPhotos)
         //setDataPictures(listDataFileWinker)
         dispatch(setListFilesWinker(listDataFileWinker))
       })
       .catch(function(error) {
         throw error;
       });
   
   
   }
   

    useEffect(() => {

      getListDataFileWinker();

    }, []); // Only re-run the effect if count changes

      //********************************************************************** */
        const [dataWinker, setDataWinker] = useState({});
    
        const [photoProfilWinker , setPhotoProfilWinker] = useState("https://www.raprnb.com/wp-content/uploads/2019/04/conor-mcgregor-vs-dustin-poirier-e1611480507265.jpg")
    
        const [filesWinker , setFilesWinker] = useState([])
    
        const [bio, setBio] = useState("");
        const [newBio, setNewBio] = useState(bio);
        const [etude, setEtude] = useState("");
        const [newEtude, setNewEtude] = useState(bio);
        const [birth, setBirth] = useState("");

        // *************************** POUR LES FOLLOWS **************************************
        const [numberFollower , setNumberFollower] = useState(0)
        const [numberFollowing , setNumberFollowing] = useState(0)
        const [modalVisibleFollow , setModalVisibleFollow] = useState(false)

        const [seeFollower , setSeeFollower] = useState(false)
        const [seeFollowing , setSeeFollowing] = useState(false)

        const [dataFollowing , setDataFollowing] = useState({})
        const [dataFollower , setDataFollower] = useState({})


        const onModalFollow = () => {
          setModalVisibleFollow(!modalVisibleFollow)
        }

        const handleVisibleFollow = (text) => {
          if(text == "follower"){
            setSeeFollowing(false)
            setSeeFollower(true)

            fetch(`${ipAdress}/profil/getDataFollower/`,{
              method:"GET",
              headers : {
                'Authorization': `Token ${token}`
              }
              })
              .then( (response) => response.json() )
              .then( (response) => {
                setDataFollower(response.data)
              })
              .catch(function(error) {
                throw error;
              });

          }
          if(text == "following"){
            setSeeFollower(false)
            setSeeFollowing(true)

            fetch(`${ipAdress}/profil/getDataFollowing/`,{
              method:"GET",
              headers : {
                'Authorization': `Token ${token}`
              }
              })
              .then( (response) => response.json() )
              .then( (response) => {
                setDataFollowing(response.data)
              })
              .catch(function(error) {
                throw error;
              });
          }

        }

        const Unfollow = (idWinker) => {
          axios.post(ipAdress + '/profil/unfollow/', {
            idWinker: idWinker,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
            handleVisibleFollow("following")
          })
          .catch(function (error) {
            console.log(error);
          });
        } 

        const renderItemFollowing = ({item}) => {
          let itemm = item.winker
          return(

            <Pressable onPress = {() => addOrRemoveId(item.id)}
            style=
            {{
            backgroundColor:"transparent",
            display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10
            }}>
                <View style={{display:'flex',flexDirection:'row',flex:3}}>
                      <Image
                            style={{width: 50,
                              height: 50,
                              borderRadius: 25,
                              borderWidth: 5,
                              borderColor: '#4c4c4c',}}
                            source={{uri: itemm.photoProfil}}
                        /> 
                    
                     <Text> {itemm.username}</Text>
                </View>
              
                <Pressable onPress={() => Unfollow(itemm.id)} style={{flex:1,}}>
                    <Text style={{marginTop:20}}>
                         Unfollow
                    </Text>
                </Pressable>
          
            </Pressable>

        
          )
        }

        const renderItemFollower = ({item}) => {
          let itemm = item.winker
          return(
            <Pressable onPress = {() => addOrRemoveId(item.id)}
            style=
            {{
            backgroundColor:"transparent",
            display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10
            }}>
                <View style={{display:'flex',flexDirection:'row',flex:3}}>
                      <Image
                            style={{width: 50,
                              height: 50,
                              borderRadius: 25,
                              borderWidth: 5,
                              borderColor: '#4c4c4c',}}
                            source={{uri: itemm.photoProfil}}
                        /> 
                    
                     <Text> {itemm.username}</Text>
                </View>
              
                <View style={{flex:1,}}>
                
                </View>
          
            </Pressable>
          )
        }
    
        
        //************************************************************************************ */
        const [wantModificateEtudeBio, setWantModificateEtudeBio] = useState(false);
    
        const [modalVisibleIcons, setModalVisibleIcons] = useState(false)
    
        const [iconParty, setIconParty] = useState(false);
        const [iconFootball, setIconFootball] = useState(false);
        const [iconBasket, setIconBasket] = useState(false);
        const [iconChill, setIconChill] = useState(false);
        const [iconVoyage, setIconVoyage] = useState(false);
        const [iconGame, setIconGame] = useState(false);
        const [iconCulture, setIconCulture] = useState(false);
        const [iconManger, setIconManger] = useState(false);
        const [iconMusic, setIconMusic] = useState(false);
        const [iconSport, setIconSport] = useState(false);

        const [listTrueAttribute , setListTrueAttribute] = useState([])
    
        const displayImage = []

        const renderItemGout = ({item}) => {
          return(
            <View style={{padding:15,margin:5,borderRadius:15,backgroundColor:"rgb(240, 206, 154)",justifyContent:"center",alignItems:"center",flexDirection:"row",width:widthScreen / 3.1}}>
              <Text style={{color:"white"}}>{item.name}</Text>
              <AntDesign name="star" size={25} style={{color:'yellow',marginTop:0,marginLeft:8}} />
            </View>
          )
        }

        const getPreferenceUser = () => {
          
          axios.post(ipAdress + '/profil/getPreferenceUser/', {
            userId:currentUser.id,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
            setListTrueAttribute(response.data.listTrueAttribute)
            dispatch(setDataPreference(response.data.listTrueAttribute))
            //console.log("voici la liste des true Attribute : ",response.data.listTrueAttribute)
            //console.log("voici la dataPreference : ",dataPreference)
                 
          })
          .catch(function (error) {
            console.log(error);
          });

        }
    
        useEffect(() => {
            getPreferenceUser()
            setDataWinker(currentUser)
            setBio(dataWinker["bio"])
            setNewBio(bio)
            setEtude(dataWinker["etude"])
            setNewEtude(etude)

            if(Object.keys(currentUser).length != 0){

                setBio(currentUser["bio"])
                setNewBio(bio)
                setEtude(currentUser["etude"])
                setNewEtude(etude)

        
                setPhotoProfilWinker(currentUser["photoProfil"])
        
                setBirth(currentUser["birth"])
        
                setFilesWinker(currentUser["filesWinker"]) 
            }
            else{//Dans le cas ou le currentUser n'a pas été mis à jour
                //console.log(" YOU ARE HEEERRRRREEEEEEE !")

                fetch(`${ipAdress}/profil/getDataWinker/`,{
                    method:"GET",
                    headers : {
                      'Authorization': `Token ${token}`
                    }
                    })
                    .then( (response) => response.json() )
                    .then( (response) => {
                      dispatch(setCurrentUser(response.data))
                      //console.log("voici maintenant le currentUser : ",currentUser)
                    })
                    .catch(function(error) {
                      throw error;
                    });
            }        
    
        },[]);
    
        const swiperRef = useRef(null);
    
        // Liste avec tous les icons liés à des boolean
        const listIcons = {
            "party":iconParty,
            "football":iconFootball,
            "basket":iconBasket,
            "chill":iconChill,
            "voyage":iconVoyage,
            "game":iconGame,
            "culture":iconCulture,
            "manger":iconManger,
            "music":iconMusic,
            "sport":iconSport
                }
    
        // const [bio, setBio] = useState(dataWinker.bio);
        // const [etude, setEtude] = useState(dataWinker.etude);

        const handleModificationEtude = () => {
            
          axios.post(ipAdress + '/profil/uploadEtude/', {
            newEtude:newEtude,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
                  alert("vos etudes ont bien ete modifie")
                  setWantModificateEtudeBio(false)

                  //********** on reactualise le currentUser ********************/
                  fetch(`${ipAdress}/profil/getDataWinker/`,{
                    method:"GET",
                    headers : {
                      'Authorization': 'Token '+token
                    }
                    })
                    .then( (response) => response.json() )
                    .then( (response) => {
                      dispatch(setCurrentUser(response.data))
                    })
                    .catch(function(error) {
                      throw error;
                    });

                    //********************************************************* */
          })
          .catch(function (error) {
            console.log(error);
          });

        }

        const handleModificationBio = () => {
            
          axios.post(ipAdress + '/profil/uploadBio/', {
            newBio:newBio,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
                  alert("votre bio a bien ete modifie")
                  setWantModificateEtudeBio(false)

                  //********** on reactualise le currentUser ********************/
                  fetch(`${ipAdress}/profil/getDataWinker/`,{
                    method:"GET",
                    headers : {
                      'Authorization': `Token ${token}`
                    }
                    })
                    .then( (response) => response.json() )
                    .then( (response) => {
                      dispatch(setCurrentUser(response.data))
                    })
                    .catch(function(error) {
                      throw error;
                    });

                    //********************************************************* */
          })
          .catch(function (error) {
            console.log(error);
          });

        }
    
        const addOrSupressIcons = () => {
            setModalVisibleIcons(!modalVisibleIcons)
        }
    
        const closeAndUpdateModalIcon = () => {
            // Il faut d'abord savoir quels icons ont été choisi
    
            var selectIcons = []
    
            setModalVisibleIcons(!modalVisibleIcons)
            for (var icon in listIcons){
                if (listIcons[icon] == true) {
                    selectIcons.push(icon);
                }
            }
            
    
            axios.post( (ipAdress)+'/profil/modificationProfil/', {
                modificationBioOuEtude:0,
                modificationIcon:1,
                selectIcons:selectIcons,
    
              })
              .then(function (response) {
                  if(response.data.modificationFaite){
                    //   Dans ce cas l'evenement a deja ete mis en favoris par l'utilisateur
                      alert("les modifications ont bien ete faite")
                  }
                  else{
                      // Dans ce cas l'evenement n'a pas ete mis en favoris par l'utilisateur
                      alert("Il y a eu un probleme lors de la modification de votre profil")
                  }
              })
              .catch(function (error) {
                console.log(error);
              });
    
          
            
            
            // alert('Il faut faire ici les mises à jour des icons choisis par l\'utilisateur')
        }
    
        function getAge(date) { 
            return date;
        }
    
    //******************************************************************************* */


    //***************************************** POUR L'EDIT *************************************** */

    const [modalVisibleEdit , setModalVisibleEdit] = useState(false)

    //********************************************************************************************* */

    //*********************************** POUR LA LANGUE DU EDIT  *********************************** */


  const [espagnol , setEspagnol] = useState(false)
  const [anglais , setAnglais] = useState(false)
  const [francais , setFrancais] = useState(true)
  const [italien , setItalien] = useState(false)

  const handleLangue = (langue) => {
    if(langue == "italien"){
        setEspagnol(false);
        setAnglais(false);
        setFrancais(false);
        setItalien(true);
    }

    if(langue == "francais"){
        setEspagnol(false);
        setAnglais(false);
        setFrancais(true);
        setItalien(false);
    }

    if(langue == "anglais"){
        setEspagnol(false);
        setAnglais(true);
        setFrancais(false);
        setItalien(false);
    }

    if(langue == "espagnol"){
        setEspagnol(true);
        setAnglais(false);
        setFrancais(false);
        setItalien(false);
    }
  }


    //***************************** POUR LA LOCALISATION AVEC L'EDIT *************************************************************** */

    const [userLocation , setUserLocation] = useState({});
    const [adressUser , setAdressUser] = useState({});
  
    const[issueLocalisation , setIssueLocalisation] = useState(false)
    
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0;
    };
  
    const _getLocation = async () => {
  
          const { status } = await Location.requestForegroundPermissionsAsync();
  
          if(status !== 'granted'){
            console.log('permission not granted')
            alert('permission not granted')
          }
      
          var _userLocation = await Location.getCurrentPositionAsync();
          setTimeout(() => {  setUserLocation(_userLocation); }, 2000);
      
          if(isEmpty(userLocation)){//Dans ce cas c'est qu'il y a un beug et que userLocation ne c'est pas bien mit
              console.log("il y a un probleme ds userLocation donc on re fait le test");
              var _userLocation = await Location.getCurrentPositionAsync();
              setTimeout(() => {  setUserLocation(_userLocation); }, 2000);
          }
  
      
      
      console.log("here is the userLocation ",userLocation)
  
    }
  
    const _getAdress = async () => {
      //Je pense qu'on a juste besoin de mettre la meme adresse
      if(isEmpty(userLocation)){//Dans ce cas c'est qu'il y a un beug et que userLocation ne c'est pas bien mit
          console.log("il y a un probleme ds userLocation donc on re fait le test et cette fois ds _getAdress");
          setIssueLocalisation(true)
          return
          
      }
      try{
          const userAdress = await Location.reverseGeocodeAsync(userLocation.coords)
          setAdressUser(userAdress)
          setIssueLocalisation(false)
      }
      catch(e){
          console.log(e)
      }
     
    }
  
    const PressCurrentLocation = () => {
      _getLocation()
      .then(result =>  _getAdress())
     
    }

         //********************** POUR CHANGER LA LOCALISATION AVEC LA CARTE AVEC L'EDIT **************************/

    const [visibleModalMap , setVisibleModalMap] = useState(false)

    const [ pin, setPin ] = useState({
             latitude: 37.78825,
             longitude: -122.4324
         })
     
    const [ region, setRegion ] = useState({
         latitude: currentUser.lat,
         longitude: currentUser.lon,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421
         })
     
     
    const _getAdressMap = async () => {
    
         //Je pense qu'on a juste besoin de mettre la meme adresse
         const userAdress = await Location.reverseGeocodeAsync({"longitude" : region.longitude, "latitude":region.latitude})
         setAdressUser(userAdress)
     
         console.log(adressUser)
    
         setVisibleModalMap(false)
    
       }

       const handleLocalisation = () => {

        console.log("voici le userLocation : ",userLocation)
        console.log("voici le adressUser : ",adressUser)

        axios.post(ipAdress + '/profil/settingsChange/', {
          francais : francais,
          anglais : anglais,
          italien : italien,
          espagnol : espagnol,
          lat : userLocation["coords"]["latitude"],
          lon : userLocation["coords"]["longitude"],
          ville : adressUser[0]["city"],
          codePostale : adressUser[0]["postalCode"],
        }, {
          headers: {
            'Authorization': 'Token '+token
          }
      })
        .then(function (response) {
         setModalVisibleEdit(false)
        })
        .catch(function (error) {
          alert("erreur lors du changement de localisation")
          
        });
      }
       
    
    
    //*********************************************************************************************** */
    const styles = StyleSheet.create({
        container: {
          flex: 1,
        },
        slideContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        slide1: {
          backgroundColor: 'rgba(20,20,200,0.3)',
        },
        slide2: {
          backgroundColor: 'rgba(20,200,20,0.3)',
        },
        slide3: {
          backgroundColor: 'rgba(200,20,20,0.3)',
        }, 
        button: {
            height: 50,
            width: 150,
            backgroundColor: "#140078",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            shadowColor: "#8559da",
            shadowOpacity: 0.7,
            shadowOffset: {
              height: 4,
              width: 4,
            },
            shadowRadius: 5,
            elevation: 6,
          },
          text: {
            color: "purple",
            fontWeight: "600",
          },
      });
      
      const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
      }, []);

      //********************** POUR LE CALENDRIE AVEC L'EDIT ****************************** */

      const [ visibleModalCalendrie, setVisibleModalCalendrie] = useState(false);
      const [eventsParticipe , setEventsParticipe] = useState(false)

      const onModalCalendrie = () => {
        setVisibleModalCalendrie(!visibleModalCalendrie);

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
           
      }

      const renderItemCalendrie = ({item}) => {

        const getPicture = () => {
          if(item.event != null){
      
          for(var element in item.event.filesEvent){
            // console.log("voici l'element de getPicture : ",item.event.filesEvent[element])
            // console.log("seconde chance : ",element)
            if(item.event.filesEvent[element]["image"] != null){
              return[ipAdress + item.event.filesEvent[element]["image"],true]
            }
          }
          return[{},false]
      
          }
          else{
      
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

        const getNumberDay = () => {
          var nbDay = 0;

        }

        return(
          <TouchableOpacity onPress={() => navigation.navigate("seeEventIndividual" , {"item" : item})} style={{display:"flex",flexDirection:"row",height:50, padding:5,backgroundColor:"white",margin:5,borderRadius:15,justifyContent:"space-evenly",alignItems:"center"}}>
              {getPicture()[1] ?
                <Image
                  source={{
                    uri : String(getPicture()[0])
                  }}
                  onError ={(error)  => console.warn(error)}
                  style={{width:50,height:40,borderRadius:50}}
                />
                  :
                <Video                              
                  source={{uri: getVideo()[0]}}
                  style={{width:50,height:40,borderRadius:50}}
                  onError={(e) => console.log(e)}
                  repeat={false}
                  shouldPlay = {false}
                  isLooping = {false}
                  muted={true}
                  resizeMode="contain"
                  posterStyle={{ resizeMode: 'cover', height: '100%' }}
                />
              }
            
            <Text>
              {item.event.titre}
            </Text>
              <Text>
                  {item.event.dateComplete ?
                      item.event.dateComplete
                    :
                    item.event.dateDebut
                  }
              </Text>
          </TouchableOpacity>
            // <Text>{JSON.stringify(item)}</Text>
        )

      }


    return (
    <View style={{flex:1,backgroundColor:"transparent"}}>      

      
        <ImageHeaderScrollView
          maxHeight={330}
          minHeight={170}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} 
          //headerImage={require('../Image/addEvent.png')}
          
          renderFixedForeground={() => 
            (
            <View>

        <ImageBackground
            style={{width:"100%",height:"90%",resizeMode: "contain"}}
            source={{
                uri : "https://www.peuple-animal.com/data/document/2/1950.800.jpg"
                //uri: 'https://geo.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2FGEO.2Fvar.2Fgeo.2Fstorage.2Fimages.2Fmedia.2Fimages.2Fgirafe.2F2410391-1-fre-FR.2Fgirafe.2Ejpg/768x441/background-color/ffffff/quality/70/cinq-choses-que-vous-ne-saviez-pas-sur-la-girafe.jpg',
            }}
              >
          <Text style={{color:"white",fontSize:15,position:"absolute",top:3}}>Ayez toujours un cou d'avance ! ;)</Text>
        </ImageBackground>


            </View>
            )
          }
          renderForeground={() => (
            <View style={{width:"100%", height: "100%", padding:0,backgroundColor:"black"}}>

          <SwiperFlatList
                autoplay
                autoplayDelay={10}
                autoplayLoop
                //index={2}
                ref={(swiperRef)}
                showPagination
                data={listFilesWinker}
                renderItem={({ item, index }) => (
                  <TouchableOpacity  style={{width:Dimensions.get("window").width}}>
                
                      <ImageBackground
                        style={{width:Dimensions.get("window").width - 10,height:"100%",paddingTop:10,marginTop:5}}
                        resizeMode="contain"
                        source={{uri : String(item.picture)}}
                      >

                        <Pressable style={{display:"flex",flexDirection:"row",width:Dimensions.get("window").width - 5 ,height:"100%", backgroundColor:"transparent"}}>
                        <DoubleClick
                          singleTap={() => {
                            swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index - 1)%(listFilesWinker.length))})
                            }}
                          doubleTap={() => {
                            navigation.navigate('addOrDeletePicture' , {})
                            }}
                          delay={250}
                          style={{width:(Dimensions.get("window").width - 5) / 2,height:"100%" , backgroundColor:"transparent"}}
                        >

                            <TouchableOpacity>
                            </TouchableOpacity>

                        </DoubleClick>


                          <DoubleClick
                            singleTap={() => {
                              swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index + 1)%(listFilesWinker.length))})
                              }}
                            doubleTap={() => {
                              navigation.navigate('addOrDeletePicture' , {
              
                              })
                              }}
                            delay={250}
                            style={{width:(Dimensions.get("window").width - 5) / 2,height:"100%" , backgroundColor:"transparent"}}
                          >

                            <TouchableOpacity>
                            </TouchableOpacity>


                          </DoubleClick>

                        </Pressable>
                    </ImageBackground>  

                  </TouchableOpacity>

                  )}
                  keyExtractor={item => item.id}   
              />
                {/* <FlatList
                    horizontal={true}
                    ref={(swiperRef)}
                    contentContainerStyle={{display:"flex",flexDirection:"row",backgroundColor:"black"}}
                    data={listFilesWinker}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity  style={{width:Dimensions.get("window").width}}>
                     
                          <ImageBackground
                            style={{width:Dimensions.get("window").width - 10,height:"100%",paddingTop:10,marginTop:5}}
                            resizeMode="contain"
                            source={{uri : String(item.picture)}}
                          >

                            <Pressable style={{display:"flex",flexDirection:"row",width:Dimensions.get("window").width - 5 ,height:"100%", backgroundColor:"transparent"}}>
                            <DoubleClick
                              singleTap={() => {
                                swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index - 1)%(listFilesWinker.length))})
                                }}
                              doubleTap={() => {
                                navigation.navigate('addOrDeletePicture' , {})
                                }}
                              delay={250}
                              style={{width:(Dimensions.get("window").width - 5) / 2,height:"100%" , backgroundColor:"transparent"}}
                            >

                                <TouchableOpacity>
                                </TouchableOpacity>

                            </DoubleClick>


                              <DoubleClick
                                singleTap={() => {
                                  swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index + 1)%(listFilesWinker.length))})
                                  }}
                                doubleTap={() => {
                                  navigation.navigate('addOrDeletePicture' , {
                  
                                  })
                                  }}
                                delay={250}
                                style={{width:(Dimensions.get("window").width - 5) / 2,height:"100%" , backgroundColor:"transparent"}}
                              >

                                <TouchableOpacity>
                                </TouchableOpacity>


                              </DoubleClick>
              
                            </Pressable>
                        </ImageBackground>  
       
                      </TouchableOpacity>
         
                      )}
                      keyExtractor={item => item.id}        
                      />    */}
                
            </View>
          )}
        >
          
    <ScrollView style={{ height: 1000 }}>

      <TriggeringView onHide={() => alert('text hidden')}>
                
        <Pressable style={{width:"100%",backgroundColor:'transparent',borderRadius:25,paddingLeft: 15,paddingRight:15}}>
            
            {refreshing &&
              <ActivityIndicator style={ {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop:100
                  }} size="large" color="black" />
            }
        
                <View style={{display:"flex",flexDirection:"column",justifyContent:"space-around",}}>
                    <Text style={{fontSize:20,marginTop:7}}> {currentUser.username} {getAge(currentUser.birth)} </Text>
                    
                    <Pressable onPress={()=>setWantModificateEtudeBio(true)}>
                        <Text style={{color:'black',fontSize:20,marginTop:7}}><Entypo name="book" size={20} style={{color:'black',marginLeft:8,marginRight:8}} />{currentUser.etude}</Text>
                    </Pressable>

                    <Pressable style={{marginTop:10,backgroundColor:"transparent" , width: 50, height:30, position:"absolute",right:8}}>
                        <Entypo name="arrow-long-up" size={50} style={{color:'purple'}} />
                    </Pressable>
                    
      
                </View>

                <View style={{borderColor:"black",borderWidth:1,borderRadius:20}}>
                    <Text></Text>
       

                    <Text onPress={() => setWantModificateEtudeBio(true)} style={{color:"black",fontSize:20 ,fontStyle: 'italic' , lineHeight:36,paddingLeft:10,paddingRight:5,marginTop:-8}}>
                        {currentUser.bio}___
                        <Entypo name="pencil" size={30}  style={{color:'black',marginTop:8,marginLeft:20,marginRight:30}} />
                    </Text>
                </View>
             
                                    
        </Pressable>


        <View style={{flexDirection:"row",backgroundColor:'transparent',justifyContent:"space-around",padding:10}} >
            <TouchableOpacity onPress={() => onModalCalendrie()}>
                <MaterialIcons name="event" size={50} style={{color:'black',marginTop:8,marginLeft:8}} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("seeEventsIndex")} style={{alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"black",borderRadius:20,padding:3,backgroundColor:"rgb(220, 231, 240)"}}>
                <Text>MES EVENTS</Text>
            </TouchableOpacity>
          
            <TouchableOpacity
             //onPress={() => navigation.navigate("settings") } 
             onPress={() => setModalVisibleEdit(true)}
             >
              <Text style={{position:"absolute",marginTop:13,marginRight:4}}>Edit</Text>
                <AntDesign name="edit" size={50} style={{color:'black',marginTop:8,marginLeft:8}} />
            </TouchableOpacity>
        </View>

        <Pressable
         //onPress={() => addOrSupressIcons()}
          style={{borderColor:"black", borderRadius:20, borderWidth:1}}>
            <Text style={{fontSize:30}}>Vos <AntDesign name="heart" size={30} style={{color:'red',marginTop:8,marginLeft:8}} /> :</Text>
            <Text>(influence votre fil d'actualité)</Text>

            <View style={{backgroundColor:'transparent',display:'flex',flexWrap:"wrap",flexDirection:"row"}}>
                <FlatList
                    data={dataPreference}
                    renderItem={renderItemGout}
                    keyExtractor={item => item.id}
                    numColumns={3}
                />
            </View>        
        </Pressable>

        {/* Modal pour voir ce que l'on aime */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleIcons}
        >

                <View style={{flex:1,backgroundColor:"transparent"}} >

                <Pressable  onPress={() => closeAndUpdateModalIcon()}  style={{height:300,weight:"100%",backgroundColor:'transparent'}}>
                </Pressable>
                    
                    <View style={{flex:5}}>
                      <View style={{backgroundColor:'grey', flex:4,borderRadius:25,display:"flex",flexWrap:"wrap"}}>

                    {iconVoyage &&
                        <Text onPress={() => setIconVoyage(!iconVoyage)}   style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <FontAwesome name="plane" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Voyage</Text>
                    }
                    {!iconVoyage &&
                        <Text onPress={() => setIconVoyage(!iconVoyage)}  style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <FontAwesome name="plane" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Voyage</Text>
                    }


                    {iconFootball &&
                        <Text  onPress={() => setIconFootball(!iconFootball)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <FontAwesome name="soccer-ball-o" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Football</Text>
                    }
                    {!iconFootball &&
                        <Text  onPress={() => setIconFootball(!iconFootball)}  style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <FontAwesome name="soccer-ball-o" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Football</Text>
                    }


                   {iconBasket &&
                        <Text onPress={() => setIconBasket(!iconBasket)}   style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <FontAwesome5 name="basketball-ball" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Basket</Text>
                    }
                    {!iconBasket &&
                        <Text onPress={() => setIconBasket(!iconBasket)}  style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <FontAwesome5 name="basketball-ball" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Basket</Text>
                    }


                    {iconGame &&       
                        <Text onPress={() => setIconGame(!iconGame)}   style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <Entypo name="game-controller" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />E Game</Text>
                    }
                    {!iconGame &&
                        <Text onPress={() => setIconGame(!iconGame)}   style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <Entypo name="game-controller" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />E Game</Text>
                    }


                    {iconCulture &&
                        <Text onPress={() => setIconCulture(!iconCulture)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <FontAwesome5 name="book-reader" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Culture</Text>
                    }
                    {!iconCulture &&
                        <Text onPress={() => setIconCulture(!iconCulture)}   style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <FontAwesome5 name="book-reader" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Culture</Text>
                    }


                    {iconParty &&
                        <Text onPress={() => setIconParty(!iconParty)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}><MaterialCommunityIcons name="party-popper" size={20} style={{color:'white',marginTop:8,marginLeft:8}} /> Party !</Text>
                    }
                    {!iconParty &&
                        <Text onPress={() => setIconParty(!iconParty)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}><MaterialCommunityIcons name="party-popper" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Party !</Text>
                    }

                    {iconManger &&
                        <Text onPress={() => setIconManger(!iconManger)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <FontAwesome5 name="hamburger" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Manger</Text>
                    }
                    {!iconManger &&
                        <Text onPress={() => setIconManger(!iconManger)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <FontAwesome5 name="hamburger" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Manger</Text>
                    }

                    {iconChill &&
                        <Text onPress={() => setIconChill(!iconChill)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <MaterialCommunityIcons name="movie-open" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Chill / Movie</Text> 
                    }
                    {!iconChill &&
                        <Text onPress={() => setIconChill(!iconChill)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <MaterialCommunityIcons name="movie-open" size={20} style={{color:'white',marginTop:8,marginLeft:8}} />Chill / Movie</Text> 
                    }
                    
                    {iconMusic &&
                        <Text onPress={() => setIconMusic(!iconMusic)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}> <FontAwesome name="music" size={20} style={{color:'white',marginTop:8,marginLeft:8}} /> Music</Text> 
                    }
                    {!iconMusic &&
                        <Text onPress={() => setIconMusic(!iconMusic)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}>  <FontAwesome name="music" size={20} style={{color:'white',marginTop:8,marginLeft:8}} /> Music</Text>
                    }

                    {iconSport &&
                        <Text onPress={() => setIconSport(!iconSport)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white",backgroundColor:"green"}}><MaterialCommunityIcons name="weight-lifter" size={20} style={{color:'white',marginTop:8,marginLeft:8}} /> Sport</Text> 
                    }
                    {!iconSport &&
                        <Text onPress={() => setIconSport(!iconSport)} style={{margin:5,borderRadius:5,borderWidth:1,width:90,height:50,color:"white"}}> <MaterialCommunityIcons name="weight-lifter" size={20} style={{color:'white',marginTop:8,marginLeft:8}} /> Sport</Text>
                    }
                        </View>
                    </View>
                    
                  <Pressable  onPress={() => closeAndUpdateModalIcon()}  style={{height:280,weight:"100%",backgroundColor:'transparent'}}>
                  </Pressable>

                </View>


            
        </Modal>

      </TriggeringView>


    </ScrollView>



        </ImageHeaderScrollView>

          {/* Modal pour la modification des etudes et de la bio */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={wantModificateEtudeBio}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >

                <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38}}>
                    
                <TouchableOpacity onPress={() => setWantModificateEtudeBio(false)}  style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    <View style={{backgroundColor:'grey', flex:3,borderRadius:45, borderWidth : 4,alignItems:"center"}}>
                      <Text style={{alignItems:"center"}}>Changer votre bio :</Text>
                      <TextInput
                        style={{width:widthScreen /1.2,height:150,backgroundColor:"#f1f3f6",paddingHorizontal:10,borderRadius:20}}
                        placeholder="Ecrivez ici votre nouvelle bio !"
                        textAlign='center'
                        placeholderTextColor={"black"}
                        onChangeText={(text) => setNewBio(text)}
                      />
                      <TouchableOpacity onPress={() =>handleModificationBio()}  style={{elevation: 8,backgroundColor: "white",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                          <Text style={{fontSize: 18,color: "black",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}>Modifier la bio</Text>
                      </TouchableOpacity>

                      <Text>Changer vos études :</Text>
                      <View style={{borderColor:"black",width:"80%",justifyContent:"center",alignItems:"center",borderWidth:1}}>
                      <TextInput
                        style={{width:widthScreen /1.2,height:150,backgroundColor:"#f1f3f6",paddingHorizontal:10,borderRadius:20}}
                        placeholder="Ecrivez ici votre nouvelle bio !"
                        textAlign='center'
                        placeholderTextColor={"black"}
                        onChangeText={(text) => setNewEtude(text)}
                      />
                                    
                      </View>
                      <TouchableOpacity onPress={() =>handleModificationEtude()} style={{elevation: 8,backgroundColor: "white",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                          <Text style={{fontSize: 18,color: "black",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}>Modifier les études</Text>
                      </TouchableOpacity> 

                    </View>

                    <TouchableOpacity onPress={() => setWantModificateEtudeBio(false)}  style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    
                </View>

        </Modal>

          {/* Modal pour les follows ! */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleFollow}
                onRequestClose={() => {
                alert("Modal has been closed.");
                }}
            >

                <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38}}>
                    
                <TouchableOpacity onPress={onModalFollow} style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    <View style={{backgroundColor:'white', flex:3,borderRadius:45, borderWidth : 4}}>
                     
                      <View>

                        {seeFollower &&
                          <FlatList
                            data={dataFollower}
                            renderItem={renderItemFollower}
                            keyExtractor={item => item.id}
                          />
                        }

                        {seeFollowing &&
                         
                          <FlatList
                            data={dataFollowing}
                            renderItem={renderItemFollowing}
                            keyExtractor={item => item.id}
                          />
                   
                        }
                       
                      </View>
                      
                      <TouchableOpacity style={{position:"absolute",borderRadius:12,bottom : 5,flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",marginLeft:20,width:"90%",height:70}}>
                       
                        <Pressable style={{flex:1,height:70,marginRight:5,backgroundColor:"black",alignItems:"center",justifyContent:"center",borderRadius:12}} onPress={() => handleVisibleFollow("follower")}> 
                            <Text style={{color:"white"}}>{numberFollower} follower</Text>
                        </Pressable>

                        <Pressable style={{flex:1,height:70,backgroundColor:"black",alignItems:"center",justifyContent:"center",borderRadius:12}}  onPress={() => handleVisibleFollow("following")}> 
                            <Text style={{color:"white"}}>{numberFollowing} following</Text> 
                        </Pressable>

                      </TouchableOpacity>
                        
                    </View>


                  <TouchableOpacity onPress={onModalFollow} style={{flex:0.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

                    
                </View>

        </Modal>


          {/* Modal pour edit */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleEdit}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleEdit(false)} style={{flex:1.9,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View
                      refreshControl={
                          <RefreshControl
                            onRefresh={() => setModalVisibleEdit(false)}
                            />
                      }
                      style={{backgroundColor:'grey', flex:3.3,borderRadius:25}}>

                        <Text></Text>

                           {/* BOUTON DE MODIFICATION  */}
                          <TouchableOpacity  onPress={() => setWantModificateEtudeBio(true)}  style={{elevation: 8,backgroundColor: "rgb(185, 179, 179)",borderRadius: 10,paddingVertical: 7,paddingHorizontal: 12,margin:2}}>
                              <Text style={{fontSize: 15,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Modifier ma bio / étude</Text>
                          </TouchableOpacity>

                          <TouchableOpacity   onPress={() =>  navigation.navigate('addOrDeletePicture' , {})}  style={{elevation: 8,backgroundColor: "rgb(185, 179, 179)",borderRadius: 7,paddingVertical: 10,paddingHorizontal: 12,margin:2}}>
                              <Text style={{fontSize: 15,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Modifier mes photos </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity   onPress={() =>  navigation.navigate("firstPreference")}  style={{elevation: 8,backgroundColor: "rgb(185, 179, 179)",borderRadius: 7,paddingVertical: 10,paddingHorizontal: 12,margin:2}}>
                              <Text style={{fontSize: 15,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Modifier mes gouts </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity    onPress={() => setModalVisibleFollow(true)}  style={{elevation: 8,backgroundColor: "rgb(185, 179, 179)",borderRadius: 7,paddingVertical: 10,paddingHorizontal: 12,margin:2}}>
                              <Text style={{fontSize: 15,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Voir les follows </Text>
                          </TouchableOpacity>

                          <View style={{backgroundColor:'transparent', flex:2,borderWidth:1, borderColor:"black",borderRadius:8}}>
                            
                            <Text style={{fontSize:18,padding:5}}>Derniere localisation : {currentUser.city}</Text>
                    
                            <Pressable  style={{flex:0.40,padding:5}}>
                                        
                                {issueLocalisation &&
                                  <Text style={{color:"red"}}>Probleme lors de votre location, veuillez réappuyer </Text>
                                }
                                <View style={{display:"flex",flexDirection:"row"}}>
                                  <Text style={{fontSize:18}}>Utiliser votre position actuelle : </Text>
                                  <TouchableOpacity onPress={() => PressCurrentLocation()} style={{backgroundColor: "rgb(185, 179, 179)",borderRadius: 10,justifyContent:"center",alignItems:"center",width:35,height:35}}>
                                      <MaterialIcons name="place" size={15}  style={{color:'purple'}} />
                                  </TouchableOpacity>
                                </View>
                              
                                <Text style={{color:"purple"}}>  
                                    {adressUser[0] &&
                                        <Text style={{marginTop : 50}}>Localisation : {JSON.stringify(adressUser[0].city)}</Text>
                                    }
                                </Text>

                              
                            
                            </Pressable>

                            <Pressable onPress={() => PressCurrentLocation()}   style={{flex:0.40,borderRadius:12,padding:5}}>
                          

                                <View style={{display:"flex",flexDirection:"row"}}>
                                  <Text style={{fontSize:18}}>Utiliser une autre position : </Text>
                                  <TouchableOpacity onPress={() => setVisibleModalMap(true)} style={{backgroundColor: "rgb(185, 179, 179)",borderRadius: 10,justifyContent:"center",alignItems:"center",width:35,height:35}}>
                                      <MaterialIcons name="place" size={15}  style={{color:'purple'}} />
                                  </TouchableOpacity>
                                </View>


                                <Text style={{color:"purple"}}>
                                    {adressUser[0] &&
                                        <Text style={{marginTop : 50}}>Localisation : {JSON.stringify(adressUser[0].city)}</Text>
                                    }
                                </Text>

                            </Pressable>

                            {adressUser[0] &&
                              <TouchableOpacity onPress={() => handleLocalisation()} style={{backgroundColor:"green",width:60,padding:2,height:40,position:"absolute",justifyContent:"center",borderRadius:10,bottom:3,alignItems:"center",right:12}}>
                                <Text style={{color:"white",zIndex:1,alignItems:"flex-end",fontSize:15}}>Valider</Text>
                              </TouchableOpacity>
                            }

                          </View>
                            
                            {/* POUR LA LANGUE  */}
                          <View style={{flex:1,display:"flex",flexDirection:"row",borderWidth:1,borderColor:"purple",justifyContent:"center",alignItems:"center"}}>
                            <View style={{flex:1}}>
                                <Text>Langue : </Text>
                            </View>
                            <View style={{flex:2, flexDirection:"row",justifyContent:"space-around",padding:10}}>

                                <Pressable  onPress={() => handleLangue("francais")}>
                                    <Image
                                        style={{width: 50,height:30,opacity: francais ? 1 : 0.3 }}
                                        source={{
                                            uri: ipAdress + "/media/Drapeaux/france.png",
                                        }}
                                    />
                                </Pressable>
                                
                                <Pressable  onPress={() => handleLangue("anglais")}>
                                    <Image
                                        style={{width: 50,height:30,opacity: anglais ? 1 : 0.3 }}
                                        source={{
                                        uri: ipAdress + "/media/Drapeaux/uk.png",
                                        }}
                                    />            
                                </Pressable>
                                
                                <Pressable  onPress={() => handleLangue("italien")}>
                                    <Image
                                        style={{width: 50,height:30,opacity: italien ? 1 : 0.3 }}
                                        source={{
                                            uri: ipAdress + "/media/Drapeaux/italie.png",
                                        }}
                                    />
                                </Pressable>
                                
                                <Pressable  onPress={() => handleLangue("espagnol")}>
                                    <Image
                                        style={{width: 50,height:30,opacity: espagnol ? 1 : 0.3 }}
                                        source={{
                                            uri: ipAdress + "/media/Drapeaux/espagne.jpg",
                                        }}
                                    />
                                </Pressable>
                            
                            </View>
                          </View>
                    
                    </View>

    
                        
                    
                </View>
            
        </Modal>


                   {/* Pour changer la localisation avec la CARTE */}
      <Modal
                animationType="slide"
                transparent={true}
                visible={visibleModalMap}
                onRequestClose={() => {
                alert("Modal has been closed.");
                setVisibleModalMap(false)
                }}
            >

                <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38}}>
                    
      <GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
        GooglePlacesDetailsQuery={{
          rankby: "distance",
          fields: 'geometry',
        }}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
          console.log(details.geometry)
          setUserLocation({
            "latitude": details.geometry.location.lat,
            "longitude": details.geometry.location.lng,
          })
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					})
				}}
				query={{
					key: apiKey,
					language: "fr",
					components: "country:fr",
					types: "(cities)",
					radius: 30000,
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1,backgroundColor:"black" },
					listView: { backgroundColor: "red" }
				}}
			/>
			<MapView
				style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height - 45
        }}
				initialRegion={{
					latitude: region.latitude,
					longitude: region.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421
				}}
				provider="google"
			>
        
				<Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
				<Marker
					coordinate={pin}
					pinColor="black"
					draggable={true}
					onDragStart={(e) => {
						console.log("Drag start", e.nativeEvent.coordinates)
					}}
					onDragEnd={(e) => {
						setPin({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude
						})
					}}
				>
					<Callout>
						<Text style={{color:"red",fontSize:30}}>I'm here</Text>

					</Callout>
				</Marker>
    
			</MapView>
      <Circle
          center={
            {longitude:region.longitude,
            latitude:region.latitude}
          }
          radius={60}
          strokeColor="blue"

          />

            <TouchableOpacity onPress={() => _getAdressMap()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5,marginBottom:100}}>
                <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Valider !</Text>
            </TouchableOpacity>
  
				<Circle center={pin} radius={1000} />
                    
                </View>

      </Modal>

       
     {/* Pour le calendrie */}

     <Modal
        animationType="slide"
        transparent={true}
        visible={visibleModalCalendrie}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >

            <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>           
              <TouchableOpacity style={{flex:1}} onPress={() => setVisibleModalCalendrie(false)}></TouchableOpacity>

              <View style={{flex:2,backgroundColor:"grey",borderRadius:30}}>
                {/* <Text>
                  {JSON.stringify(listParticipeWinker)}
                </Text>   */}
                <View style={{height:80,padding:10,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{fontSize:20}}>Calendrie !</Text>
                </View>

                <FlatList
                  refreshControl={
                    <RefreshControl
                      onRefresh={() => setVisibleModalCalendrie(false)}
                    />
                  }
                  data={listParticipeWinker}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItemCalendrie}// ici, on definie ce qui va apparaitre dans les props de notre EentItem
                />
              </View>
          
          </View>
      </Modal>


    </View>
    );
  }

const seeEventIndividual = ({routes}) => {
  const {item} = route.params;
  return(
    <View style={{flex:1}}>
    <Text style={{color:"red"}}>
      {JSON.stringify(item)}
    </Text>
    </View>
  )
}


//**************************************************************************************************** */
//                                                                                                     //
//                                       PAGE POUR LES FIRSTPREFRENCES                                                 //
//                                                                                                     //
//**************************************************************************************************** */



function firstPreference({ navigation, route, props }){

  //*****************POUR LE REDUX **************************/

const ipAdress = useSelector((state) => state.ipAdress);
const token = useSelector((state) => state.token);
const currentUser = useSelector((state) => state.currentUser);
const dataPreference = useSelector((state) => state.dataPreference);

const dispatch = useDispatch();

//********************************************************* */

const margin = 16;
const borderRadius = 5;
const width = Dimensions.get("window").width / 2 - margin * 2;
const [opacity, setOpacity] = useState(0.3);
const [pressedSport , setPressedSport] = useState(false);
const [pressedSoiree , setPressedSoiree] = useState(false);
const [pressedNourriture , setPressedNourriture] = useState(false);
const [pressedCulture , setPressedCulture] = useState(false);
const [pressedVoyage , setPressedVoyage] = useState(false);
const[pressedManifestation , setPressedManifestation] = useState(false);
const[pressedHumanitaire , setPressedHumanitaire] = useState(false);
const[pressedVisiter , setPressedVisiter] = useState(false);
const[pressedGratuit , setPressedGratuit] = useState(false);
const[pressedInsolite , setPressedInsolite] = useState(false);
const[pressedAttraction , setPressedAttraction] = useState(false);
const[pressedAutre , setPressedAutre] = useState(false);


const [listPreference , setListPreference] = useState([]);

const getPreferenceUser = () => {

  axios.post(ipAdress + '/profil/getPreferenceUser/', {
    userId:currentUser.id,
  }, {
    headers: {
      'Authorization': 'Token '+token
    }
})
  .then(function (response) {

    console.log("reponse de getPreferenceUser")
    
    dispatch(setDataPreference(response.data.listTrueAttribute))
         
  })
  .catch(function (error) {
    console.log(error);
  });

}

const goSuivant = () => {


  console.log("voici la liste  listPreference : ",listPreference)

  axios.post(`${ipAdress}/profil/firstPreference/`, {
    listPreference : listPreference
    }, {
      headers: {
        'Authorization': 'Token '+token
      }
  })
    .then(function (response) {

      getPreferenceUser()
      navigation.navigate('Profil')
     
    })
    .catch(function (error) {
      
      console.log(error);
    });

}

const handlePressPreference = (boolPreference , preference) => {

  // console.log("je suis dans handlePressPreference")
  // console.log("voici le boolean : ",boolPreference)
  // console.log("voici le name : ",preference)

  if(!boolPreference){
    setListPreference(oldArray => [...oldArray , preference])
  }
  else{
    var newList = []
    listPreference.forEach(function (element, index) {
 
      if (element !== preference) {
          newList.push(element)
      }

    });

    setListPreference(newList)
   
  }
}

const contains = (el , list) => {
  for(const element of list){
    if(element == el){
      return true;
    }
  }
  return false;
}
//****************************************************************************************** */

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

//****************************************************************************************** */
const renderItem = ({item}) => {

  return(
    <Pressable onPress={() =>  handlePressPreference(contains(item.name , listPreference) , item.name)} style={{flexDirection:'row' , height: 70 , borderRadius:5 , borderWidth : 1 , borderColor : "black",justifyContent:"center" , alignItems:"center",margin:5, backgroundColor : contains(item.name , listPreference) ? "green" : "transparent"}}>
      <Text style={{fontSize:20}}>{item.name}</Text>
    </Pressable>
  )
}

const [visibleModalCulture , setVisibleModalCulture] = useState(false);
const [dataCulture , setDataCulture] = useState([
  {
    "id":1,
    "name":"Jeux_de_société",
  },
  {
    "id":2,
    "name":"Musée",
  },
  {
    "id":3,
    "name":"Cinéma",
  },
  {
    "id":4,
    "name":"Manga",
  },
  {
    "id":5,
    "name":"Dessin",
  },
  {
    "id":6,
    "name":"Dance",
  },
  {
    "id":7,
    "name":"Musique",
  },
  {
    "id":8,
    "name":"Concert",
  },
  {
    "id":9,
    "name":"Festival",
  },
  {
    "id":10,
    "name":"Spectacle_humoristique",
  },
  {
    "id":11,
    "name":"Cirque",
  },
  {
    "id":12,
    "name":"Lecture",
  },
  {
    "id":13,
    "name":"Autre_Culture"
  },
])

const [visibleModalSport , setVisibleModalSport] = useState(false);
const [dataSport , setDataSport] = useState([
  {
    "id":1,
    "name":"Foot",
  },
  {
    "id":2,
    "name":"Basket",
  },
  {
    "id":12,
    "name":"Musculation",
  },
  {
    "id":3,
    "name":"Tennis",
  },
  {
    "id":4,
    "name":"HandBall",
  },
  {
    "id":5,
    "name":"VolleyBall",
  },
  {
    "id":6,
    "name":"Vélo",
  },
  {
    "id":7,
    "name":"Sport_de_combat",
  },
  {
    "id":8,
    "name":"Randonné",
  },
  {
    "id":9,
    "name":"Sport_extrême",
  },
  {
    "id":10,
    "name":"Badminton",
  },
  {
    "id":11,
    "name":"Patinoire",
  },

  {
    "id":13,
    "name":"Autre_Sport"
  },
])

const [visibleModalArcade , setVisibleModalArcade] = useState(false);
const [dataArcade , setDataArcade] = useState([
  {
    "id":1,
    "name":"Escape_Game"
  },
  {
    "id":2,
    "name":"Bowling"
  },
  {
    "id":3,
    "name":"Laser_Game"
  },
  {
    "id":4,
    "name":"Billard"
  },
  {
    "id":5,
    "name":"Karaoké"
  },
  {
    "id":6,
    "name":"Autre_Arcade"
  }
])

const [visibleModalSoirée , setVisibleModalSoirée] = useState(false);
const [dataSoirée, setDataSoirée] = useState([
  {
    "id":1,
    "name":"Rave_party"
  },
  {
    "id":2,
    "name":"Erasmus"
  },
  {
    "id":3,
    "name":"After"
  },
  {
    "id":4,
    "name":"Latino"
  },
  {
    "id":5,
    "name" : "Autre_Soiree"
  }
])

const [visibleModalGame , setVisibleModalGame] = useState(false);
const [dataGame , setDataGame] = useState([
  {
    "id":1,
    "name":"Jeux_de_sport"
  },
  {
    "id":2,
    "name":"Jeux_de_stratégie"
  },
  {
    "id":3,
    "name":"Jeux_de_guerre"
  },
  {
    "id":4,
    "name":"Autre_Jeux"
  },
])

const [visibleModalPorteOuverte , setVisibleModalPorteOuverte] = useState(false);
const [dataPorteOuverte , setDataPorteOuverte] = useState([
  {
    "id":1,
    "name":"Santé",
  },
  {
    "id":2,
    "name":"Dessin"
  },
  {
    "id":3,
    "name":"Géopolitique"
  },
  {
    "id":4,
    "name":"Science"
  },
  {
    "id":5,
    "name":"Etudiant"
  },
])

//****************************************************************************************** */

 const styles = StyleSheet.create({
  container: {
    width,
    height: width * 1.3,
    marginTop: 16,
    justifyContent:"center",
    alignItems:"center",
    borderRadius,
  },
  textOnImage: {
    color:"black",
    fontSize:25,
    position:'absolute',
    marginTop:0,
    zIndex:1,
    textAlign:'center'
  },

  image: {
  ...StyleSheet.absoluteFillObject,
  width: undefined,
  height: undefined,
  resizeMode: "cover",
  borderRadius,
  },
  button: {
  width:"50%",
  margin:5,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'purple',
  },
  buttonValider: {
      width:"50%",
      margin:5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'green',
  },
  text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
  },
});


  return(
    <View style={{flex:1 , backgroundColor:"rgb(156, 161, 161)"}}>
      
      <View style={{marginTop:40 , borderColor:"black", borderWidth:1}}>
          <Text style={{fontSize:25 , fontStyle:'italic',textAlign:"center"}}>Choisissez les thèmes que vous aimez pour améliorer nos propositions ! :)</Text>
      </View>
      
      <ScrollView>
          <View style={ {flexDirection: "row",flexWrap: "wrap",justifyContent: "space-evenly",}}>

              <Pressable onPress={() => {
                    setVisibleModalSoirée(true);
                    setPressedSoiree(!pressedSoiree);      
                  }
              
                }> 
                  <View style={{...styles.container, opacity : pressedSoiree ? 1 : 0.3 }}>
                      <Text style={styles.textOnImage}>Nos soirées</Text>
                      <Image source={require("../Filtre/Image/soireePreference.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() =>{
                  setPressedNourriture(!pressedNourriture)
                  handlePressPreference(pressedNourriture, "Nouriture")
                  }}> 
                  <View style={{...styles.container, opacity : pressedNourriture ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Nouriture</Text>
                      <Image source={require("../Filtre/Image/Nouriture.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() =>{
                  setVisibleModalCulture(true)
                  setPressedCulture(!pressedCulture)
                }}>

                  <View style={{...styles.container, opacity : pressedCulture ? 1 : 0.3}}>
                  <Text style={styles.textOnImage}>Culture</Text>
                      <Image source={require("../Filtre/Image/culturePreference.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setVisibleModalSport(true)
                setPressedSport(!pressedSport)
              }}> 

                  <View style={{...styles.container, opacity : pressedSport ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Sport</Text>
                      <Image source={require("../Filtre/Image/sportPreference.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedHumanitaire(!pressedHumanitaire)
                handlePressPreference(pressedHumanitaire, "Humanitaire")
              }}> 

                  <View style={{...styles.container, opacity : pressedHumanitaire ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Humanitaire</Text>
                      <Image source={require("../Filtre/Image/Humanitaire.png")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedManifestation(!pressedManifestation)
                handlePressPreference(pressedManifestation, "Manifestation")
              }}> 
              
                  <View style={{...styles.container, opacity : pressedManifestation ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Manifestation</Text>
                      <Image source={require("../Filtre/Image/Manifestation.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedVisiter(!pressedVisiter)
                handlePressPreference(pressedVisiter, "Visiter")
              }}> 
              
                  <View style={{...styles.container, opacity : pressedVisiter ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Lieu à visiter</Text>
                      <Image source={require("../Filtre/Image/Visiter.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedGratuit(!pressedGratuit)
                handlePressPreference(pressedGratuit, "Gratuit")
              }}> 
              
                  <View style={{...styles.container, opacity : pressedGratuit ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Gratuit</Text>
                      <Image source={require("../Filtre/Image/Gratuit.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedInsolite(!pressedInsolite)
                handlePressPreference(pressedInsolite, "Insolite")
              }}> 
              
                  <View style={{...styles.container, opacity : pressedInsolite ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Evenement insolite</Text>
                      <Image source={require("../Filtre/Image/Insolite.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedAttraction(!pressedAttraction)
                handlePressPreference(pressedAttraction, "Attraction")
              }}> 
              
                  <View style={{...styles.container, opacity : pressedAttraction ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Attraction</Text>
                      <Image source={require("../Filtre/Image/Attraction.jpg")}  style={styles.image}  />
                  </View>
                  
              </Pressable>

              <Pressable onPress={() => {
                setPressedVoyage(!pressedVoyage);
                handlePressPreference(pressedVoyage, "Voyage");
              }}> 
                  <View style={{...styles.container, opacity : pressedVoyage ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Voyage</Text>
                      <Image source={require("../Filtre/Image/voyagePreference.jpg")}  style={styles.image}  />
                  </View>
              </Pressable>

              <Pressable onPress={() => {
                setPressedAutre(!pressedAutre)
                handlePressPreference(pressedAttraction, "Autre")
              }}> 
              
                  <View style={{...styles.container, opacity : pressedAutre ? 1 : 0.3}}>
                      <Text style={styles.textOnImage}>Autre</Text>
                      <Image source={require("../Filtre/Image/Autre.png")}  style={styles.image}  />
                  </View>
                  
              </Pressable>
          
          </View>
      </ScrollView>

      <View style={{flexDirection:'row',justifyContent:"space-evenly"}}>
        <TouchableOpacity
        onPress={() => navigation.navigate('Profil')}
        style={{backgroundColor:"red",padding:15, width:widthScreen/3, borderRadius:10,alignItems:"center",justifyContent:"center"}}>
          <Text>Annuler</Text>
        </TouchableOpacity>
        {listPreference.length != 0 &&
          <TouchableOpacity
            onPress={() => goSuivant()} 
            style={{backgroundColor:"green",padding:15, width:widthScreen/3, borderRadius:10,alignItems:"center",justifyContent:"center"}}>
            <Text>Valider</Text>
          </TouchableOpacity>
          }

      </View>


          {/* Pour la culture */}
      <Modal
                  animationType="slide"
                  transparent={true}
                  visible={visibleModalCulture}
                  onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                  }}
              >
                  <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                      
                      <TouchableOpacity onPress={() => setVisibleModalCulture(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                  
                      <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{height:10}}>

                        </View>

                          <FlatList
                              refreshControl={
                                  <RefreshControl
                                      onRefresh={() => setVisibleModalCulture(false)}
                                  />
                              }
                              data={dataCulture}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              scrollEnabled={true}
                          />

                      </View>

                

                  </View>
              
      </Modal>

              {/* Pour le sport */}
      <Modal
                  animationType="slide"
                  transparent={true}
                  visible={visibleModalSport}
                  onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                  }}
              >
                  <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                      
                      <TouchableOpacity onPress={() => setVisibleModalSport(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                  
                      <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{height:10}}>

                        </View>

                          <FlatList
                              refreshControl={
                                  <RefreshControl
                                      onRefresh={() => setVisibleModalSport(false)}
                                  />
                              }
                              data={dataSport}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              scrollEnabled={true}
                          />

                      </View>

                

                  </View>
              
      </Modal>

            {/* Pour les soirées */}
      <Modal
                  animationType="slide"
                  transparent={true}
                  visible={visibleModalSoirée}
                  onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                  }}
              >
                  <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                      
                      <TouchableOpacity onPress={() => setVisibleModalSoirée(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                  
                      <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{height:10}}>

                        </View>

                          <FlatList
                              refreshControl={
                                  <RefreshControl
                                      onRefresh={() => setVisibleModalSoirée(false)}
                                  />
                              }
                              data={dataSoirée}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              scrollEnabled={true}
                          />

                      </View>

                

                  </View>
              
      </Modal>

            {/* Pour les jeux vidéos */}
      <Modal
                  animationType="slide"
                  transparent={true}
                  visible={visibleModalGame}
                  onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                  }}
              >
                  <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                      
                      <TouchableOpacity onPress={() => setVisibleModalGame(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                  
                      <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{height:10}}>

                        </View>

                          <FlatList
                              refreshControl={
                                  <RefreshControl
                                      onRefresh={() => setVisibleModalGame(false)}
                                  />
                              }
                              data={dataGame}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              scrollEnabled={true}
                          />

                      </View>

                

                  </View>
              
      </Modal>

            {/* Pour les arcades */}
      <Modal
                  animationType="slide"
                  transparent={true}
                  visible={visibleModalArcade}
                  onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                  }}
              >
                  <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                      
                      <TouchableOpacity onPress={() => setVisibleModalArcade(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                  
                      <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{height:10}}>

                        </View>

                          <FlatList
                              refreshControl={
                                  <RefreshControl
                                      onRefresh={() => setVisibleModalArcade(false)}
                                  />
                              }
                              data={dataArcade}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              scrollEnabled={true}
                          />

                      </View>

                

                  </View>
              
      </Modal>

            {/* Pour les portes ouvertes */}
      <Modal
                  animationType="slide"
                  transparent={true}
                  visible={visibleModalPorteOuverte}
                  onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                  }}
              >
                  <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                      
                      <TouchableOpacity onPress={() => setVisibleModalPorteOuverte(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                  
                      <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{height:10}}>

                        </View>

                          <FlatList
                              refreshControl={
                                  <RefreshControl
                                      onRefresh={() => setVisibleModalPorteOuverte(false)}
                                  />
                              }
                              data={dataPorteOuverte}
                              renderItem={renderItem}
                              keyExtractor={item => item.id}
                              scrollEnabled={true}
                          />

                      </View>

                

                  </View>
              
      </Modal>

    </View>
  )

}
























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