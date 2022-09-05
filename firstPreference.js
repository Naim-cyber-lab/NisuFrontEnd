import { useDispatch } from "react-redux";
 
import React, { useState } from 'react';
import {View,Text, Pressable, ScrollView, Image, StyleSheet, Dimensions , Button, Modal, TouchableOpacity, FlatList, RefreshControl} from 'react-native';

import axios from 'axios';


//************************REDUX************************** */

import { store } from "./store";
import { useSelector } from "react-redux";

import { Provider } from "react-redux";


import { setToken } from "./store";
import { setIsLoggedIn } from "./store";
import { setFirstPhotoLocalisation } from "./store";
import { setCurrentUser } from "./store";

//********************************************************* */

function firstPreference({ navigation, route, props }){

    //*****************POUR LE REDUX **************************/

  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);

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


  const [listPreference , setListPreference] = useState([])

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

          //************ MAINTENANT ON MODIFIE LE CURRENTUSER ***************************/
          fetch(`${ipAdress}/profil/getDataWinker/`,{
            method:"GET",
            headers : {
              //'Authorization': `Token ${token}`
              'Authorization': `Token `+token
    
            }
            })
            .then( (response) => response.json() )
            .then( (response) => {
              dispatch(setCurrentUser(response.data))
            })
            .catch(function(error) {
              throw error;
            });

        console.log(response)
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

    {listPreference.length != 0 &&
      <Button title="Valider" onPress={() => goSuivant()} />
    }

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

export default firstPreference;
