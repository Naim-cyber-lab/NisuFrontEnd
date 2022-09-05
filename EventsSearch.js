import React, {useEffect, useState, useRef} from 'react';
import { View, Dimensions,TouchableWithoutFeedback, FlatList,Text, Button} from 'react-native';

import styles from "./styles";

import axios from 'axios';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { TextInput } from 'react-native-gesture-handler';

import indexChat from '../ChatIndividual/index.js';
import Search from './Search.js';

import { useSelector } from "react-redux";

import EventItem from "./EventItem";

const Post = ({ route, navigation }) => {

    //*****************POUR LE REDUX **************************/

      const ipAdress = useSelector((state) => state.ipAdress);
      const token = useSelector((state) => state.token);
          
    //*************************************************************** */

    const [isLoading,setIsLoading] = useState(true);
    
    const [dataSource,setDataSource] = useState([]);

    const  searchString  = route.params.searchString

    useEffect(() => {

      console.log("voici le sezrchString : ",searchString)

      axios.post(ipAdress + '/profil/getEventsFilter/', {
        filter: searchString,
      }, {
        headers: {
          'Authorization': 'Token '+token
        }
    })
      .then(function (response) {
            
        setIsLoading(false);
        setDataSource(response.data.data)

      })
      .catch(function (error) {
        console.log(error);
      });

      }, []);

      
    return (
        <View>
            {/* <Text style={{color:'blue',marginTop:100}}>{JSON.stringify(dataSource.data)}</Text>  */}
          <TouchableWithoutFeedback style={{...styles.container , backgroundColor : "white"}}>

            {/* <Text style={{color:"white"}}>ksdkhj : {JSON.stringify(dataSource)}</Text> */}
       
           <FlatList
              disableIntervalMomentum={ true }
              data={dataSource}
              renderItem={({item}) => 
              <EventItem event={item} navigation={navigation} />
              } // ici, on definie ce qui va apparaitre dans les props de notre EentItem
              keyExtractor={item => item.id.toString()}
            /> 

        </TouchableWithoutFeedback>
 
        </View>


    )
}

export default Post;