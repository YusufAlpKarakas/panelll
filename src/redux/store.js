// src/redux/store.js
import { applyMiddleware, createStore } from 'redux';
import {thunk} from 'redux-thunk';  // redux-thunk'ı doğru şekilde import ediyoruz
import rootReducer from '../reducers/rootReducer'  // reducers'ı doğru şekilde import ediyoruz

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)  // Thunk middleware'ını store'a dahil ediyoruz
);

export default store;


