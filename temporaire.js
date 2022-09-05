export class ChatIndividual2 extends Component {

    constructor(props) {
      super(props);
      this.state = {
        ipAdress: useSelector((state) => state.ipAdress),
        currentUser: useSelector((state) => state.currentUser),
        winkersChat: useSelector((state) => state.winkersChat),
        token: useSelector((state) => state.token),
        isSearchingWinker : false,
        dataWinkers : {},
        data : navigation.getParam('item'),//correspond aux donnees du current user
        user2 : navigation.getParam('user2Id'),
        chatWinkerId : navigation.getParam('chatWinkerId'),
        messages : [],
      };
    }
  
  
    //*****************POUR LE REDUX **************************/
  
    dispatch = useDispatch();
    
    //*************************************************************** */
  
  
    //************************************************************************** */
    //                                                                           */
    //                    GERER L'ENVOI DES MSG AVEC LES SOCKETS                 */
    //                                                                           */
    //************************************************************************** */
  
    getTime(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    };
  
    sendMessage() {
  
      if(inputMessage == ""){
        alert("le message ne doit pas etre vide")
        return
      }
  
      // **************** D'ABORD ON AJOUTE LE MESSAGE AVEC LE USESTATE*************
     
     
      let t = getTime(new Date());
      // console.log("voici les messages de sendMessages: ",messages)
      this.setState({messages : [
        
        {
          _id : messages[messages.length - 1]["_id"] + 1,
          event : null,
          message: inputMessage,
          audio: null,
          sender: {
            _id : currentUser.id,
            name: currentUser.name,
            avatar : currentUser.avatar,
          },
          time: t,
        },
        ...messages
      ]});
  
      this.setState({inputMessage : ''});
  
      // 👇️ from CURRENT DATE
      const now = new Date();
      const currentTime = now.getHours() + ':' + now.getMinutes();
      console.log(currentTime); // 👉️ 13:27
  
      //  ******************* ENREGISTREMENT DU MESSAGE DANS LA BASE DE DONNEES ****************************
  
        axios.post(ipAdress + '/profil/chatIndividual/', {
          "getData":0,
          "addAudio" : 0,
          "getMessages" : 0,
          "addMessage" : 1,
          "chatWinkerId" : data.chatWinkerId,
          "winkerIdRecoit": data.id,
          "date":currentTime,
          "message": inputMessage,
          "user2" : user2,
        }, {
          headers: {
            'Authorization': 'Token '+token
          }
        })
        .then(function (response) {
          this.setState({inputMessage : ''});;
        })
        .catch(function (error) {
          console.log(error);
        });
  
      // ********************************************************************************************** */
  
    }
  
    ws = new W3CWebSocket('ws://192.168.43.24/profil/chatWinker/7/');
  
    componentDidMount() {
  
      console.log("je suis dans componentDidMount")
      
      this.ws.onopen = () => {
        // connection opened
        console.log('WebSocket Client Connected')
      }
  
      this.ws.onmessage = (e) => {// On recoit ici le message venant du backend
        console.log("msg from the backend : ",e.data);
      };
    
      this.ws.onerror = (e) => {
        // an error occurred
        console.log(e.message);
      };
  
    }
  
    componentDidMount() {
      navigation.setOptions({
        title: '',
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                name='angle-left'
                type='font-awesome'
                size={30}
                color='#fff'
              />
            </TouchableOpacity>
  
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => {
              Alert.alert('Audio Call', 'Audio Call Button Pressed');
            }}
          >
            <Icon name='call' size={28} color='#fff' />
          </TouchableOpacity>
        ),
      });
    }
    //***************************************************************************** */
    widthScreen = Dimensions.get('window').width;
    heightScreen = Dimensions.get('window').height;
  
    //****************************************************************************** */
    
    isEvent(event){
      if(event == null){
        return false
      }
      else{
        return true
      }
    }
  
    isAudio(audio){
      if(audio == null){
        return false
      }
      else{
        return true
      }
    }
  
    isMessage(message){
      if(message == null){
        return false
      }
      else{
        return true
      }
    }
  
   
    renderMessage = (item) => {
  
      //console.log("voici le item.item :",item.item)
      // console.log("voici le current user :",currentUser.id)
      return(
        <TouchableWithoutFeedback onPress={() => alert(item.sender)}>
            <View style={{ marginTop: 6 }}>
                {isMessage(item.item.message)  &&
                  <View
                    style={{
                      maxWidth: Dimensions.get('screen').width * 0.8,
                      backgroundColor: 
                        item.item.sender._id === currentUser.id
                            ? 'rgb(79, 80, 81)'
                            : 'blue',
                       alignSelf:
                        item.item.sender._id === currentUser.id
                          ? 'flex-start'
                          : 'flex-end',
                      marginHorizontal: 10,
                      padding: 10,
                      borderRadius: 8,
                      borderBottomLeftRadius:
                        item.item.sender._id === currentUser.id ? 8 : 0,
                      borderBottomRightRadius:
                        item.item.sender._id === currentUser.id ? 0 : 8,
                    }}
                  >
                    
                      <Text style={{color: '#fff',fontSize: 16,}}>{item.item.message}</Text>
                      <Text style={{color: '#dfe4ea',fontSize: 14,alignSelf: 'flex-end',}}>{item.item.time}</Text>
                  </View>
                }
                {isEvent(item.item.event) &&
                  <Pressable
                  onPress = {() => navigation.navigate('ShowEvent' , {"event" : item.item.event})}
                  style={{
                    width: 150,height: 230,backgroundColor: '#transparent',
  
                    alignSelf:
                      item.item.sender._id === currentUser.id
                      ? 'flex-start'
                      : 'flex-end',
                      
                    borderBottomLeftRadius:
                      item.item.sender._id === currentUser.id ? 8 : 0,
                    borderBottomRightRadius:
                      item.item._id === currentUser.id ? 0 : 8,
            
                    marginHorizontal: 10,padding: 10,borderRadius: 8,borderWidth:1,borderColor:"black"
                  }}
                >
                  {item.item.event.filesEvent[0].image != null &&
                    <Image        
                      style={{width:"100%" , height:"100%"}}
                      source={{
                        uri: "http://192.168.43.24"+item.item.event.filesEvent[0].image,
                      }}
                    />
                  }
                  {!(item.item.event.filesEvent[0].image) == null &&
                    <Video        
                      style={{width:"100%" , height:"100%"}}
                      source={{
                        uri: "http://192.168.43.24"+item.item.event.filesEvent[0].video,
                      }}
                      muted = {true}
                      paused = {true}
                      shouldPlay = {false}
                    />
                  }
                  
                  </Pressable>
                }
                {isAudio(item.item.audio) &&
                  <ElementAudio fileAudio={item.item.audio} />
                }
  
            </View>
        </TouchableWithoutFeedback>
      )
    }

    
  
    //****************************************************************** */
  
    render () {
      const { navigation } = this.props;
      return (
        <TouchableWithoutFeedback style={{backgroundColor:"black"}} onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
  
        {showDraggable &&
          <View style={{top:0,height:400, backgroundColor:"red",alignItems:"center",justifyContent:"center",opacity:0.5}}>
            <Entypo name={'trash'} size={65} style={{color:'white'}}  />
          </View>
        }
  
          <FlatList
            style={{ backgroundColor: '#f2f2ff' }}
            inverted={true}
            data={messages}
            renderItem={renderMessage}
          />
  
          <View style={{ paddingVertical: 10 }}>
            <View style={styles.messageInputView}>
            <TouchableOpacity
                style={styles.messageSendView}
              >
                
                 <View 
                  onLayout={(event) => {
                    setDropZoneValues(event.nativeEvent.layout)
                  }}
                >
                    <Animated.View       
                      {...panResponder.panHandlers}
                      style={[pan.getLayout(), {}]}
                    >
                          <Icon name='microphone' type='font-awesome' />
  
                    
                    </Animated.View>
                </View>
  
              </TouchableOpacity>
              
              <TextInput
                defaultValue={inputMessage}
                style={styles.messageInput}
                placeholder='Message'
                onChangeText={(text) => this.setState({inputMessage : text})}
                onSubmitEditing={() => {
                  alert("you want to submit the message")
                  //sendMessage();
                }}
              />
              
              <TouchableOpacity
                style={styles.messageSendView}
                onPress={() => {
                  //sendMessage();
                  sendMessage2();
                  //alert("kjkg")
                  
           
                  }}
              >
                <Icon name='send' type='material' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
        // <View style={{flex: 1}}>
          
        //   <Button title="title of my button" onPress={() => this.ws.send(JSON.stringify({"message":"here is the msg"}))} />
        // </View>
      )
    }
  }
  




  