/*
  创建action对象
 */
import { SAVE_USER, REMOVE_USER} from './action-types';

export const saveUser = (user) => ({type: SAVE_USER, data: user});

export const removeUser = () => ({type: REMOVE_USER});