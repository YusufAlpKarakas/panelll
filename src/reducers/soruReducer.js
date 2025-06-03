import { SORU_EKLE, SORU_EKLE_ERROR } from '../actions/soruAksiyon';

const initialState = {
  sorular: [],
  loading: false,
  error: null,
};

const sorularReducer = (state = initialState, action) => {
  switch (action.type) {
    case SORU_EKLE:
      return {
        ...state,
        sorular: [...state.sorular, action.payload],
        loading: false,
      };
    case SORU_EKLE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default sorularReducer;
