import React, {useEffect, useState, useRef} from 'react';
import { View, Dimensions,TouchableWithoutFeedback, FlatList,Text, Button,Image,ActivityIndicator,Pressable} from 'react-native';

import styles from "./styles";
import Feather from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';

//***************POUR LE REDUX *************************/
import { useSelector } from "react-redux";

//************************************* */

const CommentItem = ({route, navigation}) => {

    const event = route.params.event

 



    return (
    <View style={{flex:1}}>
        <View style={{flex:1}}>
        {!getFiles(event.filesEvent)["existVideo"] && 
            <Image
            resizeMode={'cover'}
            style={{height:"100%",width:"100%"}}
            source={{uri: "http://192.168.43.24"+getFiles(event.filesEvent)["listFiles"][0]}}
            onError ={(error)  => console.warn(error)} />}
        </View>
        <View style={{flex:3}}>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>     
            <TextInput
                style={styles.input}
                                placeholder="Commentez ici !"
                                onChangeText={(searchString) => {isWritingComment(searchString)}}
                                underlineColorAndroid="transparent"
                value={commentText}
            />
            <Feather style={styles.searchIcon} onPress={()=>alert(commentText)} name="send" size={20} color="#000"/>
        </View>
        <View style={{marginTop:45}}>
            {(() => {
                if(!showIdentification)
                  {
                    if(isLoadingComment){
                        return (
                            <View style={{marginTop:65}}>
                                        <ActivityIndicator size="large" color="blue" />
                                    </View>
                        )
                    }
                    else{
                        if(nbCommentVisible == 0)
                            return (
                                <View><Text>Pas de commentaire</Text></View>
                            )
                        else{
                            return(
                                <View> 
                                    <TouchableWithoutFeedback style={styles.container}>
                                        <FlatList
                                            data={dataComment.data}
                                            keyExtractor={(item) => item.id.toString()}
                                            renderItem={({item}) => 
                                            <View style={{display:'flex',flexDirection:'row',borderWidth:1,borderColor:'black',borderRadius:10}}>
                                                <Image
                                                    style={styles.songImage}
                                                    source={{uri: item.winker.photoProfil}}
                                                /> 
                                                
                                                <Text> {item.message}</Text>
                                            </View>} // ici, on definie ce qui va apparaitre dans les props de notre EentItem
                                            />
                                    </TouchableWithoutFeedback>
                                </View>
                       
                                    )
                                }    
                            }
                        }
                else{
                            return(
                                <View style={{width:220,height:200,backgroundColor:'red',marginTop:200}}>
                                    <Text>Montrer ici le data winkers pour identifier un ami </Text>
                                    <Pressable onPress={() => alert('je suis presse')} >
                                        <Text>{JSON.stringify(dataWinkers)}</Text>
                                    </Pressable>
                                </View>
                            )
                            
                        }
                    })()}
        </View>
        </View>




    </View>
    )
}

export default CommentItem;