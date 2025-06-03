import { FETCH_BOOKS, DELETE_BOOK, ADD_BOOK } from '../actions/kitapAksiyon';

const initialState = {
  books: [],
};

const kitapReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKS:
      return { ...state, books: action.payload }; // API'den gelen kitap verilerini books array'ine ekle
    case DELETE_BOOK:
      return { ...state, books: state.books.filter((book) => book.id !== action.payload) }; // Silinen kitabı listeden çıkar
    case ADD_BOOK:
      return { ...state, books: [...state.books, action.payload] }; // Yeni kitabı listeye ekle
    default:
      return state; // Diğer durumlar için mevcut state'i döndür
  }
};

export default kitapReducer;
