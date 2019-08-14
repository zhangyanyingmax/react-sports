/*
  定义一个登陆方法

 */

import axiosInstance  from './ajax';

export const reqLoad = (username,password) => axiosInstance.post('/login',{username,password});