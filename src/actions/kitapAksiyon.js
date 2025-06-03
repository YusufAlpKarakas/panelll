import axios from 'axios';

export const FETCH_BOOKS = 'FETCH_BOOKS';
export const DELETE_BOOK = 'DELETE_BOOK';
export const ADD_BOOK = 'ADD_BOOK';

export const fetchBooks = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:3000/kitaplar');
    console.log('API Yanıtı:', response.data); // Yanıtı düzgün şekilde yazdır
    dispatch({ type: FETCH_BOOKS, payload: response.data });
  } catch (error) {
    console.error('Kitaplar alınırken bir hata oluştu:', error);
  }
};

export const deleteBook = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:3000/kitaplar/${id}`); // Kitap silme
    dispatch({ type: DELETE_BOOK, payload: id });
  } catch (error) {
    console.error('Kitap silinirken bir hata oluştu:', error);
  }
};

export const addBook = (book) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:3000/kitaplar', book); // Kitap ekleme
    dispatch({ type: ADD_BOOK, payload: response.data });
  } catch (error) {
    console.error('Kitap eklenirken bir hata oluştu:', error);
  }
};
