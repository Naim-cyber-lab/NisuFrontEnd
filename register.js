import React, { useState } from 'react';
import { StyleSheet,Text,View,TextInput,Image,Dimensions,TouchableOpacity,TouchableWithoutFeedback,Keyboard,} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import axios from 'axios';

import {Radio} from 'native-base';

import { RadioButton } from 'react-native-paper';
import { Icon } from 'react-native-elements';
//***************POUR LE REDUX ****************** */

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFirstPhotoLocalisation, setToken } from "./store";
import { setIsLoggedIn } from "./store";
import { setCurrentUser } from "./store";

//***************************************** */


function Register({ navigation, route, props }){

  //*****************POUR LE REDUX **************************/

  const ipAdress = useSelector((state) => state.ipAdress);
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();

  //********************************************************** */
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [password2 , setPassword2] = useState("");
  const [telephone , setTelephone] = useState("");
  const [username , setUsername] = useState("");
  const [gender, setGender] = useState('Masculin');
  const [comptePro , setComptePro] = useState(false)

  const [notConfirmedPassword, setNotConfirmedPassword] = useState(false)
  const [notConfirmedTelephone, setNotConfirmedTelephone] = useState(false)
  
  const [selectedPays , setSelectedPays] = useState('France')
  const [pays] = useState(['Allemagne','Canada','France','Italie',])

  const [selectedVilles , setSelectedVilles] = useState('France')
  const [villes] = useState(['Paris','Lille','Evry',])



  const [invalidCredentials , setInvalidCredentials] = useState(false);


  const handleRegister = () => {

    if( (password2 != password) || (password == "")){
      alert("vous n'avez pas ecrit deux fois le meme mot de passe")
      setNotConfirmedPassword(true)
      return
    }

    if(telephone.length != 10){
      setNotConfirmedTelephone(true)
      return
    }


    axios.post(`${ipAdress}/profil/registerRestFramework/`, {
      telephone : telephone,
      username: username,
      password: password,
      gender : gender,
      comptePro : comptePro,
      email : email,
    })
    .then(function (response) {

      if(response.data.mailNotUnique){
        alert("le mail existe déjà dans notre base de donnée")
      }
      if(response.data.phoneNotUnique){
        alert("le numéro de téléphone existe déjà dans notre base de donnée")
        
      }
      if(response.data.usernameNotUnique){
        alert("le username existe déjà dans notre base de donnée")
      }
      if(!response.data.usernameNotUnique && !response.data.phoneNotUnique && !response.data.mailNotUnique){

        //******************************************DANS CE CAS IL FAUT ALORS CONNECTER LE NOUVEAU WINKER ****************************************/
        
        axios.post(`${ipAdress}/profil/login`, {
          username: email,
          password: password,
        })
        .then(function (response) {
         
          dispatch(setToken(response.data.token))
          dispatch(setIsLoggedIn())
         
          // Maintenant on a recupere le token, on enregistre le user dans le currentUser du store
          // *********** recuperer le currentUser dans le store ********************//
    
        fetch(`${ipAdress}/profil/getDataWinker/`,{
          method:"GET",
          headers : {
            'Authorization': `Token ${response.data.token}`
          }
          })
          .then( (response) => response.json() )
          .then( (response) => {
            dispatch(setCurrentUser(response.data))
            dispatch(setFirstPhotoLocalisation(response.setFirstPhotoLocalisation))
          })
          .catch(function(error) {
            throw error;
          });
    
    
    
    
        })
    
        .catch(function (error) {
          setInvalidCredentials(true)
          console.log(error);
        });


        //************************************************************************************************************************************** */
      }
      
      
    })
    .catch(function (error) {
      alert("c'est pas ok !")
      console.log(error);
    });

  }

  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.bigCircle}></View>
      <View style={styles.smallCircle}></View>
      <View style={styles.centerizedView}>
        <View style={styles.authBox}>
          <View style={styles.logoBox}>
            <Icon
              color='#fff'
              name='comments'
              type='font-awesome'
              size={50}
            />
          </View>
          <TouchableOpacity style={{display:'flex',flexDirection:'row',justifyContent:"space-between"}}>
            <Text onPress= {() => setComptePro(false)} style={{...styles.loginTitleText  ,color:'black', opacity: comptePro ? 0.3 : 1}}>Compte usager</Text>
            <Text onPress= {() => setComptePro(true)} style={{...styles.loginTitleText ,color:'black', opacity: !comptePro ? 0.3 : 1}}>professionnel ?</Text>
          </TouchableOpacity>
         
          <View style={styles.hr}></View>
          {!comptePro &&
           <View style={styles.inputBox}>
            <View style={{display:'flex', flexDirection:'row'}}>
              <RadioButton
                value="Masculin"
                status={ gender === 'Masculin' ? 'checked' : 'unchecked' }
                onPress={() => setGender('Masculin')}
              />
              <Text>Masculin</Text>
            </View>
            <View style={{display:'flex', flexDirection:'row'}}>
            <RadioButton
              value="Feminin"
              status={ gender === 'Feminin' ? 'checked' : 'unchecked' }
              onPress={() => setGender('Feminin')}
            />
            <Text>Feminin</Text>
          </View>
          </View>
          }

          {comptePro &&
           <View style={styles.inputBox}>
             <Text style={styles.inputLabel}>Localisation</Text>
            <View style={{flexDirection:'row'}}>
               <View style={{width:"50%"}}>
              <Picker style={{marginVertical:5,  with:"20%"}}
                  selectedValue={selectedPays}
                  onValueChange={(itemVal) => {
                    setSelectedPays(itemVal)
                  }}
                >
                  {
                    pays.map((l) => (
                    <Picker.Item label={l} value={l} />
                    ))
                  }
                </Picker>
              </View>
             
              <View style={{width:"50%"}}>
              <Picker style={{marginVertical:5,  with:"20%"}}
                  selectedValue={selectedVilles}
                  onValueChange={(itemVal) => {
                    setSelectedVilles(itemVal)
                  }}
                >
                  {
                    villes.map((l) => (
                    <Picker.Item label={l} value={l} />
                    ))
                  }
              </Picker>
              </View>    
            </View>       
          </View>
          }
          
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText = {(text) => setEmail(text)}
              keyboardType='email-address'
              textContentType='emailAddress'
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              onChangeText = {(text) => setUsername(text)}
              keyboardType='default'
            />
          </View>
          {notConfirmedTelephone &&
          <Text style={{color:"red"}}>Le numéro de téléphone doit contenir 10chiffres</Text>
          }
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Telephone</Text>
            <TextInput
              style={styles.input}
              onChangeText = {(text) => setTelephone(text)}
              keyboardType='phone-pad'
              textContentType='telephoneNumber'
            />
          </View>
          {notConfirmedPassword &&
          <Text style={{color:"red"}}>Les 2 mots de passes doivent être identique</Text>
          }
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onChangeText = {(text) => setPassword(text)}
              textContentType='password'
            />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onChangeText = {(text) => setPassword2(text)}
              textContentType='password'
            />
          </View>
          <TouchableOpacity onPress = {() => handleRegister()} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Inscription</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress= { () => navigation.navigate('Login')}>
            <Text style={styles.registerText}>
              Login ?
            </Text>
          </TouchableOpacity>
       
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
  )
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bigCircle: {
    width: Dimensions.get('window').height * 0.7,
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: '#ff6b81',
    borderRadius: 1000,
    position: 'absolute',
    right: Dimensions.get('window').width * 0.25,
    top: -50,
  },
  smallCircle: {
    width: Dimensions.get('window').height * 0.4,
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: '#ff7979',
    borderRadius: 1000,
    position: 'absolute',
    bottom: Dimensions.get('window').width * -0.2,
    right: Dimensions.get('window').width * -0.3,
  },
  centerizedView: {
    width: '100%',
    top: '10%',
  },
  authBox: {
    width: '80%',
    backgroundColor: '#fafafa',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: '#eb4d4b',
    borderRadius: 1000,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
    marginBottom: -50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loginTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  hr: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#444',
    marginTop: 6,
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#dfe4ea',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#ff4757',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});
