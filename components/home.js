import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView
} from 'react-native'
import React, {Component} from 'react'
import {Link} from 'react-router-native'
import {connect} from 'react-redux'
import API from '../API'

class Home extends Component {
    constructor(props) {
      super(props)
      API.rooms.getRooms().then(rooms => {
        this.props.dispatch({
          type: 'NEW_ROOMS',
          rooms
        })
      })
    }

    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Radio Room
          </Text>
          <Text style={styles.instructions}>
            Listen. Together
          </Text>
          <ScrollView>
          {
            this.props.rooms.map((room) => (
              <Link
                key={room._id}
                to={`room/${room._id}/queue`}
              >
                <Text style={styles.link}>
                  {room.alias}
                </Text>
              </Link>
            ))
          }
          </ScrollView>

        </View>
      )
    }
  }

export default connect(({rooms}) => ({rooms: rooms.rooms}), (dispatch) => ({dispatch}))(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginTop: 5,
  },
  link: {
    textAlign: 'center',
    color: '#FFF',
    backgroundColor: '#0000FF',
    marginTop: 2,
    marginBottom: 2,
    paddingTop: 5,
    paddingBottom: 5,
    padding: 5,
    borderRadius: 3
  },
});