import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Animated from 'react-native-reanimated';

// import {Camera,Permissions} from 'expo';

// import CameraComponent from "./Camera/index";

import Favoris from "./Favoris.js"

import Profil from "./Profil";

import AttenteWinker from "./AttenteWinker";

import Souvenir from "./Stories";

import indexFavoris from "./SnapChatFavoris/index"


//**********POUR REDUX *********************/
import { store } from "../Register/store";
import { useSelector } from "react-redux";

import { Provider } from "react-redux";
//************************************************* */







const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <Tab.Navigator style={{marginTop:20}} 
        initialRouteName="Profil"
        swipeEnabled="false"
        screenOptions = {{
          "tabBarActiveTintColor": "white",
            "tabBarLabelStyle": {
              "fontSize": 12
            },
            "tabBarStyle": {
              "backgroundColor": "black"
            },
            "swipeEnabled":false
        }}
        >
        <Tab.Screen name="Profil" component={Profil} />

          {/* La page des favoris pour gérer le snapChat move : D'abord on va ds la page d'index. 
          Dans cette page d'index, il n'y a que deux éléments : SnapChat et Story.
          SnapChat contient la page avec toutes les stories et story est la page avec l'effet snap pour revernir à la page SnapChat. */}
          <Tab.Screen name="Mes Favoris" component={indexFavoris} />

         
          <Tab.Screen name="AttenteWinker" component={AttenteWinker} />
          {/* <Tab.Screen name="Mes Souvenir" component={Souvenir} /> */}
        </Tab.Navigator>
    </Provider>
      
  );
}