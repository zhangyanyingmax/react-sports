

import axiosInstance  from './ajax';


//定义一个登陆方法
export const reqLoad = (username,password) => axiosInstance.post('/login',{username,password});

//定义一个验证的方法
export const reqValidateUser = (id) => axiosInstance.post('/validate/user',{id});