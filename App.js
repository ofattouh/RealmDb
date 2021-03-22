/**
 * RealmDb App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Realm from 'realm';

export default class App extends Component {
  realm;

  state = {
    users: []
  }

  constructor(props) {
    super(props);

    const realm = this.realm = new Realm({
      schema: [{
        name: 'User',
        properties: {
          firstName: 'string',
          lastName: 'string',
          email: 'string'
        }
      }]
    });
  }

  // get
  getRandomUser() {
    return fetch('https://randomuser.me/api/')
      .then(response => response.json());
  }

  // insert
  createUser = () => {
    const realm = this.realm;

    this.getRandomUser().then((response) => {
      const user = response.results[0];
      const userName = user.name;

      realm.write(() => {
        realm.create('User', {
          firstName: userName.first,
          lastName: userName.last,
          email: user.email
        });

        this.setState({users: realm.objects('User')});
      });
    });
  }

  // update
  updateUser = () => {
    const realm = this.realm;
    const users = realm.objects('User');

    realm.write(() => {
      if(users.length) {
        let firstUser = users.slice(0, 1)[0];
        firstUser.firstName = 'John';
        firstUser.lastName = 'Doe';
        firstUser.email = 'john.doe@example.com';
        this.setState(users);
      }
    });
  }

  // delete
  deleteUsers = () => {
    const realm = this.realm;

    realm.write(() => {
      realm.deleteAll();
      this.setState({users: realm.objects('User')});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.createUser}>
            <Text style={styles.buttontext}>Add User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.updateUser}>
            <Text style={styles.buttontext}>Update First User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.deleteUsers}>
            <Text style={styles.buttontext}>Delete All Users</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.welcome}>DB Users:</Text>
          {this.state.users.map((user, index) => {
            return <Text style={styles.welcomeText} key={index}>Name: {user.firstName}
             {user.lastName} {"\n"} Email: {user.email}</Text>;
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#67CAFF',
    padding: 15,
    margin: 10
  },
  buttontext: {
    color: '#FFFFFF'
  },
  welcome: {
    fontWeight: 'bold',
    margin: 5
  },
  welcomeText: {
     margin: 5
  }
});

// npx react-native init MyApp
// npm install --save realm
// pod install  // cd ios (realm)
