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
          <Text style={styles.separator}>
            Next Up
          </Text>
        <ScrollView style={styles.playlist} horizontal>
          {
            room.queue.map((song, idx) => (
              <View key={idx} style={styles.historyItem}>
                <Image
                  style={{flex:1, height: undefined, width: undefined, alignSelf: 'stretch'}}
                  resizeMode="contain"
                  source={{uri: song.json.thumbnail}}
                />
                <Text>{song.json.title}</Text>
              </View>
            ))
          }
        </ScrollView>
          <Text style={styles.separator}>
            Now Playing
          </Text>
          {
            room.current
              ? (
                <View style={styles.playlist}>
                  <View style={styles.historyItem}>
                    <Image
                      style={{flex:1, height: undefined, width: undefined, alignSelf: 'stretch'}}
                      resizeMode="contain"
                      source={{uri: room.current.json.thumbnail}}
                    />
                    <Text>{room.current.json.title}</Text>
                  </View>
                </View>
              )
              : (
                <Text style={styles.noSong}>No Song Playing</Text>
              )
          }

          <Text style={styles.separator}>
            History
          </Text>

        <ScrollView style={styles.playlist} horizontal>
          {
            reverse(room.history).map((song, idx) => (
              <View key={idx} style={styles.historyItem}>
                <Image 
                  style={{flex:1, height: undefined, width: undefined, alignSelf: 'stretch'}}
                  resizeMode="contain"
                  source={{uri: song.thumbnail}}
                />
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
  playlist: {
    height: '28%',
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