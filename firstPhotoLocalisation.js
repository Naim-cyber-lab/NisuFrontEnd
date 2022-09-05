
import { useDispatch, useSelector } from "react-redux";

import { setToken } from "./store";
import { setIsLoggedIn } from "./store";
import { setFirstPhotoLocalisation } from "./store";
import { setCurrentUser } from "./store";

import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker'

import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo,useCallback} from 'react';

import axios from 'axios';

import {View,Text, Pressable, ScrollView, Image, StyleSheet, Dimensions , Button, TextInput, ImageBackground} from 'react-native';


function firstPhotoLocalisation({ navigation, route, props }){

//*********************************POUR LE REDUX **********************************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
  
    const dispatch = useDispatch();
  
//******************************* POUR LA LOCALISATION **************************************** */

   const [userLocation , setUserLocation] = useState({});
   const [adressUser , setAdressUser] = useState({});

   const _getLocation = async () => {

        const { status } = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
        console.log('permission not granted')
        alert('permission not granted')
        }

        var _userLocation = await Location.getCurrentPositionAsync();
        setTimeout(() => {  setUserLocation(_userLocation); }, 2000);
        
        console.log("here is the userLocation ",userLocation)

  }


  const _getAdress = async () => {
    //Je pense qu'on a juste besoin de mettre la meme adresse
    const userAdress = await Location.reverseGeocodeAsync(userLocation.coords)
    setAdressUser(userAdress)
  }

    //********************* ON PROFITE DE CETTE PAGE POUR************************************ */

  useEffect(() => {
    _getLocation();
    _getAdress();
  },[]);

//********************************* POUR LA BIO ***************************************** */

  const [bio , setBio] = useState("")

//******************************** POUR LA PHOTO DE PROFIL **************************************** */


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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
     // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
 
    console.log(result);
 
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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

    const goSuivant = () => {
        //DANS LE CAS OU LE WINKER A MIS UNE PHOTO DE PROFIL
        if(image){
            const fileUri = image;
            let filename = fileUri.split('/').pop();
       
            const extArr = /\.(\w+)$/.exec(filename);
            const type = 'image/jpeg';
            setImage(null);
            startUploading(true);
       
            let formData = new FormData();
       
            formData.append('filetoupload', { uri: fileUri, name: filename, type });
            formData.append('newBio', bio);
            formData.append('espagnol', espagnol);
            formData.append('francais', francais);
            formData.append('anglais', anglais);
            formData.append('italien', italien);

            fetch(ipAdress+"/profil/uploadImagePhotoProfilBio/",{
                method:"POST",
                body : formData,
                headers: {
                  //'Authorization': 'Token '+token,
                  'Authorization': 'token '+token,
                  'content-type': 'multipart/form-data',
                },
              })
                .then( (response) => response.json() )
                .then( (responseJson) => {
                    console.log(responseJson)
                    console.log("illlllll n'y a pas eu d'erreuuurrrrrr")
                    dispatch(setFirstPhotoLocalisation())


                            //************ MAINTENANT ON MODIFIE LE CURRENTUSER ***************************/
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

                    

                })
                .catch(function(error) {
                  console.log("il y a eu une erreur ! ")
                    throw error;
                });
            
            
          }
          else{//DANS CE CAS ON ENREGISTRE QUE LA BIO

            axios.post(ipAdress + '/profil/uploadBio/', {
                newBio: bio,
              }, {
                headers: {
                   'Authorization': 'token '+token,
                    }
                })
              .then(function (response) {
                dispatch(setFirstPhotoLocalisation())



                            //************ MAINTENANT ON MODIFIE LE CURRENTUSER ***************************/
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




              })
              .catch(function (error) {
                console.log(error);
              });


          }



          //************ MAINTENANT ON MODIFIE LE CURRENTUSER ***************************/
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
    
    }

    
  return(
  <View style={{flex:1 , backgroundColor:"grey", justifyContent:"space-evenly",alignItems:"center",}}>
    
    <View style={{width:"90%",borderWidth:1,borderColor:"purple",marginBottom:10,borderRadius:10,justifyContent:"center",alignItems:"center",padding:10}}>
        {!image && 
        <>
        <ImageBackground
            style={{ width: 200, height: 200,justifyContent:"center",alignItems:"center" }}
            source={{ uri : ipAdress + "/media/pics/default-avatar.jpg"}}
        >
            <Button title="Photo de profil" onPress={pickImage} />
        </ImageBackground>
        
        </>
         
        
        }
        {image && <Button title="Supprimer l'image" onPress={() => setPickImage(null)} /> }
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
    
    <View style={{width : "90%",borderWidth:1,borderColor:"purple",borderRadius:20,padding:5}}>
        <Text>Si vous etes intéréssé par rencontrer de nouvelle personne dans cette appli, il est conseillé de faire une petite bio décrivant votre personnnalité ;)</Text>
        <TextInput     
            multiline={true}
            onChangeText={(text) => setBio(text)}
            placeholder="Example : Passioné de sport, je suis à la recherche de compagnie amicale pour toute sorte de sortie possible ! Sur le ton de la bonne humeur évidemment :D"
        />
    </View>
    
    <View style={{display:"flex",flexDirection:"row",borderWidth:1,borderColor:"purple",justifyContent:"center",alignItems:"center"}}>
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

    <Button title="Suivant" onPress={() => goSuivant()} />
  
  </View>
  )
}

export default firstPhotoLocalisation;

