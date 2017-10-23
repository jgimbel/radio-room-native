
const reducer = (state={rooms:[], active: ''}, {type, ...payload}) => {
  switch(type) {
    case 'NEW_ROOMS':
      return {
        ...state,
        rooms: state.rooms.concat(payload.rooms.filter(room => !state.rooms.find(r => r._id === room._id)))
      }
    default: 
      return state
  }
}
export default reducer
