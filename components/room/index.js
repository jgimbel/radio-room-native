import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client'
import { View, Text, Button, StyleSheet } from 'react-native'
import {Route, Link, Redirect} from 'react-router-native'
import {connect} from 'react-redux'
import API, {socket} from '../../API'
import Queue from './queue'
import AddSong from './add'

import Sound from 'react-native-sound';
Sound.setCategory('Playback', true)

const EXTENSIONS = ['aac', 'aiff', 'mp3', 'wav', 'm4a']

class Rooms extends Component {
  state = {
    disconnect: false,
    songLoading: true
  }

  componentDidMount() {
    this.updateRoom()
    socket.on('disconnect', () => this.setState({disconnected: true}))
    socket.on('connect', () => {
      this.setState({disconnected: false})
      this.updateRoom()
    })
    API.rooms.join(this.props.room)
    API.songs.onAdd(this.handleSongAdd)
    API.songs.onQueueUpdate(this.handleQueueUpdate)
    API.songs.onHistoryUpdate(this.handleHistoryUpdate)
    API.rooms.onPulse(this.handlePulse)
  }

  updateRoom() {
    API.rooms.getRoom(this.props.room.alias).then((room) => {
      this.props.dispatch({
        type: 'ROOM_UPDATE',
        room
      })
      if(room.current) {
        this.play(room.current)
      }
    })
  }

  play = (song, index = 0) => {
    if(!this.props.room.current) return
    this.player && this.player.stop().release()


    const sources = this.props.room.current.json.formats
    .filter(f => EXTENSIONS.includes(f.ext))
    .sort((a, b) => a.filesize - b.filesize)

    if(index >= sources.length) {
      console.log('no source found')
      return
    }
    const source = sources[index]
    this.setState({songLoading: true})
    this.player = new Sound(source.url, undefined, (err, sound) => {
      clearTimeout(this.timer)
      API.rooms.pulse().then(({currentTime}) => {
        this.player.play()
        this.player.setCurrentTime((currentTime)/1000)
        this.setState({songLoading: false})
      })
    })
    this.timer = setTimeout(() => {
      this.play(song, index+1)
    }, 2500)

  }

  handlePulse = (res) => {
    this.player.setCurrentTime(res)
  }

  handleRoomUpdate(update) {
    API.rooms.pulse().then()
    this.props.dispatch({
      type: 'SONG_ADD',
      room: this.props.room,
      ...update
    })
  }
  handleSongAdd = ({song}) => {
    this.handleRoomUpdate({song})
    this.play(song)
  }
  handleHistoryUpdate = ({history}) => {
    this.handleRoomUpdate({history})
  }
  handleQueueUpdate = ({queue}) => {
    this.handleRoomUpdate({queue})
  }

  componentWillUnmount() {
    API.rooms.leave(this.props.room)
    this.player && this.player.stop().release()
    // API.rooms.removeJoin(this.props.room)
    // API.songs.removeOnAdd(this.handleSongAdd)
  }

  render() {
    const {room} = this.props.match.params
    const {pathname} = this.props.location
    if(!room) {
      return <Redirect push={false} to={`/`} />
    }
    if(pathname == `/room/${room}`) {
      return <Redirect push={false} to={`/room/${room}/queue`} />
    }
    return (
      <View style={styles.main}>
        <View style={styles.body}>
          <Route path='/room/:room/queue' render={(props) => <Queue {...props} loading={this.state.songLoading}/>} />
          <Route path='/room/:room/add' component={AddSong} />
        </View>
        <View style={styles.navContainer}>
          <View style={styles.nav}>
            <Link replace underlayColor='rgba(255,255,255,0)' to={`/room/${room}/queue`} style={[styles.navItem, pathname.includes('queue') && styles.activeNav]}><Text>Queue</Text></Link>
            <Link replace underlayColor='rgba(255,255,255,0)' to={`/room/${room}/add`} style={[styles.navItem, pathname.includes('add') && styles.activeNav]}><Text>Search</Text></Link>
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
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    width: '50%',
  },
  activeNav: {
    backgroundColor: 'lightblue',
    color: 'white'
  }
})
