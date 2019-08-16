

import axiosInstance  from './ajax';
import jsonp from 'jsonp';


//定义一个登陆方法
export const reqLoad = (username,password) => axiosInstance.post('/login',{username,password});

//定义一个验证的方法
export const reqValidateUser = (id) => axiosInstance.post('/validate/user',{id});

//定义一个请求天气的方法
export const reqWeather = (cityName) => {
  return new Promise((resolve, reject) => {
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${cityName}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
      {},
      function(error,data){
        if (error){
          reject(error)
        } else {
          const { weather, dayPictureUrl} = data.results[0].weather_data[0];
          resolve({
            weather,
            dayPictureUrl
          })
        }
      }
    )
  })
};

//定义一个请求数据分类的方法
export const reqGetCategories = (parentId) => axiosInstance.get('/manage/category/list',{
  params: parentId
});

//定义一个添加分类的请求
export const reqAddCategory = (categoryName,parentId) => axiosInstance.post('/manage/category/add',{categoryName,parentId});
