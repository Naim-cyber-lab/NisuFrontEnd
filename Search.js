import React, {useEffect, useState, useRef} from 'react';
import { View, Text,TouchableOpacity, Pressable, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

// import styles from "./styles";

import { useSelector } from "react-redux";

import Feather from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';

const Post = ({ navigation }) => {

    //*****************POUR LE REDUX **************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
        
    //*************************************************************** */

    const [searchString, setSearchString] = useState("")
    const margin = 16;
    const borderRadius = 5;
    const width = Dimensions.get("window").width / 2 - margin * 2;

    const styles = StyleSheet.create({
        container: {
            width,
            height: width * 1.3,
            marginTop: 16,
            borderRadius,
        },
        textOnImage: {
            color:"white",
            fontSize:20,
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

    // dottedFile : {
    //     margin:2,
    //     height:200,
    //     flex:1,
    //     alignItems:"center",
    //     borderWidth:1,
    //     borderStyle: 'dotted',
    //     borderColor:'black',
    //     borderRadius:1
    // }
    });

    return (
    <View style={{flex:1,backgroundColor:'rgb(179, 175, 175);'}}>

        <View style={{display:'flex',flexDirection:'row',marginTop:35}} >
            <TextInput
                style={{borderWidth:1,borderColor:'black',width:"100%",borderRadius:10,textAlign: 'center',fontSize:25}}
                placeholder="Ecrivez ici !"
                onChangeText={(searchString) => {setSearchString(searchString)}}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => {
                    setSearchString(searchString);
                    navigation.navigate("EventsSearch",{'searchString':searchString}); 
                }}
            />

            <TouchableOpacity onPress={() => {
                                    setSearchString(searchString);
                                    navigation.navigate("EventsSearch",{'searchString':searchString});    
            } } style={{backgroundColor:'transparent',marginTop:9,transform: [{ translateX: -35 }]}} >
                <Feather name={'search'} size={27} style={{color:'white',marginTop:-3}}  />
            </TouchableOpacity>
        </View>


        <ScrollView>
            <View style={ {flexDirection: "row",flexWrap: "wrap",justifyContent: "space-evenly",}}>

                <Pressable onPress={() => {
                    
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#soiree"}}) 
                    }
                
                }> 
                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Nos soirées</Text>
                        <Image source={require("../Filtre/Image/soireePreference.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() =>{
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Nouriture"}})
                    }}> 
                    <View style={{...styles.container, opacity : 1 }}>
                        <Text style={styles.textOnImage}>Nouriture</Text>
                        <Image source={require("../Filtre/Image/Nouriture.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() =>{
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#culture"}})
                }}>

                    <View style={{...styles.container, opacity :  1 }}>
                    <Text style={styles.textOnImage}>Culture</Text>
                        <Image source={require("../Filtre/Image/culturePreference.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#sport"}})
                }}> 

                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Sport</Text>
                        <Image source={require("../Filtre/Image/sportPreference.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Humanitaire"}})
                }}> 

                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Humanitaire</Text>
                        <Image source={require("../Filtre/Image/Humanitaire.png")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Manifestation"}})
                }}> 
                
                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Manifestation</Text>
                        <Image source={require("../Filtre/Image/Manifestation.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Visiter"}})
                }}> 
                
                    <View style={{...styles.container, opacity : 1 }}>
                        <Text style={styles.textOnImage}>Lieu à visiter</Text>
                        <Image source={require("../Filtre/Image/Visiter.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Gratuit"}})
                }}> 
                
                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Gratuit</Text>
                        <Image source={require("../Filtre/Image/Gratuit.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Insolite"}})
                }}> 
                
                    <View style={{...styles.container, opacity : 1 }}>
                        <Text style={styles.textOnImage}>Evenement insolite</Text>
                        <Image source={require("../Filtre/Image/Insolite.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Attraction"}})
                }}> 
                
                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Attraction</Text>
                        <Image source={require("../Filtre/Image/Attraction.jpg")}  style={styles.image}  />
                    </View>
                    
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Voyage"}})
                
                }}> 
                    <View style={{...styles.container, opacity :  1 }}>
                        <Text style={styles.textOnImage}>Voyage</Text>
                        <Image source={require("../Filtre/Image/voyagePreference.jpg")}  style={styles.image}  />
                    </View>
                </Pressable>

                <Pressable onPress={() => {
                    navigation.navigate('HastagEvent' , {item : {"id" : 1 , "hastag":"#Autre"}})
                }}> 
                
                    <View style={{...styles.container, opacity : 1 }}>
                        <Text style={styles.textOnImage}>Autre</Text>
                        <Image source={require("../Filtre/Image/Autre.png")}  style={styles.image}  />
                    </View>
                    
                </Pressable>
            
            </View>
        </ScrollView>
      

         
    </View>
    )
}

export default Post;


