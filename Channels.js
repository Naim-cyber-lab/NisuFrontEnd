import { ListItem, Avatar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import {View, ScrollView, Text, Button, StyleSheet, TextInput, TouchableWithoutFeedback,Modal, Dimensions, TouchableOpacity, Pressable, Image,Alert,RefreshControl } from 'react-native';
import Navigation from '../../navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//***************POUR LE REDUX ****************** */

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


import { setCurrentUser, setWinkersChat } from "../Register/store";


//************************************************** */


import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Entypo from 'react-native-vector-icons/Entypo';


import App from "../Register/Router"


import axios from 'axios';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { FlatList } from 'react-native-gesture-handler';
import { hasConstantsManifest } from 'expo-linking';
import { FontAwesome5 } from '@expo/vector-icons';



const list = [
  {
    name: 'Sondage',
    date: '12 mars 2021',
    buttonInside:'Nouveau Sondage',
    title:"Nouveau Sondage"
  },
//   {
//     name: 'Important',
//     date: '13 janvier 2023',
//     buttonInside:'Ajouter une demande',
//     title:"Important"
//   },
]

function NavigationFunction ({navigation , route}) {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer
        independent={true}
        >
            <Stack.Navigator>
                <Stack.Screen initialParams={{ item: route.params["item"]  }}  name="channels" component={Channels} options={{headerShown:false, height:10}}  />
                <Stack.Screen initialParams={{ item: route.params["item"] }}  name="sondage" component={Sondage} options={{headerShown:false, height:10}}  />
                <Stack.Screen  name="App" component={App} options={{headerShown:false, height:10}}  />
            </Stack.Navigator>
        </NavigationContainer>
    )
  }

export default NavigationFunction;

