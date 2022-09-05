import * as React from 'react';
import { Text, View, StyleSheet, Button,Dimensions, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useCallback } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useDerivedValue } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

import Svg, { Circle } from 'react-native-svg';

const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';

const { width, height } = Dimensions.get('window');

const CIRCLE_LENGTH = 240; // 2PI*R
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function App({idUserMessage , idCurrentUser , fileAudio}) {

  //***************** POUR L'ANIMATION DE L'AUDIO *******************************/

  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`;
  });


  //**************************************************************************** */


  const [sound, setSound] = React.useState();

  const [time, setTime] = React.useState(0)

  const [isPlaying , setIsPlaying] = React.useState(false);

  
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    if(minutes == 0){
      return ((seconds < 10 ? '0' : '') + seconds)
    }
    return (minutes + ":" + (seconds < 10 ? '0' : '') + seconds)
  }

  async function playSound() {
    console.log('Loading Sound');

    // D'abord on recupere le temps de l'audio que l'on utilise pour l'animation

    const { sound } = await Audio.Sound.createAsync(
      { uri: fileAudio }
  );

    //console.log("voici le sound : ",sound)

    if(sound){
      sound.getStatusAsync()
        .then(function(result) {
          setTime(result.durationMillis)
          progress.value = withTiming(progress.value > 0 ? 0 : 1, { duration: result.durationMillis });
        })
        //.catch(console.log);
      }

    //console.log("vvoici le time : ",time)
    setSound(sound);

    console.log('Playing Sound');
    setIsPlaying(true)
    await sound.playAsync(); 
    setIsPlaying(false)
  }

  const styles = StyleSheet.create({
    container: {
      height:110,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 0,
      flexDirection:idCurrentUser == idUserMessage ? "row-reverse" : "row",
    },
    progressText: {
      fontSize: 80,
      color: 'rgba(256,256,256,0.7)',
      width: 100,
      textAlign: 'center',
    },
    button: {
      position: 'absolute',
      bottom: 0,
      width: 50,
      height: 20,
      backgroundColor: BACKGROUND_STROKE_COLOR,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 10,
      color: 'white',
      //letterSpacing: 2.0,
    },
  })



  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
       }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={{flex:1.3, backgroundColor:"transparent"}}>
    
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

      </View>
      <View style={{flex:3}}>

      </View>
    </View>
  );
}

