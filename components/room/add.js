import React, { Component } from 'react'
import { View, TextInput, ScrollView, TouchableHighlight, StyleSheet, Text } from 'react-native'
import API from '../../API'
class AddSong extends Component {
  state = { 
    songs: [],
    text: ''
  }

  handleTextChange = (text) => {
    this.setState({text})
    if(text.length < 2) return
    API.songs.search(text)
    .then((songs) => {
      Array.isArray(songs) && this.setState({songs})
    })
  }

  addSong(song) {
    API.songs.add(song)
    this.setState({text: '', songs: []})
  }

  render() {
    return (
      <View style={styles.main}>
        <TextInput placeholder='Search' value={this.state.text} onChangeText={this.handleTextChange} />
        <ScrollView>
          {this.state.songs.map((song) => (
            <TouchableHighlight style={styles.btn} onPress={() => this.addSong(song)} key={song.id.videoId}>
              <Text>{song.snippet.title}</Text>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    width: '100%'
  },
  btn: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 2
  }
})

export default AddSong