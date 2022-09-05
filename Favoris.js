import React, {useEffect, useState, useRef} from 'react';
import { View, Dimensions,TouchableWithoutFeedback, FlatList,Text, Button} from 'react-native';

import styles from "./styles";

import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { TextInput } from 'react-native-gesture-handler';



const Post = () => {

    const [isLoading,setIsLoading] = useState(true);
    
    const [dataSource,setDataSource] = useState([]);
    
    useEffect(() => {
        fetch('http://192.168.43.87:80/profil/getFavoriteEvents/',{  // http://192.168.1.160 ||||  http://192.168.43.24
        method:"GET"
      })
        .then( (response) => response.json() )
        .then( (responseJson) => {
            setIsLoading(false);
            setDataSource(responseJson)
 
  
        })
  
        .catch(function(error) {
          console.log('PROFIL/FAVORI: ' + error.message);
           alert(error)
            throw error;
        });

      }, []);
      
    return (
        <View>
          <Text>Favoris</Text>
            <Text>AAAAAAAAAAAAAAAAAAAAAAA {JSON.stringify(dataSource)}</Text>
        </View>


    )
}

export default Post;