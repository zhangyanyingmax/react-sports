

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

