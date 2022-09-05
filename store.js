import { useEffect, useState } from "react";
import { createStore } from "redux";

// state
const initialState = {
  token: "",
  isLoggedIn : false,
  //apiKeyBis : "AIzaSyDRdQ8vpw3HaX_GMhF_1QeJ5Gvb5n56coI",//naim.souni1789@outlook.fr
  apiKey : "AIzaSyCbWqFcG8x4eph-5uqZUlirnyIhdqHaXpw",//nisuapplication@gmail.com
  ipAdress : "http://192.168.43.24:80",
  ipAdressSocket:"192.168.43.24",
  // ipAdress : "https://hjkqjhflkjdhslkjh1809870045676.herokuapp.com",
  // ipAdressSocket:"hjkqjhflkjdhslkjh1809870045676.herokuapp.com",
  currentUser : {},
  firstPreference : false,
  firstPhotoLocalisation : false,
  firstConnection : false,
  listParticipeWinker : [],
  listFilesWinker : [],//Contient la photo de profil et les differentes autres photos du  winker
  winkersChat : [],//pour avoir la liste des winker à qui l'utilisateur à parlé. on a acces à cette liste grace à la view getWinkersChat
  winkersChatWithoutGroup : [],
  dataPreference : [],
};


// actions creators

export const setToken = (newToken) => ({ 
    type : "setToken",
    payload: {newToken: newToken}
});

export const setListFilesWinker = (newListFilesWinker) => ({ 
  type : "setListFilesWinker",
  payload: {newListFilesWinker: newListFilesWinker}
});

export const setListParticipeWinker = (newListParticipeWinker) => ({ 
  type : "setListParticipeWinker",
  payload: {newListParticipeWinker: newListParticipeWinker}
});

export const setCurrentUser = (newCurrentUser) => ({ 
  type : "setCurrentUser",
  payload: {newCurrentUser: newCurrentUser}
});

export const setDataPreference = (newDataPreference) => ({ 
  type : "setDataPreference",
  payload: {newDataPreference: newDataPreference}
});

export const setWinkersChat = (newWinkersChat) => ({ 
  type : "setWinkersChat",
  payload: {newWinkersChat: newWinkersChat}
});

export const setWinkersChatWithoutGroup = (newWinkersChatWithoutGroup) => ({ 
  type : "setWinkersChatWithoutGroup",
  payload: {newWinkersChatWithoutGroup: newWinkersChatWithoutGroup}
});

export const setIsLoggedIn = () => ({ type : "setIsLoggedIn"});

export const setComptePro = () => ({ type : "setComptePro"});


export const setFirstPhotoLocalisation = () => ({ type : "setFirstPhotoLocalisation"});



function reducer(state = initialState, action) {

    if (action.type === "setIsLoggedIn") {
        return {
          ...state,
          isLoggedIn: true,
        };
      }


    if (action.type === "setToken") {
        const newToken = action.payload.newToken;
        return {
          ...state,
          token: newToken,
        };
      }

      if (action.type === "setCurrentUser") {
        const newCurrentUser = action.payload.newCurrentUser;
        return {
          ...state,
          currentUser: newCurrentUser,
        };
      }

    if (action.type === "setDataPreference") {
      const newDataPreference = action.payload.newDataPreference;
      return {
          ...state,
          dataPreference: newDataPreference,
        };
    }

      if (action.type === "setListParticipeWinker") {
        const newListParticipeWinker = action.payload.newListParticipeWinker;
        return {
          ...state,
          listParticipeWinker: newListParticipeWinker,
        };
      }

      if (action.type === "setListFilesWinker") {
        const newListFilesWinker = action.payload.newListFilesWinker;
        return {
          ...state,
          listFilesWinker: newListFilesWinker,
        };
      }

      if (action.type === "setWinkersChat") {
        const newWinkersChat = action.payload.newWinkersChat;
        return {
          ...state,
          winkersChat: newWinkersChat,
        };
      }

      if (action.type === "setWinkersChatWithoutGroup") {
        const newWinkersChatWithoutGroup = action.payload.newWinkersChatWithoutGroup;
        return {
          ...state,
          winkersChatWithoutGroup: newWinkersChatWithoutGroup,
        };
      }

      if (action.type === "setFirstPhotoLocalisation") {
        return {
          ...state,
          firstPhotoLocalisation: false,
        };
      }
      
 
   return state;
}

export const store = createStore(reducer);