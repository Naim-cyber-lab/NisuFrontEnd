import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo,useCallback} from 'react';
import {StyleSheet, Dimensions, ScrollView, Pressable,RefreshControl} from 'react-native';

import { View, Text,Button, TouchableOpacity, Image, Modal,Icon,TextInput,ActivityIndicator,ImageBackground} from 'react-native';
import indexCreeEvent from '../../CreeEvent/index';

import styles from "./styles";

import axios from 'axios';

import DoubleClick from "double-click-react-native";

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


import { SwiperFlatList } from 'react-native-swiper-flatlist';



import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FlatList } from 'react-native-gesture-handler';

import { Modalize } from 'react-native-modalize';


//***************POUR LE REDUX ****************** */

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentUser, setWinkersChat } from "../../Register/store";

//***************************************** */
// import Video from 'react-native-video';
import { Video, AVPlaybackStatus } from 'expo-av';


import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';


import Swiper from 'react-native-swiper'
import { TapGestureHandler, TouchableHighlight } from 'react-native-gesture-handler';


import { SharedElement } from "react-navigation-shared-element";

//******A REMETTRE POUR LES ANIMATIONS COMME LE DOUBLE CLICK POUR LES PARTICIPANTS DE L'EVENEMENT************** */
import Animated, {useAnimatedStyle,useSharedValue,withDelay,withSpring,withTiming,} from 'react-native-reanimated';

import { NavigationContainer, DefaultTheme, DarkTheme , useNavigation} from '@react-navigation/native';

// import { useCallback } from 'react-native-vector-icons/node_modules/@types/react';

import ItemFlatlist from "./flatlistItem"


const ReponseCommentItem = ({item}) => {
        //*****************POUR LE REDUX **************************/

        const ipAdress = useSelector((state) => state.ipAdress);
        const token = useSelector((state) => state.token);
        const winkersChat = useSelector((state) => state.winkersChat);//pour l'envoie de l'event à un ami
        const currentUser = useSelector((state) => state.currentUser);
        
        const dispatch = useDispatch();
        //******************************************************** */

        const [nbLike , setNbLike] = useState(item.item.nbLike)
        const [isLiked , setIsLiked] = useState(false)

        const handleLikeCommentReponse = (idCommentReponse) => {
            axios.post(ipAdress + '/profil/handleLikeCommentReponse/', {
                idCommentResponse: idCommentReponse,
            }, {
                    headers: {
                      'Authorization': 'Token '+token
                    }
                })
                  .then(function (response) {
                        if(isLiked){
                            setIsLiked(false)
                            setNbLike(nbLike - 1)
                        }
                        else{
                            setIsLiked(true)
                            setNbLike(nbLike + 1)
                        }
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
        }

        //********************************************************** */

        useEffect(() =>{
            //console.log("voici l'id du comment : ",item.item.id)
            axios.post(ipAdress + '/profil/isLikedCommentReponse/', {
                idComment: item.item.id,
              }, {
                headers: {
                  'Authorization': 'Token '+token
                }
            })
              .then(function (response) {
                  if(response.data.isLiked){
                      setIsLiked(true)
                  }
                  else{
                      setIsLiked(false)
                  }
              })
              .catch(function (error) {
                console.log(error);
              });
          }, [])
    

        return(
        <>
       
        <Pressable style={{display:'flex',flexDirection:'row',flex:8,backgroundColor:"geen"}}>
            <Image
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: '#4c4c4c',
                    marginTop:6,
                    marginRight:6,
                  }}
                source={{uri: item.item.winker.photoProfil}}
            /> 
            <View style={{display:"flex",flexDirection:"column"}}>
                <Text style={{color:'grey'}}>{item.item.winker.username}</Text>
                <Text style={{color:'black'}}> {item.item.message}</Text>                                     
            </View>                                            
        </Pressable> 
        <Pressable style={{backgroundColor:"transparent",flex:1}} onPress={() =>handleLikeCommentReponse(item.item.id)}>
            <Text style={{textAlign:"center",marginTop:2,fontSize:10}}>{nbLike}
            {isLiked ?
            <Entypo name={'heart'} size={25} style={{color:'red'}} />
            :
            <Entypo name={'heart-outlined'} size={15} style={{color:'black'}} />
            }
            
            </Text>
        </Pressable></>
        )
}

