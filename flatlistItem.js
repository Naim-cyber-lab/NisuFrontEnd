import {View, Pressable, Text , Dimensions, Image, ImageBackground} from "react-native";
import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo,useCallback} from 'react';
import { TapGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Video, AVPlaybackStatus } from 'expo-av';

import { Audio } from 'expo-av';

import Animated, {useAnimatedStyle,useSharedValue,withDelay,withSpring,withTiming,useAnimatedProps,} from 'react-native-reanimated';
import styles from "./styles";
import { TouchableHighlight, TouchableOpacity } from "@gorhom/bottom-sheet";

import DoubleClick from "double-click-react-native";

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


import { useDerivedValue } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
  
import Svg, { Circle } from 'react-native-svg';

import Swipeable from 'react-native-gesture-handler/Swipeable';
  
const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';
  
const { width, height } = Dimensions.get('window');
  
const CIRCLE_LENGTH = 240; // 2PI*R
const R = CIRCLE_LENGTH / (2 * Math.PI);


const AnimatedCircle = Animated.createAnimatedComponent(Circle);





const flatlistItem = forwardRef(({ipAdress,event, parentRefIndex,playVideo,titre, audio ,navigation , index , item , swiperRef, lengthFilesEvent, filesEvent,numberFiles, containVideo}, parentRefEvent) => {
    //********************************* POUR LES SWIPES***************************************** */

    //************************************* POUR LA VIDEO ****************************************************/

    const video = useRef(null);

    const scalePauseVideo = useSharedValue(0);

    const AnimatedImagePauseVideo = Animated.createAnimatedComponent(Image)

    const rStylePauseVideo = useAnimatedStyle(() => ({
        transform: [
            {scale: scalePauseVideo.value}
        ]
    }))

    const [shouldPlay , setShouldPlay] = useState(false)

    useImperativeHandle(parentRefEvent , () => ({
        playFromEvent,
        unload,
        stopFromEvent,
    }))

    useEffect(() =>{
        return () => {
            unload
        }
    }, [])

    const stopFromEvent = () => {

        console.log("stopFromEvent : index ",index ,"contientVideo ",containVideo," titre ",titre)
       
    }

    const playFromEvent = () => {
        
       
        console.log("*************************************************")

        if(numberFiles > 1){
            console.log(titre,"contient plusieurs files")
        }
    }

    const play = async () => {  

        //console.log("voici l'index du play : ",index)

        if(containVideo){

            //console.log("je play la video :"+titre+ " a l'index "+index)

            setShouldPlay(true)
            setShowVideo(true)
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

        if(containVideo){

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

    // ******************************** POUR LES CLICKS ***********************************************

    const doubleTapRef = useRef();

    const handleFirstClick = (number) => {

        console.log("dans handleFirstClick")

        swiperRef.current.scrollToIndex({ animated: true, index: Math.abs((index - number)%(lengthFilesEvent))})
        if(numberFiles == 1){ setShouldPlay(!shouldPlay)}
        else{
            setShouldPlay(false)
        }
        
       
        // scalePauseVideo.value = withSpring(1, undefined, (isFinished) => {
        //     scalePauseVideo.value = withSpring(0);
        // });
    
        if(video.current == null){
            return;
        }
        const status = video.current.getStatusAsync();
        if(!status?.isPlaying){
            return;
        }
        try {
             video.current.stopAsync();
        }catch(e){
            console.log(e)
        }
        alert('you clicked once in handle')
    }

    const handleDoubleTap = () => {
        navigation.navigate('detailsEvent',{
            "event":event,
        })
    }

    //********************************************************************************************** */

    //***************** POUR L'ANIMATION DE L'AUDIO *******************************/

    const progress = useSharedValue(0);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    }));

    const progressText = useDerivedValue(() => {
        return `${Math.floor(progress.value * 100)}`;
    });

    //*****************************POUR LES SWIPES ******************************* */
    const config = {
        velocityThreshold: 0.2,
        directionalOffsetThreshold: 20
      };
    
    const onSwipeLeft = (gestureState) => {
        handleFirstClick(-1)
        console.log("swipe left from flatList")
      }
    
    const onSwipeRight = (gestureState) => {
        handleFirstClick(1)
        console.log("swipe right from flatList")
      }

    // ************************************ POUR L'AUDIO ************************************************

    const [isAudio , setIsAudio] = useState(false)
    const [sound, setSound] = useState();
    const [soundPlaying , setSoundPlaying] = useState(false)

    useEffect(() =>{
        if(audio != null){
            setIsAudio(true)
        }
        
    }, [])

async function playSound() {
    setSoundPlaying(true)
    setShouldPlay(false) //On fait pause à la vidéo
    console.log('Loading Sound');
    const { sound, status } = await Audio.Sound.createAsync(
        { uri: audio },
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
        

    //********************************************************************************************** */
    const widthScreen = Dimensions.get('window').width;
    const heightScreen = Dimensions.get('window').height;
   

    return(
      <>
     <Pressable style={{width:widthScreen,position:"absolute",flex:1}} >
               <GestureRecognizer
       
                    // onSwipeLeft={(state) => onSwipeLeft(state)}
                    // onSwipeRight={(state) => onSwipeRight(state)}
                    config={config}>
                {(() => {
                    return (
                        <View>
                            <Image
                                resizeMode={'contain'}
                                style={{height:250,width:widthScreen}}
                                //style={{height: heightScreen - 50,width:widthScreen}}
                                source={{uri: item[0] == 'h' ? item : ipAdress + item}}
                                onError ={(error)  => console.warn(error)}
                            />                            
                        </View>
                    );
                })()}
        </GestureRecognizer>
    </Pressable> 

    {/* POUR GERER LES CLICKS */}

    <GestureRecognizer
                    //onSwipe={(direction, state) => onSwipe(direction, state)}
                    // onSwipeUp={(state) => onSwipeUp(state)}
                    // onSwipeDown={(state) => onSwipeDown(state)}
                    // onSwipeLeft={(state) => onSwipeLeft(state)}
                    // onSwipeRight={(state) => onSwipeRight(state)}
                    config={config} style={{  display:"flex",flexDirection:"row",width:widthScreen,}}>
        <DoubleClick
            singleTap={() => {
                handleFirstClick(1)
            }}
            doubleTap={() => {
                handleDoubleTap();
            }}
            delay={250}
            style={{
                backgroundColor: 'transparent',
                width:widthScreen/2,        
            }}
        >

            {isAudio &&

                  <Pressable 
                onPress={() => playSound()}
                style={{position:"absolute",bottom:60,width:90,height:50,borderRadius:60,backgroundColor:"white",justifyContent:"center",alignItems:"center"}}
            >
                <ReText style={{fontSize: 20,color: 'black',width: 100,textAlign: 'center',position:"absolute",marginTop:47,marginLeft:10}} text={progressText} />
                <Svg onPress={() => playSound()} style={{ position: 'absolute',bottom:-20 }}>
                <Circle
                    cx={60}
                    cy={40}
                    r={R}
                    stroke={BACKGROUND_STROKE_COLOR}
                    strokeWidth={3}
                />
                <AnimatedCircle
                    cx={60}
                    cy={40}
                    r={R}
                    stroke={STROKE_COLOR}
                    strokeWidth={1.5}
                    strokeDasharray={CIRCLE_LENGTH}
                    animatedProps={animatedProps}
                    strokeLinecap={'round'}
                />
                </Svg>
                </Pressable>

            }
            
        </DoubleClick>
     

        <DoubleClick
            singleTap={() => {
                handleFirstClick(-1)
            }}
            doubleTap={() => {
                handleDoubleTap();
            }}
            delay={250}
            style={{
                backgroundColor: 'transparent',
                width:widthScreen/2,
            }}
        >

        </DoubleClick>

        
    </GestureRecognizer>
             
      </>  
     
    )
})

export default flatlistItem;




// Dollar sur l'ecran
// <TouchableOpacity style={styles.iconContainer} >
// <Fontisto name={'dollar'} size={30} style={{color:'white'}}  onPress={onModalOffre} />
// </TouchableOpacity>
 