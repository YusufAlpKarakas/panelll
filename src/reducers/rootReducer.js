// src/reducers/rootReducer.js
import { combineReducers } from 'redux';
import productSlice from './productSlice'
import kitapReducer from './kitapReducer';


const rootReducer = combineReducers({
  products: productSlice,
  kitap:kitapReducer
});

export default rootReducer;
