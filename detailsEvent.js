import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo,useCallback} from 'react';
import {StyleSheet, Dimensions, ScrollView, Pressable, View, Text, Button, Image} from 'react-native';
//***************POUR LE REDUX ****************** */

import { useSelector, useDispatch } from "react-redux";

//***************************************** */

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';




import DoubleClick from "double-click-react-native";


const detailsEvent = ({navigation, route}) => {

      //***************TRAITREMENT DE REDUX ******************** */

  const dispatch = useDispatch();
  
  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

//************************************************************* */

const { event } = route.params;


const widthScreen = Dimensions.get('window').width;


// ****************************** CALCUL DES DISTANCES ********************************

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
    function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

// ************************************************************************************
    return(
        <DoubleClick
        singleTap={() => {
          //swiperRef.current.scrollToIndex({animated: true, index: Math.abs((index - 1)%(listFilesWinker.length))})
        }}
        doubleTap={() => {
            navigation.navigate('App')
        }}
        delay={250}
        style={{flex:1,marginTop:35,backgroundColor : "grey",flexDirection:"column"}}
        >

            <View style={{flex:0.3,borderWidth:1,borderColor:"black",justifyContent:"center",alignItems:"center"}}>
                <Text style={{alignItems:"center",justifyContent:"center",fontSize:25}}>{event.titre}</Text>
            </View>

            <View style={{flex:2,borderWidth:1,borderColor:"black"}} >
                <Text>
                    {event.bioEvent}
                </Text>
                
                <Text>
                    Des petites statistiques sur l'event (ou pas)
                </Text>
                <Text>
                    Reduction s'il y en a
                </Text>
                <Text>
                    Signaler l'article
                </Text>
            </View>

            {/* View seulement pouur les entreprises privées */}
            <View style={{flex:1,borderWidth:1,borderColor:"black"}}>
                <Text>Si c'est une entreprise privée, alors voici les avis sur l'entreprise</Text>
            </View>

            {/* Calcul des distances */}
            <View style={{flex:1,borderWidth:1,borderColor:"black",flexDirection:"row",flexWrap:"wrap"}}>

                <Text>
                    Ville : {event.city}
                </Text>
                
                <Text style={{margin:7}}>
                    <MaterialCommunityIcons style={{color:'black'}} name={'bike'} size={30} /> : 12min
                </Text>
                <Text style={{margin:7}}>
                    <FontAwesome5 style={{color:'black'}} name={'car'} size={30} /> : 6min
                </Text>
                <Text style={{margin:7}}>
                    <Fontisto style={{color:'black'}} name={'metro'} size={30} /> : 15min
                </Text>
                <Text style={{margin:7}}>
                    <FontAwesome5 style={{color:'black'}} name={'walking'} size={30} /> : 19min
                </Text>

                <Text>Participez à l'event pour avoir la localisation exacte.</Text>

            </View>

            {/* View pour voir les differents files */}
            <View style={{flex:1,borderWidth:1,borderColor:"black",flexDirection:"row"}}>
                {(event.filesEvent).map(a=>{
                    if(a.image == null){
                        return <Text>Voici la video : {a.video}</Text>
                    }else{
                        return (
                            <Image
                                style={{width:widthScreen / 3.1,height:"100%",margin:2}}
                                source={{
                                uri: a.image,
                                }}
                            />
                        )
                    }
                })}
            </View>

    
            
        </DoubleClick>
    )
}

export default detailsEvent;