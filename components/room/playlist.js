import React from 'react'
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native'
function Playlist({header, songs}) {
  return (
    <View>
      <Text style={styles.separator}>
        {header}
      </Text>
      <ScrollView style={styles.playlist} horizontal>
        {
          songs.map((song, idx) => (
            <View key={idx} style={styles.historyItem}>
              <Image
                style={{flex:1, height: undefined, width: undefined, alignSelf: 'stretch'}}
                resizeMode="contain"
                source={{uri: song.thumbnail || song.json.thumbnail}}
              />
              <Text style={styles.title}>{song.title || song.json.title}</Text>
            </View>
          ))
        }
      </ScrollView>
    </View>
  )
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
  title: {
    textAlign: 'center'
  },
  separator: {
    fontSize: 24,
    textAlign: 'center'
  },
})

export default Playlist;