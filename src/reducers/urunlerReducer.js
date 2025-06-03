const initialState = {
  tests: [],
};

const urunlerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TEST':
      return { ...state, tests: [...state.tests, action.payload] };
    case 'FETCH_TESTS':
      return { ...state, tests: action.payload };
    default:
      return state;
  }
};

export default urunlerReducer;
