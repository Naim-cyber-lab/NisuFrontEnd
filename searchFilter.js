import React , {Component} from 'react';
import {Container, Header, Title, Content, Button, Left, Right, Body, Icon, Text, ListItem, Thumbnail} from 'react-native';


let helperArray = require('');
export default class Filter extends Component {
    constructor(props){
        super(props);
        this.state = {
            allUsers = helperArray
        }
    };

searchUser(textToSearch){
    alert(textToSeach)
})

    <Container>
    <Header searchBar rounded>
      <Item>
          <Icon name="search"/>
          <Input placeholder="Search User" onChangeText={text => this.searchUser(text)}
      </Item>
    </Header>
    <Content>
        {this.state.allUsers.map((item, index) => {
                 <ListItem>
            <Left>
                <Thumbnail />
            </Left>
            <Body>
                <Text>{item.name}</Text>
            </Body>
            <Right />
        </ListItem>
        })}
   
    </Content>
    
</Container>
}
