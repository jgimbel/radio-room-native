import React, { Component } from 'react'
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import {connect} from 'react-redux'

class Queue extends Component {
  state = {  }
  render() {
    const room = this.props.room
    console.log(this.props.room)
    if(!room) return <View />
    return (
      <View>
        <ScrollView>
          <Text style={styles.separator}>
            Next Up
          </Text>
          {
            room.queue.map((song) => (
              <View style={styles.historyItem}>
                <Image style={{width: 300, height: 300}} source={{uri: song.json.thumbnail}}/>
                <Text>{song.json.title}</Text>
              </View>
            ))
          }
          <Text style={styles.separator}>
            Now Playing
          </Text>
          {
            room.current
              ? (
                <View style={styles.historyItem}>
                  <Image style={{width: 300, height: 300}} source={{uri: room.current.json.thumbnail}}/>
                  <Text>{room.current.json.title}</Text>
                </View>
              )
              : (
                <Text style={styles.noSong}>No Song Playing</Text>
              )
          }

          <Text style={styles.separator}>
            History
          </Text>
            {
              reverse(room.history).map((song) => (
                <View style={styles.historyItem}>
                  <Image style={{width: 300, height: 300}} source={{uri: song.thumbnail}}/>
                  <Text>{song.title}</Text>
                </View>
              ))
            }
        </ScrollView>
      </View>
    )
  }
}

function reverse(arr) {
  return arr.reduce((a, k) => [k, ...a], [])
}

const styles = StyleSheet.create({
  history: {

  },
  historyItem : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap'
  },
  historyImage: {

  },
  historyTitle: {

  },
  separator: {
    fontSize: 24
  },
  noSong: {
    fontSize: 36,
    color: '#000'
  }
})

export default connect(({rooms: {rooms}}, {match: {params: {room}}}) => ({
  room: rooms.find(r => r._id === room)
}))(Queue)