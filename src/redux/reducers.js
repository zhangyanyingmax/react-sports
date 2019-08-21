/*
  更新newState
 */
import {combineReducers} from 'redux';
import { SAVE_USER, REMOVE_USER, GET_CATEGORY, ADD_CATEGORY, UPDATE_CATEGORY_NAME } from './action-types';

function user(prevState={},action) {
  switch (action.type) {
    case SAVE_USER :
      return action.data;
    case REMOVE_USER :
      return {};
    default :
      return prevState;
  }
}

function categories(prevState=[],action) {
  switch (action.type) {
    case GET_CATEGORY :
      return action.data;
    case ADD_CATEGORY :
      return [...prevState,action.data];
    case UPDATE_CATEGORY_NAME :
      return prevState.map((category) => {
        if (category._id === action.data.categoryId){
          category.name = action.data.categoryName
        }
        return category
      });
    default :
      return prevState;
  }
}

export default combineReducers({
  user,
  categories
})
