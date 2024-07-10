const pointsReducer = (state = { points: 0 }, action) => {
  switch (action.type) {
    case 'GET_POINTS':
      console.log("Reducer GET_POINTS Payload:", action.payload); 
      return { ...state, points: action.payload.points }; 
    case 'UPDATE_POINTS':
      console.log("Reducer UPDATE_POINTS Payload:", action.payload);
      return { ...state, points: action.payload.points }; 
    default:
      return state;
  }
};

export default pointsReducer;
