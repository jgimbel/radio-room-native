import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client'
import { View, Text, Button, StyleSheet } from 'react-native'
import {Route, Link, Redirect} from 'react-router-native'
import {connect} from 'react-redux'
import API from '../../API'
import Queue from './queue'
import AddSong from './add'

class Rooms extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    API.rooms.join(this.props.room)
    API.songs.onAdd(this.handleSongAdd)
  }

  handleSongAdd = ({song}) => {
    console.log({song})
    API.rooms.pulse().then(console.log)
    this.props.dispatch({type: 'SONG_ADD', room: this.props.room, song})
  }
  
  componentWillUnmount() {
    API.rooms.leave(this.props.room)
  }

  render() {
    const {room} = this.props.match.params
    if(this.props.location.pathname == `/room/${room}`) {
      return <Redirect to={`/room/${room}/queue`} />
    }
    return (
      <View style={styles.main}>
        <View style={styles.body}>
          <Route path='/room/:room/queue' component={Queue} />
          <Route path='/room/:room/add' component={AddSong} />
        </View>
        <View style={styles.navContainer}>
          <View style={styles.nav}>
            <Link underlayColor='#FFF' to={`/room/${room}/queue`} style={styles.navItem}><Text>Queue</Text></Link>
            <Link underlayColor='#FFF' to={`/room/${room}/add`} style={styles.navItem}><Text>Search</Text></Link>
          </View>
        </View>
      </View>
    )
  }
}

export default connect(({rooms: {rooms}}, {match: {params: {room}}}) => ({
  room: rooms.find(r=> r._id === room)
}), (dispatch) => ({dispatch}))(Rooms)

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  body: {
    flex: 1
  },
  navContainer: {
    height: 40
  },
  nav: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: {
    paddingTop: 20,
    paddingBottom: 20
  }
})
