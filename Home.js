import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';

import  {useEffect, useState,} from 'react';


import Tendance from "./Tendance/index";
import Entreprise from "./Entreprise/index";
import Home from "./EventLists/index";
import HastagEvent from './HastagEvent/HastagEvent';
import detailsEvent from './detailsEvent/detailsEvent';


import Particulie from "./Particulie/index";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

//**********POUR REDUX *********************/
import { store } from "../Register/store";

import { Provider } from "react-redux";
//************************************************* */



const Tab = createMaterialTopTabNavigator();

export function App() {
  return (
    <Provider store={store}>
      <Tab.Navigator
        independent={true}
        style={{marginTop:25}}
        swipeEnabled="false"
        initialRouteName="Principal"
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
          <Tab.Screen name="Principal" component={Home} />
        
          <Tab.Screen name="Création Event" component={Tendance} />
          {/* <Tab.Screen name="Entreprise" component={Entreprise} /> */}
          
          {/* <Tab.Screen name="Particulié" component={Particulie} /> */}
      </Tab.Navigator>
    </Provider>
      
  );
}

export default function EventComponent() {
  
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <Stack.Navigator initialRouteName="App"
          screenOptions={{
          headerShown: false
          }}>
              <Stack.Screen name="App" component={App} />
              <Stack.Screen name="HastagEvent" component={HastagEvent}/>
              <Stack.Screen name="detailsEvent" component={detailsEvent}/>
          </Stack.Navigator>
    </Provider>
      )
}