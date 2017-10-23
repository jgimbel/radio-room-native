import SocketIOClient from 'socket.io-client'

export const baseURL = 'https://rr-staging.herokuapp.com'
export const basePath = '/api/v1'
export const fullPath = `${baseURL}${basePath}`
function callAPI(path, opts={method: 'GET'}) {
  return fetch(`${fullPath}${path}`, opts)
    .then(res => res.json())
}

export const socket = SocketIOClient(`${baseURL}/`)

const listen_channels = ['join', 'disconnect', 'leave', 'pulse', 'song_started', 'queue_updated']

const listeners = listen_channels.reduce((o, k) => ({...o, [k]: []}), {})

listen_channels.forEach(channel => {
  socket.on(channel, (evt) => listeners[channel].forEach(func => func(evt)))
})

export default {
  users: {
    get(id) {
      return callAPI(`/users/${id || ''}`)
    }
  },
  songs: {
    search(text) {
      return callAPI(`/songs/search?title=${encodeURIComponent(text)}`)
    },
    add(song) {
      return new Promise((resolve, reject) => {
        socket.emit('add_song_to_room', {url: `https://youtube.com/watch?v=${song.id.videoId}`}, resolve)
      })
    },
    onAdd(func) {
      listeners['song_started'].push(func)
      //deal with it later...
      listeners['queue_updated'].push(func)
    },
    vote(type, song) {
      socket.emit('vote', {type: vote, id: song._id})
    }
  },
  rooms: {
    getRooms() {
      return callAPI(`/rooms`)
    },
    getRoom(id) {
      return callAPI(`/rooms/${id}`)
    },
    addRoom() {
      return callAPI(`/rooms`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: '' + Date.now()
        })
      })
    },
    pulse() {
      socket.emit('pulse')
    },
    onPulse(func) {
      listeners.pulse.push(func)
    },
    join(room) {
      return new Promise((resolve, reject) => {
        socket.emit('join', {room_id: room._id}, resolve)        
      })
    },
    onJoin(func) {
      listeners.join.push(func)
    },
    leave(id) { // ?
      socket.emit('leave', {room_id: room._id})
    },
    onLeave(func) {
      listeners.leave.push(func)
    },
    onDisconnect(func) {
      listeners.disconnect.push(func)
    }
  }
}
