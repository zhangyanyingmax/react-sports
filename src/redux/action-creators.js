/*
  创建action对象
 */
import { message } from 'antd';
import { SAVE_USER, REMOVE_USER, GET_CATEGORY, ADD_CATEGORY, UPDATE_CATEGORY_NAME} from './action-types';
import { reqGetCategories, reqAddCategory, reqUpdateCategoryName } from '../api';
//保存用户数据的action
export const saveUser = (user) => ({type: SAVE_USER, data: user});
//删除用户数据的action
export const removeUser = () => ({type: REMOVE_USER});
//获取category的同步action
export const getCategories = (categories) => ({type: GET_CATEGORY, data: categories});
//添加category分类的同步action
export const addCategory = (category) => ({type: ADD_CATEGORY, data: category});
//更新categoryName的同步action
export const updateCategoryName = (category) => ({type: UPDATE_CATEGORY_NAME, data: category});

//获取categories的异步action
export const getCategoriesAsync = (parentId) => {
  return (dispatch) => {
    reqGetCategories(parentId)
      .then((res) => {
        message.success('获取分类成功', 3);
        //更新状态数据
        dispatch(getCategories(res))
      })
      .catch(() => {
        message.error('获取分类失败', 3)
      })
  }
};

//添加category的异步action
export const addCategoryAsync = (parentId, categoryName) => {
  return (dispatch) => {
    reqAddCategory(parentId, categoryName)
      .then((res) => {
        message.success('添加分类成功', 3);
        //更新状态数据
        dispatch(addCategory(res))
      })
      .catch(() => {
        message.error('添加分类失败', 3)
      })
  }
};

//更新categoryName的异步action
export const updateCategoryNameAsync = (categoryId,categoryName ) => {
  return (dispatch) => {
    reqUpdateCategoryName(categoryId, categoryName)
      .then((res) => {
        message.success('修改分类名称成功', 3);
        //更新状态数据
        dispatch(updateCategoryName(categoryId, categoryName))
      })
      .catch(() => {
        message.error('修改分类名称失败', 3)
      })
  }
};