const Channels = ({navigation, route}) => {

    const {item , } = route.params;


    //*****************POUR LE REDUX **************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
    const winkersChat = useSelector((state) => state.winkersChat);//pour l'envoie de l'event à un ami
    const currentUser = useSelector((state) => state.currentUser);
    
    const dispatch = useDispatch();

    //*************************************************************************** */

    
    const widthScreen = Dimensions.get('window').width;
    const heightScreen = Dimensions.get('window').height;


    //*************************************************************************** */
    
    const [text, setText] = useState('');
    const [data , setData] = useState(route.params["item"])


    const [modalVisibleNouveauSondage, setModalVisibleNouveauSondage] = useState(false);
    const onModalNouveauSondage = () => {
        setModalVisibleNouveauSondage(!modalVisibleNouveauSondage);
    };

    const [modalVisibleNouveauImportant, setModalVisibleNouveauImportant] = useState(false);
    const onModalNouveauImportant = () => {
        setModalVisibleNouveauImportant(!modalVisibleNouveauImportant);
    };

    //******************************** POUR LE SONDAGE ************************************ */

    const [questionSondage, setQuestionSondage] = useState("");
    const [choix1, setChoix1] = useState("");
    const [choix2, setChoix2] = useState("");
    const [choix3, setChoix3] = useState("");
    const [choix4, setChoix4] = useState("");
    const [choix5, setChoix5] = useState("");
    const [choix6, setChoix6] = useState("");
    const [choix7, setChoix7] = useState("");

    const [listChoixSondage, setListChoixSondage] = useState([]);

    const sendNewSondage = () => {

        const booleanGroupPrive = false;
        if(data.groupPrive != null){
            booleanGroupPrive = true;
        }

        axios.post(ipAdress + '/profil/addNewSondage/', {
            booleanGroupPrive: booleanGroupPrive,
            event : JSON.stringify(data.event),//Peut etre null dans le cas d'un groupe prive
            groupPrive : JSON.stringify(data.groupPrive),

            choix1: choix1,
            choix2: choix2,
            choix3: choix3,
            choix4: choix4,
            choix5: choix5,
            choix6: choix6,
            choix7: choix7,
            questionSondage: questionSondage,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
              alert("votre sondage a bien ete ajouté !")
              setModalVisibleNouveauSondage(false)
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    //**************************************************************************************** */

    //**********************POUR VOIR LES PARTICIPANTS DE L'EVENT *****************************/

    const [modalVisibleParticipant, setModalVisibleParticipant] = useState(false);
    const [dataParticipants, setDataParticipants] = useState({})

    const onModalParticipant = () => {


        //*************IL FAUT CHOISIR ENTRE L'ID DE L'EVENT ET L'ID DU GROUP PRIVE SI C UN GROUPE PRIVE */

        axios.post(ipAdress + '/profil/getDataParticipants/', {
                booleanGroupPrive: item.groupPrive ? true : false,
                event : JSON.stringify(item.event),//Peut etre null dans le cas d'un groupe prive
                groupPrive : JSON.stringify(item.groupPrive),
                groupPriveId : item.groupPrive ?  item.groupPrive.id : 0,
            }, {
                headers: {
                'Authorization': 'Token '+token
                }
            })
            .then(function (response) {
                setDataParticipants(response.data.data)
            })
            .catch(function (error) {
                console.log("EERRREEEUUUUURRRRRr")
                console.log(error);

            });

            setModalVisibleParticipant(true);


    }

    const QuitterParticipeWinker = () => {
        return Alert.alert(
          "Are your sure?",
          "Are you sure you want to leave this event ?",
          [
            // The "Yes" button
            {
              text: "Yes",
              onPress: () => {
        
                alert("on quitte l'event")

                axios.post(String(ipAdress)+'/profil/quitteEvent/', {
                    idParticipeWinker: data.id,
                  },
                 { headers: {
                      'Authorization': 'Token ' + token
                  }})
                  .then(function (response) {
                      navigation.navigate("App")
                  })
                  .catch(function (error) {
                    alert("il y a eu une erreur");
                    navigation.navigate("App")
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
      };


    const handleSupressionUser = (item) => {
        return Alert.alert(
          "Are your sure?",
          "Are you sure you want to remove "+item.participeWinker.username +" ?",
          [
            // The "Yes" button
            {
              text: "Yes",
              onPress: () => {
                console.log(item)
                axios.post(ipAdress + '/profil/deleteParticipeWinker/', {
                    idParticipeWinker: item.id,
                    idWinker: item.participeWinker.id
                  }, {
                    headers: {
                      'Authorization': 'Token '+token
                    }
                })
                  .then(function (response) {
                      onModalParticipant();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                alert("la suppresion a ete faite")
                
              },
            },
            // The "No" button
            // Does nothing but dismiss the dialog when tapped
            {
              text: "No",
            },
          ]
        );
      };


    //******************************* POUR INVITER UN AMI *************************************/

    const [modalVisiblePaperPlane, setModalVisiblePaperPlane] = useState(false);

    const [dataWinkers, setDataWinkers] = useState( {} );
    const [firstDataWinkers, setFirstDataWinkers] = useState( {} );

    const [isSearchingWinker , setIsSearchingWinker] = useState(false)

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
        }else{
            setIsSearchingWinker(true)
        }
        
        setDataWinkers(firstDataWinkers.filter(item => item.username.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())))
    }
    
    const [listIdUserSendEvent , setListIdUserSendEvent] = useState([]);


    //************************* */
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


    //*********************** */
    const sendEventFriends = () => {

        console.log("voici la liste à envoyer : ",listIdUserSendEvent)

 

        axios.post(ipAdress + '/profil/addEventFriends/', {
            booleanGroupPrive: item.groupPrive ? true : false,
            event : JSON.stringify(data.event),//Peut etre null dans le cas d'un groupe prive
            groupPrive : JSON.stringify(data.groupPrive),
            listIdUserSendEvent: listIdUserSendEvent,
            groupPriveId : item.groupPrive ?  item.groupPrive.id : 0,
           }, {
             headers: {
               'Authorization': 'Token '+token
             }
         })
           .then(function (response) {
            setModalVisiblePaperPlane(false)
               alert("les winkers participent maintenant à l'event ! :)")
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
                                    style={{width: 50,height: 50,borderRadius: 25,borderWidth: 3,borderColor: '#4c4c4c',}}
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
                    <Pressable onPress = {() => addOrRemoveIdGroup(item.id)} style= {{ backgroundColor:  containsDataWinkers(listIdUserSendEvent ,item.id) ? "green" : "transparent", display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10 }}>
                    <View style={{display:'flex',flexDirection:'row',flex:3}}>
                        <Image
                                style={{width: 50,height: 50,borderRadius: 25,borderWidth: 3,borderColor: '#4c4c4c',}}
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
                                    style={{width: 50,height: 50,borderRadius: 25,borderWidth: 3,borderColor: '#4c4c4c',}}
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
    //**************************************************************************************** */

    const [modalVisibleChangeDateComplete, setModalVisibleChangeDateComplete] = useState(false)
    const [newDateComplete, setNewDateComplete] = useState("")
    const [modalVisibleChangeAdresse, setModalVisibleChangeAdresse] = useState(false)
    const [newAdresse, setNewAdresse] = useState("")

    const handleChangeDateComplete = () => {

        const booleanGroupPrive = false;
        if(data.groupPrive != null){
            booleanGroupPrive = true;
        }

        axios.post(ipAdress + '/profil/changeDateComplete/', {
            booleanGroupPrive: booleanGroupPrive,
            event : JSON.stringify(data.event),//Peut etre null dans le cas d'un groupe prive
            groupPrive : JSON.stringify(data.groupPrive),
            newDateComplete : newDateComplete,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
              alert("votre modification a bien été éffectuée")
              RefreshData()
              setModalVisibleChangeDateComplete(false)
          })
          .catch(function (error) {
            console.log(error);
          });

    }

    const handleChangeAdresse = () => {

        const booleanGroupPrive = false;
        if(data.groupPrive != null){
            booleanGroupPrive = true;
        }

        axios.post(ipAdress + '/profil/changeAdresse/', {
            booleanGroupPrive: booleanGroupPrive,
            event : JSON.stringify(data.event),//Peut etre null dans le cas d'un groupe prive
            groupPrive : JSON.stringify(data.groupPrive),
            newAdresse : newAdresse,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
              alert("votre modification a bien été éffectuée")
              RefreshData()
              setModalVisibleChangeAdresse(false)
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    //**************************************************************************************** */

    const [modalSeeEvent,setModalSeeEvent] = useState(false);

    const [eventSee, setEventSee] = useState({});

    const handleSeeModalEvent = () => {
        if(data.groupPrive != null){
            setEventSee(data.groupPrive.event)
        }
        else{
            setEventSee(data.event)
        }

        setModalSeeEvent(true)
    }

    //**************************************************************************************** */

    const [modalVisibleRemarque , setModalVisibleRemarque] = useState(false)

    const [newRemarque, setNewRemarque] = useState("")

    const handleSendRemarque = () => {

        const booleanGroupPrive = false;
        if(data.groupPrive != null){
            booleanGroupPrive = true;
        }

        axios.post(ipAdress + '/profil/changeRemarque/', {
            booleanGroupPrive: booleanGroupPrive,
            event : JSON.stringify(data.event),//Peut etre null dans le cas d'un groupe prive
            groupPrive : JSON.stringify(data.groupPrive),
            newRemarque : newRemarque,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
              alert("votre modification a bien été éffectuée")
              RefreshData()
              setModalVisibleRemarque(false)
          })
          .catch(function (error) {
            console.log(error);
          });

    }


    //********************************* CREATION D'UN GROUPE PRIVE ****************************** */

    const [modalVisibleParticipationPrive, setModalVisibleParticipationPrive] = useState(false);

    const [listIdentification, setListIdentification] = useState([]);


    const onModalParticipationPrive = () => {

        setModalVisibleParticipationPrive(!modalVisibleParticipationPrive);
     
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

                return(
                <Pressable onPress = {() => addOrRemoveListIdentificationDataWinkers(item.participeWinker.id)}
                style=
                {{
                backgroundColor: containsDataWinkers(listIdentification ,item.participeWinker.id) ?
                    "green" :
                    "transparent",
                display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
                    <View style={{display:'flex',flexDirection:'row',flex:3}}>
                    
                        <Image
                            style={{   width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderWidth: 2,
                                borderColor: '#4c4c4c',}}
                            source={{uri: item.participeWinker.photoProfil }}
                        /> 
                            
                            <Text> {item.participeWinker.username}</Text>
                    
            
                    </View>
            
                </Pressable>
                )

            
    }

    function containsDataWinkers(list , x) {
        for(var u of list){
            if(u == x){
                return true;
            }
        }
        return false;
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

    //******************************************************************************************* */


    //**************************************************************************************** */

    const RefreshData = () => {
        axios.post(ipAdress + '/profil/refreshDataParticipeWinker/', {
            participeWinkerId : data.id
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
          .then(function (response) {
            console.log("voici la rep de refreshData : ",response.data)
              setData(response.data.data[0])
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
    <View style={{flex:1}}>
             <ScrollView>

                <View style={{width:"100%",height: Dimensions.get('window').height / 2 ,backgroundColor:"grey",borderRadius:20}}>
                    <ScrollView>
                        
                        <Text style={{textAlign:'center',fontSize:30}}>Important !</Text>
                        <View style={{borderColor:'black',borderWidth:1}}>
                            {data.rang != 2 &&
                            
                            <Text><Text style={{fontSize:23,color:'black'}}>Date :</Text> {data.groupPrive != null ? data.groupPrive.event.dateComplete : data.event.dateComplete}</Text>
                            
                            }
                        
                            {data.rang == 2 && data.groupPrive == null &&
                            
                            <TouchableOpacity onPress={() => setModalVisibleChangeDateComplete(true)}   style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                                <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> {data.event.dateComplete != null ? data.event.dateComplete : "insérer une date"} </Text>
                            </TouchableOpacity>
                            }

                            {data.rang != 2 &&
                            
                            <Text><Text style={{fontSize:23,color:'black'}}>{data.groupPrive != null ? data.groupPrive.event.adresse : data.event.adresse}</Text>{}</Text>
                            
                            }

                            {data.rang == 2 && data.groupPrive == null &&
                            
                            <TouchableOpacity onPress={() => setModalVisibleChangeAdresse(true)} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                                <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> {data.event.adresse != null ? data.event.adresse : "insérer une adresse"} </Text>
                            </TouchableOpacity>
                            }



                        <View style={{justifyContent:"center", alignItems:"center",marginTop : 20}}>
                            {data.rang == 2 ?

                            <Text onPress={() => setModalVisibleRemarque(true)} style={{color:"black",fontSize:20 ,fontStyle: 'italic' , lineHeight:36,paddingLeft:10,paddingRight:5,marginTop:-8}}>
                                {data.groupPrive != null ? data.groupPrive.remarque : data.event.remarque}_____
                                <Entypo name="pencil" size={30}  style={{color:'black',marginTop:8,marginLeft:20,marginRight:30}} />
                            </Text>

                        :

                            <Text style={{color:"black",fontSize:20 ,fontStyle: 'italic' , lineHeight:36,paddingLeft:10,paddingRight:5,marginTop:-8}}>
                                {data.groupPrive != null ? data.groupPrive.remarque : data.event.remarque}_____
                                <Entypo name="pencil" size={30}  style={{color:'black',marginTop:8,marginLeft:20,marginRight:30}} />
                            </Text>
                        
                        }
                            
                        </View>

                        </View>
                        
                        
                    </ScrollView>
                </View>

            {  
            list.map((l, i) => (    
                <ListItem key={i} bottomDivider>
                    {/* <Avatar source={{uri: l.avatar_url}} /> */}
                    {l.title == "Nouveau Sondage" &&
                    <ListItem.Content  style={{display:'flex', flexDirection:'row',justifyContent:'space-between'}}>

                        <Pressable style={{flex:1}} onPress = {() => navigation.navigate('sondage',{"data":data})} >
                            <ListItem.Title>{l.name}</ListItem.Title>
                        <ListItem.Subtitle>{l.date}</ListItem.Subtitle>
                        </Pressable>

                        <View>
                            <Button title={l.title} onPress= {onModalNouveauSondage}  />
                        </View>
                </ListItem.Content>
            }

            {l.title != "Nouveau Sondage" &&
            <ListItem.Content style={{display:'flex', flexDirection:'row',justifyContent:'space-between'}} onPress = {onModalNouveauImportant}>

                <Pressable onPress={onModalNouveauImportant} style={{width:"100%"}}>       
                    <ListItem.Title>{l.name}</ListItem.Title>
                    <ListItem.Subtitle>{l.date}</ListItem.Subtitle>
                </Pressable>

            </ListItem.Content>
            
            }
            </ListItem>
            ))
            }

                <TouchableOpacity onPress={() => onModalParticipant()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                    <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Voir les participants</Text>
                </TouchableOpacity>

                {data.event &&
                    <TouchableOpacity onPress={() => onModalParticipationPrive()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                        <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Créer un groupe prive</Text>
                    </TouchableOpacity>
                }


                <TouchableOpacity onPress={() => QuitterParticipeWinker()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                    <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Quitter l'evenement</Text>
                </TouchableOpacity>
                
                {data.rang >= 1  &&
                <TouchableOpacity onPress={onModalPaperPlane} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                    <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Inviter des winkers !</Text>
                </TouchableOpacity>
                }

                {data.rang >= 1  &&
                <TouchableOpacity onPress={() => handleSeeModalEvent()} style={{elevation: 8,backgroundColor: "#009688",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                    <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> VOIR L'EVENT</Text>
                </TouchableOpacity>
                }
            
            </ScrollView>

                {/* Modal pour voir les participants */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleParticipant}
            onRequestClose={() => {
            alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute',bottom:0,width:'100%',height: Dimensions.get('window').height}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleParticipant(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'rgb(186, 186, 186)', flex:3,borderRadius:25}}>
                        {/* <Text>{JSON.stringify(dataParticipants.data)}</Text> */}
                                <FlatList
                                    refreshControl={
                                            <RefreshControl
                                                onRefresh={() => setModalVisibleParticipant(false)}
                                            />
                                    }
                                    data={dataParticipants}
                                    renderItem={({item}) => (
                                    <View style={{flexDirection:"row",justifyContent:"space-evenly",height:60,margin:5,borderColor:"black",borderWidth:1,alignItems:"center"}}>
                                        <Image
                                            style={{width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            borderWidth: 5,
                                            borderColor: '#4c4c4c',
                                            }}
                                            source={{uri: item.participeWinker.photoProfil}}
                                        />
                                        {item.rang == 1  &&
                                            <Text>Super utilisateur</Text>
                                        }

                                        {item.rang == 2  ?
                                        <FontAwesome5 name="crown" color="yellow" size={24} />
                                        :
                                        <TouchableOpacity
                                        style={{backgroundColor:"rgb(191, 114, 227)", padding:10,borderRadius:5}} 
                                        onPress={() => handleSupressionUser(item)}
                                         >
                                            <Text>Exclure</Text>
                                        </TouchableOpacity>
                                        }

                                  
                                         
                                
                                        <Text> {item.participeWinker.username}</Text>

                                    
                                    </View>  
                                    )}
                                    keyExtractor={item => item.id}
                                /> 
                             
                             <View>
                                <Text>Voici mon rang actuel : {data.rang}</Text>
                             </View>
                        

                    </View>
                    

            </View>
            
        </Modal>

                {/* Modal pour le sondage */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleNouveauSondage}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute',bottom:0,width:'100%',height: Dimensions.get('window').height}}>
                    
                    <TouchableOpacity onPress={onModalNouveauSondage} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:2.6,borderRadius:25}}>
                        <ScrollView>
                            <Text style={{textAlign:'center',fontSize:30}}>Nouveau Sondage !</Text>
                           
                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Question du sondage ?"
                                onChangeText={text => setQuestionSondage(text)}
                                defaultValue={text}
                            />
                            <Text>{'\n'}</Text>
                                 
                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 1"
                                onChangeText={text => setChoix1(text)}
                                defaultValue={text}
                            />
                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 2"
                                onChangeText={text => setChoix2(text)}
                                defaultValue={text}
                            />

                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 3"
                                onChangeText={text => setChoix3(text)}
                                defaultValue={text}
                            />

                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 4"
                                onChangeText={text => setChoix4(text)}
                                defaultValue={text}
                            />

                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 5"
                                onChangeText={text => setChoix5(text)}
                                defaultValue={text}
                            />
                            
                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 6"
                                onChangeText={text => setChoix6(text)}
                                defaultValue={text}
                            />

                            <TextInput
                                style={{height: 40,borderWidth:1}}
                                placeholder="Proposition 7"
                                onChangeText={text => setChoix7(text)}
                                defaultValue={text}
                            />
                           
                           <Button title="Valider" onPress={() => sendNewSondage()}/>
                             {/* <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                }}
                            /> */}
                        </ScrollView>
                        
                    </View>
                    
                    <TouchableOpacity onPress={onModalNouveauSondage} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

            </View>
            
        </Modal>

                {/* Modal pour  ajouter des trucs important */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleNouveauImportant}
            onRequestClose={() => {
            alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute',bottom:0,width:'100%',height: Dimensions.get('window').height}}>
                    
                    <TouchableOpacity onPress={onModalNouveauImportant} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'rgb(186, 186, 186)', flex:3,borderRadius:25}}>
                    <TextInput
                        style={{borderWidth:1 , padding:10, height: 40 , width:"70%",margin:30}}
                        onChangeText={(text) => console.log(text)}
                        placeholder="Ajouter qlqch ici"
                    />
                        
                    </View>
                    
                    <TouchableOpacity onPress={onModalNouveauImportant} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

            </View>
            
        </Modal>


        {/* Modal pour changer l'adresse */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleChangeAdresse}
            onRequestClose={() => {
            alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute',bottom:0,width:'100%',height: Dimensions.get('window').height}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleChangeAdresse(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'rgb(186, 186, 186)', flex:3,borderRadius:25}}>
                    <TextInput
                        style={{borderWidth:1 , padding:10, height: 40 , width:"70%",margin:30}}
                        onChangeText={(text) => setNewAdresse(text)}
                        placeholder="Ajouter qlqch ici"
                    />
                    
                    <TouchableOpacity onPress={() => handleChangeAdresse()} style={{elevation: 8,backgroundColor: "green",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                        <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Valider </Text>
                    </TouchableOpacity>

                    </View>
                    
                    <TouchableOpacity onPress={() => setModalVisibleChangeAdresse(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

            </View>
            
        </Modal>


        {/* Modal pour changer la date complete*/}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleChangeDateComplete}
            onRequestClose={() => {
            alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute',bottom:0,width:'100%',height: Dimensions.get('window').height}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleChangeDateComplete(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'rgb(186, 186, 186)', flex:3,borderRadius:25}}>
                    <TextInput
                        style={{borderWidth:1 , padding:10, height: 40 , width:"70%",margin:30}}
                        onChangeText={(text) => setNewDateComplete(text)}
                        placeholder="Ecrivez la date et l'heure de votre evenement"
                    />

                    <TouchableOpacity onPress={() => handleChangeDateComplete()} style={{elevation: 8,backgroundColor: "green",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                        <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Valider </Text>
                    </TouchableOpacity>
                        
                    </View>
                    
                    <TouchableOpacity onPress={() => setModalVisibleChangeDateComplete(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

            </View>
            
        </Modal>

            {/* Modal pour changer la remarque lie à l'event ou au groupe prive */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleRemarque}
            onRequestClose={() => {
            alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute',bottom:0,width:'100%',height: Dimensions.get('window').height}}>
                    
                    <TouchableOpacity onPress={() => setModalVisibleRemarque(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'rgb(186, 186, 186)', flex:3,borderRadius:25}}>
                    <TextInput
                        style={{borderWidth:1 , padding:10, height: 40 , width:"70%",margin:30}}
                        onChangeText={(text) => setNewRemarque(text)}
                        placeholder="Ecrivez ici."
                    />

                    <TouchableOpacity onPress={() => handleSendRemarque()} style={{elevation: 8,backgroundColor: "green",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
                        <Text style={{fontSize: 18,color: "#fff",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}> Valider </Text>
                    </TouchableOpacity>
                        
                    </View>
                    
                    <TouchableOpacity onPress={() => setModalVisibleRemarque(false)} style={{flex:1.5,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>

            </View>
            
        </Modal>

                {/* Modal pour inviter un ami */}
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
                                placeholder="Envoyer cet évènement à un ami !"
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
                            data={!isSearchingWinker ? winkersChat.filter(element => element.winker2 != null) : dataWinkers}
                            // keyExtractor={(item) => item.id}
                            renderItem={renderItemEnvoieAmie}
                            keyExtractor={item => item.id}
                        />
                    </View>

                    {listIdUserSendEvent.length != 0 ?

                    <TouchableOpacity onPress={() => sendEventFriends() } style={{backgroundColor:"rgb(79, 149, 189)" , borderRadius:10,height:40,marginBottom:8,alignItems:"center",justifyContent:"center"}}>
                        <Text>ENVOYER</Text>
                    </TouchableOpacity>
                    

                        :

                    <TouchableOpacity onPress={() => alert("vous n'avez séléctionner encore personne ;)") } style={{backgroundColor:"rgb(79, 149, 189)" , borderRadius:10,height:40,marginBottom:8,alignItems:"center",justifyContent:"center"}}>
                        <Text></Text>
                    </TouchableOpacity>

                    }
                        
                    
                </View>
            
        </Modal>

                {/* Modal pour voir l'event en question */}
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalSeeEvent}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: heightScreen - 38}}>
                    
                    <TouchableOpacity onPress={() => setModalSeeEvent(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                 
                    <View style={{backgroundColor:'grey', flex:3,borderRadius:25}}>

                     <Text>
                     {JSON.stringify(eventSee)}
                        </Text>  
               
                    </View>
                        
                    
                </View>
            
        </Modal>

        {/* Modal pour les groupes privés */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleParticipationPrive}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            }}
        >
            
            <Pressable style={{flex:1,opacity:0.3}} onPress={() => setModalVisibleParticipationPrive(false)}></Pressable>
            
            <View style={{flex:2,flexDirection:'row',backgroundColor:"white"}}>
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row',justifyContent:"space-around",borderWidth:1,borderRadius:5,height:45}}>
                        <TextInput placeholder="Recherche d'amis"
                                style={{backgroundColor:"transparent",width:"90%"}}
                                onChangeText={(searchString) => {handleSearchWinker(searchString)}}
                            />
                            
                            <Fontisto name={'search'} size={12} style={{color:'rgb(88, 86, 86)',marginTop:17}}  />
                    </View>
                    <View style={{height:"80%"}}>
                                                                        
                                    <FlatList
                                           refreshControl={
                                            <RefreshControl
                                                onRefresh={() => setModalVisibleParticipationPrive(false)}
                                            />
                                        }
                                            data={dataParticipants}
                                            renderItem={renderItemGroupePrive}
                                            keyExtractor={item => item.id}
                                        /> 
                                    
                                    </View>
                                </View>
                                {listIdentification.length != 0 ?
                                <TouchableOpacity onPress={() => creationGroupePrive()} style={{position:"absolute",bottom:2,alignItems:"center",justifyContent:"center",width:"100%",height:"8%",marginRight:30,backgroundColor:"blue",borderRadius:12}}>
                                    <Text style={{textAlign:"center"}}>Valider</Text>
                                </TouchableOpacity>
                               
                               :
                               
                               <View style={{position:"absolute",bottom:2,alignItems:"center",justifyContent:"center",width:"100%",height:"8%",marginRight:30,backgroundColor:"white",borderRadius:12,opacity:0.2}}>
                                    <Text style={{textAlign:"center"}}>Valider</Text>
                                </View>
                                }
                            
            </View>            
        
        </Modal>

    </View>
    )
}


const ComponentGraphiqueSondage = ({navigation, item}) => {

    //*****************POUR LE REDUX **************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
    const winkersChat = useSelector((state) => state.winkersChat);//pour l'envoie de l'event à un ami
    const currentUser = useSelector((state) => state.currentUser);
            
    const dispatch = useDispatch();
        
    //*************************************************************************** */


    const [dataChoixSondage , setDataChoixSondage] = useState([])

    const [displaySondageVote, setDisplaySondageVote] = useState(false)

    const handleModalSondageVote = () => {
        setDisplaySondageVote(true);
        console.log("dataChoixSondage : ",dataChoixSondage)
    }

    const addVote = (idChoixSondage) => {
    
        axios.post(ipAdress + '/profil/addVote/', {
            idChoixSondage: idChoixSondage,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
        .then(function (response) {

            if(response.dejaVote){
                alert("vous avez deja vote pour ce choix")
            }else{
                alert("Félicitation ! Votre vote a été pris en compte !")
            }

            setDisplaySondageVote(false)

            axios.post(ipAdress + '/profil/getDataSondageChoix/', {
                idSondage: item.id,
              }, {
                headers: {
                  'Authorization': 'Token '+token
                }
            })
            .then(function (response) {
                setDataChoixSondage(response.data.data)
              })
            .catch(function (error) {
                console.log(error);
              });


          })
        .catch(function (error) {
            console.log(error);
          });
    }
    const contains = (list , id) => {
        const result = false
        for(var elementId of list){
            if(elementId == id){
                return true
            }
        }
    }

    const renderItemVoteSondage = ({item}) => {
        return(
        <TouchableOpacity onPress={() => addVote(item.id)} style={{elevation: 8,backgroundColor: contains(item.listIdWinker, currentUser.id) ? "green" : "white",borderRadius: 10,paddingVertical: 10,paddingHorizontal: 12,margin:5}}>
            <Text style={{fontSize: 18,color: "black",fontWeight: "bold",alignSelf: "center",textTransform: "uppercase"}}>{item.choix}</Text>
        </TouchableOpacity>
        )
    }



    const extractChoices = () => {
        let dataChoices = []
        for (const element of dataChoixSondage){
            dataChoices.push(element["choix"])    
        }

        console.log("voici les dataChoices : ",dataChoices)

        return dataChoices
    }

    const numberVotes = () => {
        let numberList = []
        for(const element of dataChoixSondage){
            if(element.listIdWinker == "[]"){
                numberList.push(0)
            }else{
                numberList.push(element.listIdWinker.split("/").length)
            }
            
        }

        console.log("voici les numberVotes : ",numberList)
        return numberList
    }



    useEffect(() =>{

        axios.post(ipAdress + '/profil/getDataSondageChoix/', {
            idSondage: item.id,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
        .then(function (response) {
            setDataChoixSondage(response.data.data)
          })
        .catch(function (error) {
            console.log(error);
          });

    }, [])

    return(

        <View style={{borderWidth:1,borderColor:"white",borderRadius:10}}>
            {item.titre &&
                <Text style={{color:"white",textAlign:"center"}}>{item.titre}</Text>
            }

            
            {extractChoices().length != 0 &&
                <>
                <LineChart
                    data={{
                    labels: extractChoices(), //["Foot","Basket"],
                    datasets: [
                                {
                                data: numberVotes(), //[2,2]
                                }
                            ]
                            }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                            borderRadius: 16
                        },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />

            

                <Button title="Voter" onPress = {() => handleModalSondageVote()} />
                </>
                }

            <Modal
                animationType="slide"
                transparent={true}
                visible={displaySondageVote}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisibleStories(!modalVisibleStories);
                }}
            >
                <View style={{backgroundColor:"transparent", position:'absolute', bottom:0,width:'100%',height: Dimensions.get('window').height - 50}}>
                    
                    <TouchableOpacity onPress={() => setDisplaySondageVote(false)} style={{flex:1,opacity:0, backgroundColor:'transparent'}}></TouchableOpacity>
                    
                    <View style={{backgroundColor:'grey', flex:8,borderRadius:25,borderWidth: 3,borderColor: "white"}}>
                        {/* <Text style={{textAlign:'center',fontSize:30,borderColor: 'red',}}>Afficher les votes du sondages !</Text>
                        <Text style={{color:"white"}}>{JSON.stringify(dataSondageVote)}</Text>
                        <Text style={{color:"white"}}>Voila</Text> */}
                        <FlatList
                            data={dataChoixSondage}
                            renderItem= {renderItemVoteSondage}     
                            keyExtractor={item => item.id}
                        />
                        <Button title="Valider" onPress={() => setDisplaySondageVote(false)} />
                    </View>

                    <TouchableOpacity onPress={() => setDisplaySondageVote(false)} style={{flex:2,opacity:0, backgroundColor:'transparent',borderColor: 'red'}}></TouchableOpacity>
                    
                </View>
            
            </Modal>
        
        </View>


    )
}



const Sondage = ({navigation, route}) => {

    const [data , setData] = useState(route.params["data"])//Contient les data en general sur le rang le groupPrive l'event de la page

    const [dataSondage , setDataSondage] = useState([])


    //*****************POUR LE REDUX **************************/

    const ipAdress = useSelector((state) => state.ipAdress);
    const token = useSelector((state) => state.token);
    const winkersChat = useSelector((state) => state.winkersChat);//pour l'envoie de l'event à un ami
    const currentUser = useSelector((state) => state.currentUser);
        
    const dispatch = useDispatch();
    
    //*************************************************************************** */

    useEffect(() =>{

        const booleanGroupPrive = false;
        if(data.groupPrive != null){
            booleanGroupPrive = true;
        }
        
        axios.post(ipAdress + '/profil/getDataSondageEvent/', {
            idEvent: data.event.id,
            groupPrive : JSON.stringify(data.groupPrive),
            booleanGroupPrive : booleanGroupPrive,
          }, {
            headers: {
              'Authorization': 'Token '+token
            }
        })
        .then(function (response) {
            setDataSondage(response.data)
          })
        .catch(function (error) {
            console.log(error);
          });

    }, [])



    const renderItemGraphiqueSondage = ({item}) => {
        return(
            <ComponentGraphiqueSondage item={item} />
        )
    }

    return (
        
        <View style={{flex:1,backgroundColor:"black"}}>

            <FlatList
                data={dataSondage.data}
                renderItem= {renderItemGraphiqueSondage}     
                keyExtractor={item => item.id}
            />


        </View>
    )
}