const CommentItem = ({item}) => {

    //*****************POUR LE REDUX **************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
    const winkersChat = useSelector((state) => state.winkersChat);//pour l'envoie de l'event à un ami
    const currentUser = useSelector((state) => state.currentUser);
    
    const dispatch = useDispatch();
    
    //****************************DONNEE LIE A L'EVENT*************************** */

    const prepareDataCommentRepondre = (item) => {
        // console.log("voici le item ds repondreComment : ",item);
        setModalVisibleCommentRepondre(!modalVisibleCommentRepondre)
        setIdMessageRepondre(item.id)
        setMessageRepondre(item.message)


        fetch(ipAdress+'/profil/getDataResponseEvent/idComment='+String(item.id)+'/',{
            method:"GET",
            headers: {
              'Authorization': 'Token '+token,
            },
          })
            .then( (response) => response.json() )
            .then( (responseJson) => {
                setDataReponseComment(responseJson)
            })
            .catch(function(error) {
              console.log('Home/EventItem/event.js Comment ligne 153 There has been a problem with your fetch operation: ' + error.message);
               alert(error)
                throw error;
            });
        }

    const handleLikeComment = (idCommentEvent) => {
        
        axios.post(ipAdress + '/profil/handleLikeComment/', {
            idCommentEvent: idCommentEvent,
        }, {
                headers: {
                  'Authorization': 'Token '+token
                }
            })
              .then(function (response) {
                    if(isLiked){
                        setIsLiked(false)
                        setNbLike(nbLike - 1)
                    }
                    else{
                        setIsLiked(true)
                        setNbLike(nbLike + 1)
                    }
              })
              .catch(function (error) {
                console.log(error);
              });
        }

    function hasResponses(nbResponses) {
        if(parseInt(nbResponses) == 0){
            return false
        }
        else {
            return true
        }
        }

    //************************************************************************************************************* */

    const widthScreen = Dimensions.get('window').width;
    const heightScreen = Dimensions.get('window').height;    

    // *********************************** POUR REPONDRE A UN COMMENTAIRE ***************************************** */

    const [modalVisibleCommentRepondre , setModalVisibleCommentRepondre] = useState(false);

    const [dataReponseComment , setDataReponseComment] = useState({})
    
    const onModalRepondreComment = () => {
        setModalVisibleCommentRepondre(!modalVisibleCommentRepondre)
    }
    // Il s'agit du message auquel nous voulons repondre
    const [messageRepondre , setMessageRepondre ] = useState("")
    
    const [idMessageRepondre , setIdMessageRepondre ] = useState()

    const [reponseCommentaire , setReponseCommentaire] = useState("")
    
    const handleRepondreComment = () => {
    
            axios.post(ipAdress + '/profil/handleRepondreComment/', {
                addCommentReponse: 1,
                reponseCommentaire: reponseCommentaire,
                idMessageRepondre: idMessageRepondre,
              }, {
                headers: {
                  'Authorization': 'Token '+token
                }
            })
              .then(function (response) {
                  if(response.data.envoye){
                      alert("Votre demande a bien ete envoye")
                  }
                  else{
                      alert("Il y a eu un probleme lors de votre demande de participation")
                  }
              })
              .catch(function (error) {
                console.log(error);
              });
        }

    const renderRepondreComment = (item) => {
        return(
            <View style={{flex:1,flexDirection:"row"}}>
                <ReponseCommentItem item={item} />
            </View>
        )
    }

    //******************************************************************************** */

    const [nbLike , setNbLike] = useState(item.nbLike)

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() =>{
        axios.post(ipAdress + '/profil/isLikedComment/', {
            idComment: item.id,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
              if(response.data.isLiked){
                  setIsLiked(true)
              }
              else{
                  setIsLiked(false)
              }
          })
          .catch(function (error) {
            console.log(error);
          });
      }, [])
  
    return(
        <>

        <Pressable onPress={() => prepareDataCommentRepondre(item)} style={{display:'flex',flexDirection:'row',flex:8,backgroundColor:"geen"}}>
            <Image
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: '#4c4c4c',
                    marginTop:6,
                    marginRight:6,
                  }}
                source={{uri: item.winker.photoProfil}}
            /> 
            <View style={{display:"flex",flexDirection:"column"}}>
                <Text style={{color:'grey'}}>{item.winker.username}</Text>
                <Text style={{color:'black'}}> {item.message}</Text>
                {hasResponses(item.nbResponses) &&
                    <Text style={{color:"grey",fontSize:10,bottom:0}}>Voir réponses {item.nbResponses}<AntDesign name={'down'} size={10} style={{color:'black'}} /></Text>
                }                                        
            </View>                                            
        </Pressable> 
        <Pressable style={{backgroundColor:"transparent",flex:1}} onPress={() =>handleLikeComment(item.id)}>
            <Text style={{textAlign:"center",marginTop:2,fontSize:10}}>{nbLike}
            {isLiked ?
            <Entypo name={'heart'} size={25} style={{color:'red'}} />
            :
            <Entypo name={'heart-outlined'} size={15} style={{color:'black'}} />
            }
            
            </Text>
        </Pressable>

        {/* Pour repondre à un commentaire */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleCommentRepondre}
                onRequestClose={() => {
                alert("Modal has been closed.");
                }}
            >

                <View style={{backgroundColor:"transparent",width:'100%',height: heightScreen - 38,position:"absolute",bottom:0,opacity:1}}>
                
                    <TouchableOpacity onPress={onModalRepondreComment} style={{flex:0.5,opacity:0.1, backgroundColor:'white'}}></TouchableOpacity>

                    <View style={{backgroundColor:'white', flex:3,borderRadius:45, borderWidth : 4,opacity:1}}>
        
                        <Text style={{textAlign:"center",margin:5}}>{messageRepondre}</Text>
                        <View style={styles.searchSection}>   
                                <TextInput
                                    style={styles.input}
                                    placeholder="Répondre ici !"
                                    onChangeText={(text) => setReponseCommentaire(text)}
                                    // underlineColorAndroid="transparent"
                                />
                                <Feather style={styles.searchIcon} onPress={()=> handleRepondreComment()} name="send" size={20} color="#000"/>
                        </View>
                        <FlatList
                             refreshControl={
                                <RefreshControl
                                    onRefresh={() => setModalVisibleCommentRepondre(false)}
                                />
                            }
                            data={dataReponseComment.data}
                            keyExtractor={(item) => item.id}
                            //renderItem={({item}) => renderItemComment(item)}
                            renderItem={renderRepondreComment}
                        />
            
                    </View>


                    <TouchableOpacity onPress={onModalRepondreComment} style={{flex:0.5,opacity:0.2, backgroundColor:'black'}}></TouchableOpacity>

                    
                </View>

        </Modal>               

        </>

    )
}


