import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import { getAllArticlesReducer,getAllImgProductsReducer,updateArticleReducer,deleteArticleReducer } from './reducers/articlesReducers'
import {cartReducer} from './reducers/cartReducer'
import { loginUserReducer, registerUserReducer } from './reducers/userReducer';
import { listInventaireReducer,getUserOrdersReducer, getAllOrdersReducer } from './reducers/listInventaireReducer';
import { getRefMvmReducer ,getQtStByRefReducer,creationMvmReducer,getAllMouvementsReducer,deleteMvmReducer,updateMvmReducer,getAllMouvementsGraphiqueReducer} from './reducers/mvmReducer';

//import { placeCartReducer } from './reducers/cartReducer';


const middleware = [thunk];
const rootReducer = combineReducers({
  articles: getAllArticlesReducer, // Use meaningful key like 'allProducts'
  cartReducer: cartReducer,
  //registerUserReducer:registerUserReducer,
  loginUserReducer:loginUserReducer, 
  listInventaireReducer:listInventaireReducer,
  getUserOrdersReducer:getUserOrdersReducer,
  //getAllOrdersReducer:getAllOrdersReducer,
 
  getRefMvmReducer:getRefMvmReducer,
  imgProducts: getAllImgProductsReducer,
  getQtStByRefReducer:getQtStByRefReducer,
  creationMvmReducer:creationMvmReducer,
  mouvements:getAllMouvementsReducer,
  updateArticleReducer:updateArticleReducer,
  deleteArticleReducer:deleteArticleReducer,
  deleteMvmReducer:deleteMvmReducer,
  updateMvmReducer:updateMvmReducer,
  getAllMouvementsGraphiqueReducer:getAllMouvementsGraphiqueReducer
  //placeCartReducer:placeCartReducer
  // Use 
  // Use
  // other reducers...
});
const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) :[];
const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) :null;


const initialState = {
  cartReducer : {
    cartItems: cartItems
  },
  loginUserReducer : {
    currentUser: currentUser
  }
  
}


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState
});

export default store;




