
const reducer = (state={rooms:[], active: ''}, {type, ...payload}) => {
  switch(type) {
    case 'NEW_ROOMS':
      return {
        ...state,
        rooms: state.rooms.concat(payload.rooms.filter(room => !state.rooms.find(r => r._id === room._id))).sort((a, b) => b._id.localeCompare(a._id))
      }
    case 'SONG_ADD':
    case 'QUEUE_UPDATE':
    case 'HISTORY_UPDATE': 
      const idx = state.rooms.findIndex(r => r._id === payload.room._id)
      return {
        ...state,
        rooms: [
          ...state.rooms.slice(0, idx),
          {
            ...payload.room, 
            current: 'song' in payload ? payload.song : state.rooms[idx].current,
            queue: 'queue' in payload ? payload.queue : state.rooms[idx].queue,
            history: 'history' in payload ? payload.history : state.rooms[idx].history
          },
          ...state.rooms.slice(idx+1)
        ]
      }
    case 'ROOM_UPDATE': {
      const idx = state.rooms.findIndex(r => r._id === payload.room._id)
      return {
        ...state,
        rooms: [
          ...state.rooms.slice(0, idx),
          payload.room,
          ...state.rooms.slice(idx+1)
        ]
      }
    }
    default:
      return state
  }
}
export default reducer