const EventItem = forwardRef(({item}, parentRefIndex) => {

    //*****************POUR LE REDUX **************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
    const winkersChat = useSelector((state) => state.winkersChat);//pour l'envoie de l'event à un ami
    const currentUser = useSelector((state) => state.currentUser);

    const dispatch = useDispatch();

    //****************************DONNEE LIE A L'EVENT*************************** */
    const event = item;

    // ************************* ON RECUPERE LES DONNES LIEES A L'EVENEMENT ******************************
    const [nbLikes, setNbLikes] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const navigation = useNavigation();

    // const AnimatedImage = Animated.createAnimatedComponent(Image);

    const widthScreen = Dimensions.get('window').width;
    const heightScreen = Dimensions.get('window').height;

    const eventId = event.id;


    //******************************************************************************* */

    //*********************POUR LES PREFERENCES (HASTAGS) DE L'EVENT ********************/
    const [listPreference , setListPreference] = useState([])

    useEffect(() =>{
      if((event.PreferenceEventField) != null){
        var myCloneList = {...event.PreferenceEventField};

        var aList = []
        var id = 0

        for (const property in myCloneList) {

            if((property != "id") && (property != "event")){
                if(myCloneList[property]){
                    id = id + 1;
                    aList.push({hastag : "#" + String(property) , id : id })         
                    setListPreference(aList)
                }
            }
        }
    }
    }, [])

    const renderItemPreference = ({item}) => {
        const handleNavigationHastag = () => {

            setShouldPlay(false)

            console.log("voici l'item du # : ",item)

            navigation.navigate('HastagEvent' , {item : item})
        }

        return(
            <Pressable style={{margin:3}} onPress = {() => handleNavigationHastag() }>
                <Text style={{color:"white",fontSize:17}}>{item.hastag}</Text>
            </Pressable>
        )
    }
    
    //************************************************************************************ */

    // **********************TRAVAIL SUR LES COMMENTAIRES***********************************

    const [dataComment, setDataComment] = useState({ hits: [] });

    const [modalVisibleComment, setModalVisibleComment] = useState(false);

    const refTextInputComment = useRef(null)

    const [showIdentification, setShowIdentification] = useState(false);

    const [commentText, setCommentText] = useState("");


    const isWritingComment = (text)=> {
        setCommentText(text)
        var lastChar = getLastChar(text)
        if(lastChar == "@"){
            setShowIdentification(true)
            setCommentText(text + " salut les gars")
        }

        if(!(text.includes("@"))){
            setShowIdentification(false) 
        }
    }

    const renderItemComment = (item) => {

        return (
            <View style={{backgroundColor:"transparent",borderColor:'black','marginTop':12,display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <CommentItem item={item} />
            </View>
        )
    }

    
    const handleSendComment = (commentText) => {

        if (commentText == ""){
            return
        }
        

        axios.post(ipAdress + '/profil/addNewComment/', {
            idEvent: event.id,
            comment: commentText
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
                
                setCommentText("")

                setDataComment(oldArray => [
                    response.data ,
                    ...oldArray,
                  ])  
            
          })
          .catch(function (error) {
            console.log(error);
          });

   
        }

    const onModalComment = () => {
        setModalVisibleComment(!modalVisibleComment);
        //bottomSheetComment.current.snapToIndex(0)
        //modalizeRefComment.current?.open()

     fetch(ipAdress+'/profil/getEventComment/idEvent='+String(eventId)+'/',{
        method:"GET",
        headers: {
          'Authorization': 'Token '+token,
        },
      })
        .then( (response) => response.json() )
        .then( (responseJson) => {
            setDataComment(responseJson.data)
        })
        .catch(function(error) {
          console.log('Home/EventItem/event.js Comment ligne 153 There has been a problem with your fetch operation: ' + error.message);
           alert(error)
            throw error;
        });
        
    }


    const [nbCommentVisible, setnbCommentVisible] = useState(1);

    var comments = [];

    if(nbCommentVisible != 0){
        for(let i = 0; i < nbCommentVisible; i++){
            comments.push(
                <View key = {i}>
                    <Text>{nbCommentVisible}</Text>
                </View>
            )
        }
    }
    else {
        comments.push(
             <View key={1}>
                <Text>Pas de commentaire</Text>
            </View>
        )
       
    }



    // ************************************************************************************************************************************

    // *********************************** TRAVAIL SUR LES OFFRES **************************************************************************

        
    const [containReduction , setContainReduction] = useState(Boolean(event.containReduction));//Pour savoir si on doit afficher le dollar ou pas sur la page
    const [isPrice, setIsPrice] = useState(false);//Pour savoir si il s'agit d'une redution ou d'un truc payant.
    const [prixInitial , setPrixInitial] = useState(event.prixInitial);
    const [prixReduction , setPrixReduction] = useState(event.prixReduction);
    const [textReduction , setTextReduction] = useState(event.textReduction);
    const [isLoadingOffre, setIsLoadingOffre] = useState(true);

    const [dataOffre, setDataOffre] = useState( {} );

    const [modalVisibleOffre, setModalVisibleOffre] = useState(false);

    const onModalOffre = () => {
        setModalVisibleOffre(!modalVisibleOffre);

        if(prixInitial == prixReduction){
            setIsPrice(true)
        }

    //  fetch(ipAdress+'/profil/getEventOffre/idEvent='+String(eventId)+'/',{
    //     method:"GET",
    //     headers: {
    //       'Authorization': 'Token '+token,
    //     },
    //   })
    //     .then( (response) => response.json() )
    //     .then( (responseJsonOffre) => {
    //         setDataOffre(responseJsonOffre.data[0])
  
    //     })
    //     .catch(function(error) {
    //       console.log('There has been a problem with your fetch operation: ' + error.message);
    //        alert(error)
    //         throw error;
    //     });

    //     setIsLoadingOffre(false)
    }
    // ******************************************************************************************************************************************

    // *********************************** HASTAGS ******************************************************************************************

    const [isLoadingHastag, setIsLoadingHastag] = useState(true);

    const [dataHastag, setDataHastag] = useState( {} );

    const [modalVisibleHastag, setModalVisibleHastag] = useState(false);

    const onModalHastag = () => {
        
        setModalVisibleHastag(!modalVisibleHastag);

     fetch(String(ipAdress)+'/profil/getHastagsEvent/idEvent='+String(eventId)+'/',{
        method:"GET",
        headers: {
          'Authorization': 'Token '+token,
        },
      })
        .then( (response) => response.json() )
        .then( (responseJsonOffre) => {
            setDataHastag(responseJsonOffre.data[0])
  
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
           alert(error)
            throw error;
        });

        setIsLoadingHastag(false)
    }

    // ********************************************************************************************************************************
  
    // ************************************************************************************************** //
    //                                                                                                    //
    //                          TRAVAIL SUR L'ENVOI DES MESSAGES A UN AMI                                 //
    //                                                                                                    //
    //*************************************************************************************************** */

    const [modalVisiblePaperPlane, setModalVisiblePaperPlane] = useState(false);

    const [dataWinkers, setDataWinkers] = useState( {} );
    const [firstDataWinkers, setFirstDataWinkers] = useState( {} );

    const [isSearchingWinker , setIsSearchingWinker] = useState(false);
    

    const onModalPaperPlane = () => {
        setModalVisiblePaperPlane(!modalVisiblePaperPlane);

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

    const handleSearchWinker = (searchString) => {
        if(searchString == ""){
            setIsSearchingWinker(false)
        }
        else{
            setIsSearchingWinker(true)
        }
            setDataWinkers(firstDataWinkers.filter(item => item.username.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())))
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

    const [listSendGroup , setListSendGroup] = useState([]);

    function addOrRemoveIdGroup(idWinker) {
        var myClone = listSendGroup.map((x) => x);
        
        if(!containsDataWinkers(listSendGroup ,idWinker)){
                    
            myClone.push(idWinker)         
            setListSendGroup(myClone)
        
        }
        else{
            var myIndex = myClone.indexOf(idWinker);
                    
            if (myIndex !== -1) {
                myClone.splice(myIndex, 1);
                setListSendGroup(myClone)
            }
        
        }
    }

    const sendEventFriends = () => {

        //console.log("voici la list des IdUserSendEvent pour les user normal : ",listIdUserSendEvent)
        //console.log("et voici la liste  pour le groupe : ",listSendGroup)

        axios.post(ipAdress + '/profil/sendEventFriends/', {
            idEvent: event.id,
            listIdUserSendEvent: listIdUserSendEvent,
            listSendGroup: listSendGroup,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
              if(response.data.messageEnvoye){
                  alert("c'est ok")
                  setModalVisiblePaperPlane(false)
              }
              else{
                  alert("ya un pb")
              }
          })
          .catch(function (error) {
            console.log(error);
          });
    
    
    }

    const renderItemEnvoieAmie = ({item}) => { 
        
        if(item.winker1){//Alors les données viennent de winkersChat
            if(item.winker2){//Alors il s'agit d'une personne solo
                return(
                    <Pressable onPress = {() => addOrRemoveId(item)} style= {{ backgroundColor:  contains(listIdUserSendEvent ,item) ? "green" : "transparent", display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10 }}>
                        <View style={{display:'flex',flexDirection:'row',flex:3}}>
                            <Image
                                    style={styles.songImage}
                                    source={{uri: item.winker1.id != currentUser.id ? item.winker1.photoProfil : item.winker2.photoProfil }}
                                /> 
                            {item.winker1.id != currentUser.id ?
                                <Text> {item.winker1.username}</Text>
                                :
                                <Text> {item.winker2.username}</Text>
                            }
    
                
                            
                        </View>
                    
                        <View style={{flex:1,}}>
                            <Text style={{marginTop:20}}>
                                <Fontisto style={{color:'white'}} name={'paper-plane'} size={20} />
                            </Text>
                        </View>
                
                    </Pressable>
                    )  
            }
            else{//Alors il s'agit d'un groupe
                return(
                    <Pressable onPress = {() => addOrRemoveIdGroup(item.id)} style= {{ backgroundColor:  containsDataWinkers(listSendGroup ,item.id) ? "green" : "transparent", display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10 }}>
                    <View style={{display:'flex',flexDirection:'row',flex:3}}>
                        <Image
                                style={styles.songImage}
                                source={{uri: ipAdress + "/media/G.jpg" }}
                            /> 

                            <Text> {item.titreGroupe}</Text>
                        
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
                                    style={styles.songImage}
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
    // ******************************************************************************************************************************

    const [modalVisibleStories, setModalVisibleStories] = useState(false);
    const onModalStories = () => {
        setModalVisibleStories(!modalVisibleStories);
    };
    
    const [paused, setPaused] = useState(false);
    const onPlayPausePress = () => {
        setPaused(!paused);
    };

// ********************************************** SHOW PARTICIPANTS **************************************************************

const [modalVisibleParticipants, setModalVisibleParticipants] = useState(false);

const [dataParticipants, setDataParticipants] = useState( {} );
const onModalParticipants = () => {
    scale.value = withSpring(1, undefined, (isFinished) => {
      if (isFinished) {
        // scale.value = withDelay(500, withSpring(0));
      }
    });
    setModalVisibleParticipants(!modalVisibleParticipants);
} 

// ********************************************************************************************************************************


    // ************************************************************************************************** //
    //                                                                                                    //
    //                                         DEMANDE DE PARTICPATION                                    //
    //                                                                                                    //
    //*************************************************************************************************** */


const [createGroupePrivee, setCreateGroupePrivee] = useState(false)

const [messageDemandeParticipation, setMessageDemandeParticipation] = useState("")
const handleDemandeParticipation = () => {

    if(currentUser.id == event.creatorWinker.id){
        alert("vous participez déjà à cet event ( createur )")
        return
    }

    //console.log("voici l'id de l'event venant de react native : ",event.id)
    if(!event.accessOuvert){
        
        axios.post(ipAdress + '/profil/demandeParticipation/', {
            idEvent: event.id,
            messageDemandeParticipation: messageDemandeParticipation,
        }, {
            headers: {
            'Authorization': 'Token '+token
            }
        })
        .then(function (response) {
            if(response.data.ParticipationEnvoye){
                alert("Votre demande a bien ete envoye, vous avez ete mis en file d'attente.")
                setModalVisibleParticipation(false)
            }
            else{
                alert("Il y a eu un probleme lors de votre demande de participation")
            }
        })
        .catch(function (error) {
            console.log(error);
        });

    }else{

        axios.post(ipAdress + '/profil/participationLibre/', {
            idEvent: event.id,
        }, {
            headers: {
            'Authorization': 'Token '+token
            }
        })
        .then(function (response) {
            
                alert("Felicitation ! vous participez maintenant à cet évènement")
                setModalVisibleParticipation(false)
           
        })
        .catch(function (error) {
            alert("Il y a eu un probleme lors de votre demande de participation")
            console.log(error);
        });


    }

}

const [modalVisibleParticipation, setModalVisibleParticipation] = useState(false);

const [listIdentification, setListIdentification] = useState([]);

const onModalParticipation = () => {

    setModalVisibleParticipation(!modalVisibleParticipation);
 
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

}


function addOrRemoveListIdentification(item) {

    if(item.winker1.id != currentUser.id){
        var idWinker = item.winker1.id;
    }
    else{
        var idWinker = item.winker2.id;
    }

    var myClone = listIdentification.map((x) => x);

    if(!contains(listIdentification ,item)){
        
        myClone.push(idWinker)         
        setListIdentification(myClone )
    }else{
        var myIndex = myClone.indexOf(idWinker);
        if (myIndex !== -1) {
            myClone.splice(myIndex, 1);
            setListIdentification(myClone)
        }
    }
    
}

function addOrRemoveListIdentificationDataWinkers(idWinker) {
    var myClone = listIdentification.map((x) => x);

    if(!containsDataWinkers(listIdentification ,idWinker)){
        
        myClone.push(idWinker)         
        setListIdentification(myClone )
    }else{
        var myIndex = myClone.indexOf(idWinker);
        if (myIndex !== -1) {
            myClone.splice(myIndex, 1);
            setListIdentification(myClone)
        }
    }



    
}

const renderItemGroupePrive = ({item}) => {
        if(item.winker1){//On est dans le cas des winkersChat
    return(
    <Pressable onPress = {() => addOrRemoveListIdentification(item)}
    style=
    {{
    backgroundColor: contains(listIdentification ,item) ?
        "green" :
        "transparent",
    display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
        <View style={{display:'flex',flexDirection:'row',flex:3}}>
        
            <Image
                style={styles.songImage}
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
        else{//On est dand le cas des dataWinkers
            return(
            <Pressable onPress = {() => addOrRemoveListIdentificationDataWinkers(item.id)}
            style=
            {{
            backgroundColor: containsDataWinkers(listIdentification ,item.id) ?
                "green" :
                "transparent",
            display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
                <View style={{display:'flex',flexDirection:'row',flex:3}}>
                
                    <Image
                        style={styles.songImage}
                        source={{uri: item.photoProfil }}
                    /> 
                        
                        <Text> {item.username}</Text>
                  
        
                </View>
          
            </Pressable>
            )

        }
}

const creationGroupePrive = () => {
    if(listIdentification.length == 0){
        alert("il faut ajouter des winker !")
        return
    }else{

        axios.post(String(ipAdress)+'/profil/addGroupPrive/', {
            idEvent: event.id,
            listIdWinker : JSON.stringify(listIdentification),
          },
         { headers: {
              'Authorization': 'Token ' + token
          }})
          .then(function (response) {
             
                alert("votre groupe prive a bien été créé !")
                setModalVisibleParticipation(false)
                
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    
    console.log("voici la liste de creation de groupe prive ",listIdentification)
}

const isWrittingGroupePrive = (text) =>{
    alert(text)
}

// *******************************************************************************************************************************

// *********************************************** FAVORITE *********************************************************************

useEffect(() => {
    functionIsFavorite();
  });

const functionIsFavorite = () => {
    axios.post(String(ipAdress)+'/profil/handleFavorite/', {
        idEvent: event.id,
      },
     { headers: {
          'Authorization': 'Token ' + token
      }})
      .then(function (response) {
          if(response.data.isFavorite){
            //   Dans ce cas l'evenement a deja ete mis en favoris par l'utilisateur
              setIsFavorite(true)
          }
          else{
              // Dans ce cas l'evenement n'a pas ete mis en favoris par l'utilisateur
              setIsFavorite(false)
          }
      })
      .catch(function (error) {
        console.log(error);
      });
}

const handleFavorite = () => {
    setIsFavorite(!isFavorite)

    axios.put(String(ipAdress)+'/profil/handleFavorite/', {
        idEvent: event.id,
      }, {
        headers: {
          'Authorization': 'Token '+token
        }
    })
      .then(function (response) {
          if(response.data.envoye){
              console.log('element mis en favoris')
          }
          else{
            console.log('element enleve des favoris')
          }
      })
      .catch(function (error) {
          console.log("erreur ligne 719 handleFavorite EventItem event.js")
        console.log(error);
      });

    //     fetch(String(ipAdress)+'/profil/handleFavorite/idEvent='+event.id+'/',{ 
    //     method:"PUT",
    //   })
    //     .then( (response) => response.json() )
    //     .then( (responseJsonWinker) => {
    //     })
    //     .catch(function(error) {
    //       console.log('There has been a problem with your fetch operation: ' + error.message);
    //        alert(error)
    //         throw error;
    //     });
}


// ********************************************************************************************************************************
const [opacity, setOpacity] = React.useState(1);
// ********************************************* FONCTION ANNEXE ******************************************************************

//******************************************************************************************** */

function getLastChar(str) { 
    return str.charAt(str.length-1); 
}

function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

      //*********************************** TRAITEMENT DES FICHIERS ***************************************** */

      
const filesEvent = event.filesEvent;
const lengthFilesEvent = filesEvent.length;
      const getFiles = (filesEvent) => {   
    
        var listFiles = []
    
        var existVideo = false

        for (var dictionnary of filesEvent){
            if (dictionnary["video"] != null ){
                listFiles.push(dictionnary["video"])
                existVideo = true
            }
        }

    
        for (var dictionnary of filesEvent){
            if (dictionnary["image"] != null ){
                listFiles.push(dictionnary["image"])
            }
        }


    
        return [listFiles , existVideo]
    
    }

    const [getFilesEvent , setGetFilesEvent] = useState(getFiles(filesEvent))


// *******************************************************************************************************************************
//*************************************************POUR LES ABONNEMENTS********************************************************* */

const [isAbo , setIsAbo] = useState(false);

const functionIsAbo = () => {
    axios.post(ipAdress + '/profil/isAbo/', {
        idWinker: event.creatorWinker.id,
      }, {
        headers: {
          'Authorization': 'Token '+token
        }
    })
      .then(function (response) {
        if(response.data.isAbo){
            setIsAbo(true)
        }else{
            setIsAbo(false)
        }
    
      })
      .catch(function (error) {
        console.log(error);
      });
}

useEffect(() => {
    functionIsAbo();
  }, []);

const addAbo = () => {

axios.post(ipAdress + '/profil/addAbo/', {
    idWinker: event.creatorWinker.id,
  }, {
    headers: {
      'Authorization': 'Token '+token
    }
})
  .then(function (response) {
      setIsAbo(true)
  })
  .catch(function (error) {
    console.log(error);
  });


}

const unFollow = () => {
    axios.post(ipAdress + '/profil/unfollow/', {
      idWinker: event.creatorWinker.id,
    }, {
      headers: {
        'Authorization': 'Token '+token
      }
  })
    .then(function (response) {
      setIsAbo(false)
    })
    .catch(function (error) {
      console.log(error);
    });
}



//********************************************************************************************************************************* */
//************************************************** POUR LA VIDEO *************************************************** */

    const [shouldPlay , setShouldPlay] = useState(false);
    const video = useRef(null);

    const AnimatedImage = Animated.createAnimatedComponent(Image);

    useImperativeHandle(parentRefIndex , () => ({
        play,
        unload,
        stop,
    }))

    const scale = useSharedValue(0);
    const opacityPauseVideo = useSharedValue(1);

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ scale: Math.max(scale.value, 0) }],
    }));

  const rTextStyle = useAnimatedStyle(() => ({
    opacity: opacityPauseVideo.value,
  }));


    const handlePauseImage = () => {
        
        if(!shouldPlay){//On met la video en pause
        scale.value =  withSpring(0)
        }
        else{
        scale.value =  withSpring(1)
        }

        setShouldPlay(!shouldPlay)



    }



    // ************************************ POUR L'AUDIO ************************************************

    const [isAudio , setIsAudio] = useState(false)
    const [sound, setSound] = useState();
    const [soundPlaying , setSoundPlaying] = useState(false)

    useEffect(() =>{
        if(event.audio != null){
            setIsAudio(true)
        }
        
    }, [])

    async function playSound() {
    setSoundPlaying(true)
    setShouldPlay(false) //On fait pause à la vidéo
    console.log('Loading Sound');
    const { sound, status } = await Audio.Sound.createAsync(
        { uri: event.audio },
        (status) => console.log(status.positionMilis),
    );
    setSound(sound);

    console.log('Playing Sound');
        await sound.playAsync(); }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  //****************************************************************************************** */

//***************************************************************************************************************** */
// ******************************************** POUR LE FLATLIST (SWIPER) ******************************************************************


    const swiperRef = useRef(null)


    const play = async () => {  

        //console.log("voici l'index du play : ",index)

        if(getFilesEvent[1]){

            //console.log("je play la video :"+titre+ " a l'index "+index)

            setShouldPlay(true)
            
            video.current.playAsync();

            if(video.current == null){
                return;
            }
            const status = await video.current.getStatusAsync();
            if(status?.isPlaying){
                console.log("la video est en route")
                return;
            }
            try {
                await video.current.playAsync();
            }catch(e){
                console.log(e)
            }

        }
        else{
            //console.log("ne contient pas de video (play) :",titre)
        }

            

    }

    const stop = async () => {

        if(getFilesEvent[1]){

            //console.log("je pause la video :",titre)

            setShouldPlay(false)

            if(video.current == null){
                return;
            }
            const status = await video.current.getStatusAsync();
            if(!status?.isPlaying){
                return;
            }
            try {
                await video.current.stopAsync();
            }catch(e){
                console.log(e)
            }

        }
        else{
            //console.log("ne contient pas de video (pause) :",titre)
        }

    }

    const unload = async () => {

        console.log("FONCTION UNLOAAADDD")

        if(index == 0){

            console.log("je suis ds la fonction unload")

            if(video.current == null){
                return;
            }
        
            try {
                await video.current.unloadAsync();
            }catch(e){
                console.log(e)
            }

        }

    }

    const renderFlatlist = ({ item, index }) => {
        return(
            //playVideo={playVideo} stopVideo={stopVideo}
            <ItemFlatlist ipAdress={ipAdress} parentRefIndex={parentRefIndex} event={event}  titre={event.titre} audio={event.audio} navigation={navigation} numberFiles={getFilesEvent[0].length} containVideo={getFilesEvent[1]} filesEvent={filesEvent} lengthFilesEvent={lengthFilesEvent} item={item} index={index} swiperRef={swiperRef} /> 
        )        
    }


//********************************************************************************************************************* */


//***************************POUR GERER LES SWIPES ********************************** */

const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 40
  };

  const onSwipeUp = (gestureState) => {
    setShouldPlay(false)
    console.log("swipe up")
  }

  const onSwipeDown = (gestureState) => {
    setShouldPlay(false)
    console.log("swipe down")
  }

//************************************************************************************ */
    return (
     
        <View style={{flex:1,backgroundColor:'black',color:'white'}}>
        
            <GestureRecognizer
                    //onSwipe={(direction, state) => onSwipe(direction, state)}
                    onSwipeUp={(state) => setShouldPlay(false)}
                    onSwipeDown={(state) => onSwipeDown(state)}
                    config={config}
            
            style={{flex:11}}>

                {getFilesEvent[1] ?
                <>
                    <Pressable style={{flex:1,backgroundColor:"transparent"}} onPress={() => handlePauseImage()}>
                                
                        <Video 
                            ref={video}
                            onPress = {() => alert('pressed de la video')}                             
                            //source={{uri: getFilesEvent[0][0]}}
                            source={{uri: getFilesEvent[0][0][0] == 'h' ?  getFilesEvent[0][0] : ipAdress + getFilesEvent[0][0] }}
                            style={{flex:1,width:widthScreen,height:heightScreen - 38}}
                            onError={(e) => console.log(e)}
                            repeat={true}
                            shouldPlay = {shouldPlay}
                            isLooping = {true}
                            resizeMode="contain"
                            posterStyle={{ resizeMode: 'cover', height: '100%' }}
                        />

                        <AnimatedImage
                            //onPress={() => onDoubleTap() }
                            source={{uri : ipAdress + "/media/stopVideo.png"}}
                           // source={{uri : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd_yndmXQuPQbzhQXtLB8zw8f-VkP1AJ6Dg&usqp=CAU"}}
                            style={[
                            {width : widthScreen,
                            height: heightScreen,
                            opacity:0.5
                        },
                            {
                                shadowOffset: { width: 0, height: 20 },
                                shadowOpacity: 0.35,
                                shadowRadius: 35,
                                position:"absolute"
                            },
                            rStyle,
                            ]}
                            resizeMode={'center'}
                        />

                    </Pressable>

                    <View style={{  display:"flex",flexDirection:"row",width:widthScreen,backgroundColor:"blue"}}>
                        

                        <DoubleClick
                            singleTap={() => {
                                alert("you pressed on the video in the doubleClick view")
                                //handlePauseImage()
                                //handleFirstClick(1)
                            }}
                            doubleTap={() => {
                                handleDoubleTap();
                            }}
                            delay={250}
                            style={{
                                backgroundColor: 'green',
                                width:widthScreen/2,        
                            }}
                        >
                        

                        {isAudio &&
                        <Pressable 
                            onPress={() => playSound()}
                            style={{position:"absolute",bottom:40,width:90,height:50,borderRadius:60,backgroundColor:"white",justifyContent:"center",alignItems:"center"}}
                        >
                            {soundPlaying &&
                                <FontAwesome onPress={() => playSound()} name={'microphone'} size={25} style={{color:'black'}} />
                            }
                            {!soundPlaying &&
                                <FontAwesome onPress={() => playSound()} name={'microphone-slash'} size={25} style={{color:'black'}} />
                            }
                        </Pressable>
                        }
                        
                        </DoubleClick>

                    <DoubleClick
                        singleTap={() => {
                            alert("you pressed on the video")
                            //handlePauseImage()
                            //handleFirstClick(-1)
                        }}
                        doubleTap={() => {
                            handleDoubleTap();
                        }}
                        delay={250}
                        style={{
                            backgroundColor: 'red',
                            width:widthScreen/2,
                        }}
                    >
                        <View>
          
                        </View>
                    </DoubleClick>
                    </View>
                </>
                :

                <SwiperFlatList
                    autoplay
                    autoplayDelay={10}
                    autoplayLoop
                    showPagination
                    //index={2}
                    //horizontal={true}
                    //scrollEnabled={false}
                    ref={(swiperRef)}
                    contentContainerStyle={styles.wrapper}
                    data={getFilesEvent[0]}
                    keyExtractor={item => item.id}
                    renderItem={(item , index) => renderFlatlist(item , index)}  
                    />

                }

                 {/* Ecriture en haut de la page ( ville et titre ) */}
                 <View style={{flex:1,display:'flex',justifyContent:'space-around',flexDirection:'row',marginTop:4,overflow:'hidden',position:'absolute'}}>
                        <View style={{flex:3,textAlign:'center'}}>
                        <Text style={{fontSize:30,fontStyle: 'italic',textAlign:'center',marginTop:0,color:'white', textShadowColor:'#585858',
                        textShadowOffset:{width: 5, height: 5},
                        textShadowRadius:10,}}>{event.titre} </Text>
                
                    </View > 
                        <Text style={{fontSize:15,fontStyle: 'italic',textAlign:'center',marginTop:0,color:'white',alignItems:'center', textShadowColor:'#585858',
                        textShadowOffset:{width: 5, height: 5},
                        textShadowRadius:10,}}><MaterialIcons name={'place'} size={20} />{event.city} / {event.codePostal}</Text>
                </View>
                    
                <View style={{...styles.bottomContainer,position:"absolute",marginBottom:50,display:"flex",flexDirection:"column",alignItems:"stretch"}}>

                       {/* Le profil  et les hastages   */}
                       <View style={{flexDirection:"row"}}>
                            <TouchableOpacity style={{}} onPress= {onModalStories} >
                                <View styme={{flexDirection:"row"}}>
                                    <Text style={{color:"white"}}>{event.creatorWinker.username}</Text>
                                    <Image 
                                        resizeMode={'cover'}
                                        style={styles.profilePicture}     
                                        source={{uri: event.creatorWinker.photoProfil}}    
                                        onError ={(error)  => console.warn(error)}
                                    />
                                </View>
                        

                                    {!isAbo &&
                                        <Pressable onPress={() => addAbo()} style={{padding:3,margin:3, backgroundColor:"transparent", opacity: 0.5,borderWidth:1,borderRadius:14}}>
                                            <Text style={{opacity:1,color:"white"}}>S'abonner</Text>
                                        </Pressable>
                                    }
                                    {isAbo &&
                                        <Pressable onPress={() => unFollow()} style={{padding:3,margin:3, backgroundColor:"transparent", opacity: 0.4,borderWidth:1,borderRadius:14}}>
                                            <AntDesign name={'checkcircle'} size={20} style={{color:'white'}} />
                                        </Pressable>
                                    }
                                
                                {/* <Text style={styles.statsLabel}><MaterialIcons name={'add-circle-outline'} size={20} /></Text> */}
                            </TouchableOpacity>

                            <View style={{ flexDirection:"row",justifyContent:"space-around",marginBottom:10,height:90}}>
                              {/* <Text style={{color:"white"}}>
                                 preferenceEvent : {JSON.stringify(event.PreferenceEventField)}
                                listPreferecne {JSON.stringify(listPreference)}
                                </Text>   */}
                                    {/* Pour créer un evenement liée à l'evenement que l'on a comme sur tiktok */}
                                    <FlatList
                                        //contentContainerStyle={{display:"flex",flexWrap:"wrap",flexDirection:"row"}}
                                        data={listPreference}
                                        numColumns={4}
                                        renderItem={renderItemPreference}
                                        keyExtractor={item => item.id.toString()}
                                    />
                                        
                            </View>
                       </View>

                       

                        <Text style={{color:"white"}}>{event.bioEvent} </Text>
                       
        
                </View>
                    
                {/* Right container : la ou se trouve les boutons profil / message / envoie à l'amis et les favoris / demande de participation*/}
                <View style={{...styles.rightContainer}}>
                    <View style={{...styles.uiContainer}}>

                            {/* Les commentaires */}
                        <TouchableOpacity style={styles.iconContainer} >
                             <Fontisto name={'comment'} size={30} style={{color:'white'}} onPress={onModalComment} /> 
                        </TouchableOpacity>


                            {/* Envoi à un ami */}
                        <TouchableOpacity style={styles.iconContainer} >
                            <Fontisto name={'paper-plane'} size={30} style={{color:'white'}} onPress={onModalPaperPlane} />
                        </TouchableOpacity>

                            {/* Pour la réduction et les prix */}
                        {containReduction &&
                            <TouchableOpacity style={styles.iconContainer} >
                                <Fontisto name={'dollar'} size={30} style={{color:'white'}} onPress={onModalOffre} />
                            </TouchableOpacity>             
                        }


                          {/* Savoir si l'evenement est en favori ou pas */}  
                        {!isFavorite && 
                            <TouchableOpacity style={styles.iconContainer} >
                                <Feather name={'bookmark'} size={30} style={{color:'white'}}  onPress={handleFavorite} />
                            </TouchableOpacity> 
                        }
                        {isFavorite && 
                            <TouchableOpacity style={styles.iconContainer} >
                                <FontAwesome name={'bookmark'} size={30} style={{color:'white'}}  onPress={handleFavorite} />
                            </TouchableOpacity> 
                        }

                        {/* Demande de participation */}
                            <TouchableOpacity onPress={() => handleDemandeParticipation()} style={{...styles.iconContainer,justifyContent:"center",alignItems:"center",height:40,backgroundColor:"white",borderRadius:20,opacity:0.4,padding:3}} >

                                <Text style={{color:"black",justifyContent:"center",alignItems:"center"}}>{ event.accessOuvert ? "Participation libre" : "Participer"}</Text>

                            </TouchableOpacity>
         



                        {/* On fait trois View vide pour pas que la boutton de participation gêne la bio et les hastags */}
                        <View style={styles.iconContainer}>

                        </View>

                        <View style={styles.iconContainer}>

                    </View>

                        <View style={styles.iconContainer}>

                        </View>
                        
                    </View>
                </View>    
            
            </GestureRecognizer>
{/* *********************************************POUR LES COMMENTAIRES************************************************** */}

                {/* Modal pour les commentaires */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleComment}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={onModalComment} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View style={{backgroundColor:'white', flex:1,borderRadius:25}}>
                        {event.accessComment ?
                        <>
      
                        <View style={{flex:4}}>
                     
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        onRefresh={() => setModalVisibleComment(false)}
                                    />
                                }
                                data={dataComment}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) => renderItemComment(item)}// ici, on definie ce qui va apparaitre dans les props de notre EentItem
                            />

                        </View>
                    
                        <View style={{bottom:3,flex:1}}>
                            
                            <TouchableOpacity style={{...styles.searchSection, backgroundColor:"white"}}>   
                                <TextInput
                                    ref={refTextInputComment}
                                        style={styles.input}
                                        placeholder="Commentez ici !"
                                        placeholderTextColor={"black"}
                                        onChangeText={(searchString) => {isWritingComment(searchString)}}
                                        underlineColorAndroid="transparent"
                                        value={commentText}
                                />

                                <TouchableOpacity onPress={()=> handleSendComment(commentText)} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                                    <Feather style={styles.searchIcon} name="send" size={20} color="#000"/>
                                </TouchableOpacity>

                                
                            </TouchableOpacity>
                            
                            {/* <View style={styles.searchSection}>   
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Commentez ici !"
                                        onChangeText={(searchString) => {isWritingComment(searchString)}}
                                        underlineColorAndroid="transparent"
                                        value={commentText}
                                    />
                                    <Feather style={styles.searchIcon} onPress={()=> handleSendComment(commentText)} name="send" size={20} color="#000"/>
                            </View> */}
                            
                        </View>
                        
                        </>
                         :
                   
                          <Text style={{color:"black",marginTop:"40%",justifyContent:"center",alignItems:"center",marginLeft:"20%"}}>Les commentaires sont désactivés</Text>
                    
                                     
                        }

                 
                    </View>
                    
                    
                </View>
            
            </Modal>             

                {/* Modal pour envoyer à un ami */}
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
                    
                    <TouchableOpacity onPress={onModalPaperPlane} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                        <View style={{display:'flex',flexDirection:'row',marginTop:15}} >
                            <TextInput
                                style={{borderWidth:1,borderColor:'black',width:"100%",borderRadius:10}}
                                placeholder="Envoyez cet évènement à un ami !"
                                onChangeText={(searchString) => {handleSearchWinker(searchString)}}
                                underlineColorAndroid="transparent"
                            />

                            <TouchableOpacity style={{backgroundColor:'transparent',marginTop:9,transform: [{ translateX: -34 }]}} >
                                <Fontisto name={'search'} size={27} style={{color:'white'}}  />
                            </TouchableOpacity>
                        </View>


                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => setModalVisiblePaperPlane(false)}
                                />
                            }
                            data={!isSearchingWinker ? winkersChat : dataWinkers}
                            renderItem={renderItemEnvoieAmie}
                            keyExtractor={item => item.id}
                            scrollEnabled={true}
                        />

                    </View>

                    {listIdUserSendEvent.length != 0 ?
                        <Button onPress={() =>sendEventFriends() } title="Envoyer" />
                        :
                        <Button title="" />
                    }

                </View>
            
            </Modal>
       
                 {/* Modal pour voir l'offre */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleOffre}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={onModalOffre} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:1,borderRadius:25}}>
                        {!isPrice &&
                            <Text style={{textAlign:'center',fontSize:30}}>Réduction</Text>
                        }
                        {isPrice &&
                            <Text style={{textAlign:'center',fontSize:30}}>Prix</Text>
                        }

                        
                        <Text></Text>
                        {!isPrice &&
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={{color:'red',fontSize:30}}>{prixInitial}€ </Text>
                            <Text style={{marginTop:10}}><FontAwesome name="exchange" size={20} /></Text>
                            <Text style={{color:'green',fontSize:30}}> {prixReduction}€</Text>
                        </View>
                        }

                        {isPrice &&
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                            <Text style={{color:'green',fontSize:30}}>{prixInitial}€ </Text>
                        </View>            
                        }
                        
                        <Text></Text>
                        <Text>{textReduction}.</Text>
                        
                    </View>
                    
                </View>
            
            </Modal>
                
                {/* Modal pour voir les stories */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleStories}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleStories(!modalVisibleStories);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={onModalStories} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:8,borderRadius:25,borderWidth: 3,borderColor: "white",flexDirection:"column"}}>

                        <View style={{flex:3,flexDirection:"row",backgroundColor:'red'}}>
                            <View style={{flex:2,backgroundColor:'pink'}}>

                            </View>
                            <View style={{flex:1,backgroundColor:'yellow'}}>
                                
                            </View>
                        </View>
                        <View style={{flex:1,backgroundColor:'orange'}}>

                        </View>
                    </View>

                    <TouchableOpacity onPress={onModalStories} style={{flex:2,opacity:0, backgroundColor:'transparent',borderColor: 'red'}}></TouchableOpacity>
                    
                </View>
            
            </Modal>

                {/* Modal pour les hastags */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleHastag}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleHastag(!modalVisibleHastag);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={onModalHastag} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:8,borderRadius:25,borderWidth: 3,borderColor: "white"}}>
                        <Text style={{textAlign:'center',fontSize:30,borderColor: 'red',}}>Hastag !</Text>
                        <View style={{fontSize:30,color:'blue'}}>
                            <Text>{JSON.stringify(dataHastag)}</Text>
                        {/* {
                            dataHastag &&
                            dataHastag.map(hastag => <Text>{hastag}</Text>)
                         } */}
                        </View>
                    </View>

                    <TouchableOpacity onPress={onModalHastag} style={{flex:2,opacity:0, backgroundColor:'transparent',borderColor: 'red'}}></TouchableOpacity>
                    
                </View>
            
            </Modal>
                
                {/* Modal pour voir les participants */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleParticipants}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleHastag(!modalVisibleParticipants);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={onModalParticipants} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:8,borderRadius:25,borderWidth: 3,borderColor: "white"}}>
                    
                    <ScrollView style={{marginLeft:20}}>
                        <View style={{flexDirection: "row",flexWrap: "wrap",SjustifyContent: "space-evenly",marginLeft:10}}>
                       
                        <Pressable
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                                onPress={() => {
                                    setOpacity(0);
                                    // navigation.navigate("Story", { story });
                                    alert('you clicked')
                                }}
                            >
                            
                            <SharedElement id={1}>
                                <View style={[{width: Dimensions.get("window").width / 2 - 16 * 2}, { opacity }]}>
                                    <Image source={{uri: event.creatorWinker.photoProfil}} style={{flex:1,width: Dimensions.get("window").width / 2 -  62,height:(Dimensions.get("window").width / 2 -  62)*1.2, margin:10,borderRadius:10}} />
                                </View>
                            </SharedElement>
                            
                        </Pressable> 

                            <Pressable
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                                onPress={() => {
                                    setOpacity(0);
                                    // navigation.navigate("Story", { story });
                                    alert('you clicked')
                                }}
                            >
                            
                            <SharedElement id={1}>
                                <View style={[{width: Dimensions.get("window").width / 2 - 16 * 2}, { opacity }]}>
                                    <Image source={require("../../Image/Julie01.jpg")} style={{flex:1,width: Dimensions.get("window").width / 2 -  62,height:(Dimensions.get("window").width / 2 -  62)*1.2, margin:10,borderRadius:10}} />
                                </View>
                            </SharedElement>
                            
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                                onPress={() => {
                                    setOpacity(0);
                                    // navigation.navigate("Story", { story });
                                    alert('you clicked')
                                }}
                            >
                            
                            <SharedElement id={1}>
                                <View style={[{width: Dimensions.get("window").width / 2 - 16 * 2}, { opacity }]}>
                                <Image source={require("../../Image/Julie2.jpg")} style={{flex:1,width: Dimensions.get("window").width / 2 -  62,height:(Dimensions.get("window").width / 2 -  62)*1.2, margin:10,borderRadius:10}} />
                                </View>
                            </SharedElement>
                            
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                                onPress={() => {
                                    setOpacity(0);
                                    // navigation.navigate("Story", { story });
                                    alert('you clicked')
                                }}
                            >
                            
                            <SharedElement id={1}>
                                <View style={[{width: Dimensions.get("window").width / 2 - 16 * 2}, { opacity }]}>
                                <Image source={require("../../Image/PhotoProfil.jpg")} style={{flex:1,width: Dimensions.get("window").width / 2 -  62,height:(Dimensions.get("window").width / 2 -  62)*1.2, margin:10,borderRadius:10}} />
                                </View>
                            </SharedElement>
                            
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                                onPress={() => {
                                    setOpacity(0);
                                    // navigation.navigate("Story", { story });
                                    alert('you clicked')
                                }}
                            >
                            
                            <SharedElement id={1}>
                                <View style={[{width: Dimensions.get("window").width / 2 - 16 * 2}, { opacity }]}>
                                <Image source={require("../../Image/NouvelleJulie.jpeg")} style={{flex:1,width: Dimensions.get("window").width / 2 -  62,height:(Dimensions.get("window").width / 2 -  62)*1.2, margin:10,borderRadius:10}} />
                                </View>
                            </SharedElement>
                            
                            </Pressable>
                        </View>

                    </ScrollView>


                    </View>

                    <TouchableOpacity onPress={onModalParticipants} style={{flex:2,opacity:0, backgroundColor:'transparent',borderColor: 'red'}}></TouchableOpacity>
                    
                </View>
            
            </Modal>

                {/* Modal pour les demandes de participation */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleParticipation}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleHastag(!modalVisibleParticipation);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={onModalParticipation} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:8,borderRadius:25,borderWidth: 3,borderColor: "white"}}>
            
                        
                        {!createGroupePrivee &&
                            <TouchableOpacity onPress={() => handleDemandeParticipation()} style={{flex:1, backgroundColor:"rgb(57, 99, 135)",borderRadius:25,alignItems: 'center',justifyContent: 'center'}} >
                                <Text style={{fontSize:25}}>
                                    Valider la demande de participation ?
                                </Text>
                                {!event.accessOuvert &&

                                    <TextInput 
                                        style={{height: 40, margin: 12,borderWidth: 1,padding: 10,}}
                                        numberOfLines={4}
                                        placeholder="Vous pouvez ecrire un message à l'organisateur ici"
                                        onChangeText={text => setMessageDemandeParticipation(text)}
                                    />

                                }

                            </TouchableOpacity>
                        }
                        

                    </View>

                    <TouchableOpacity onPress={onModalParticipation} style={{flex:2,opacity:0, backgroundColor:'transparent',borderColor: 'red'}}></TouchableOpacity>
                    
                </View>
            
            </Modal>
        </View>
    )
})

export default EventItem;