import React, { Component } from 'react'
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import {connect} from 'react-redux'
import Playlist from './playlist'

class Queue extends Component {
  state = {  }
  render() {
    const room = this.props.room
    console.log(room)
    if(!room) return <View />
    return (
      <View>
        <Playlist header='Up Next' songs={room.queue || []} />
        <Playlist header='Now Playing' songs={room.current ? [room.current] : []} />
        <Playlist header='History' songs={room.history || []} />
      </View>
    )
  }
}

function reverse(arr) {
  return arr.reduce((a, k) => [k, ...a], [])
}

const styles = StyleSheet.create({
  playlist: {
    height: '27%',
    width: '100%'
  },
  historyItem : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    flexDirection: 'column'
  },
  songImage: {width: '50%', height: '100%'},
  historyImage: {

  },
  historyTitle: {

  },
  separator: {
    fontSize: 24,
    textAlign: 'center'
  },
  noSong: {
    height: '27%',
    fontSize: 36,
    color: '#000',
    textAlign: 'center'
  },
  load: {
    position: 'relative',
    top: '50%',
    right: '50%'
  }
})

export default connect(({rooms: {rooms}}, {match: {params: {room}}}) => ({
  room: rooms.find(r => r._id === room)
}))(Queue)