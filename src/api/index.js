

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
  params: {
    parentId
  }
});

//定义一个添加分类的请求
export const reqAddCategory = (categoryName,parentId) => axiosInstance.post('/manage/category/add',{categoryName,parentId});

//定义修改分类名称的方法
export const reqUpdateCategoryName = (categoryName,categoryId) => axiosInstance.post('/manage/category/update',{categoryName,categoryId});

//定义获取商品的方法
export const reqGetProduct = (pageNum,pageSize) => axiosInstance.get('/manage/product/list',{
  params:{
    pageNum,
    pageSize
  }
  });

//定义一个添加商品的方法
export const reqAddProduct = ({categoryId, pCategoryId, desc, price, detail, name}) => axiosInstance.post('manage/product/add',{categoryId, pCategoryId, desc, price, detail, name});

//定义一个更新商品的方法
export const reqUpdateProduct = ({_id, categoryId, pCategoryId, desc, price, detail, name}) => axiosInstance.post('manage/product/update',{_id, categoryId, pCategoryId, desc, price, detail, name});

//定义一个搜索商品的方法
export const reqSearchProduct = (options) => axiosInstance.get('/manage/product/search',{ params: options});

//定义一个改变商品状态的方法
export const reqUpdateProductStatus = (productId, status) => axiosInstance.post('/manage/product/updateStatus',{productId, status});

//定义一个获取角色列表的方法
export const reqGetRole = () => axiosInstance.get('/manage/role/list');

//定义一个创建角色的方法
export const reqAddRole = (name) => axiosInstance.post('/manage/role/add',{name});

//定义一个设置角色权限的方法
export const reqUpdateRole = ({auth_name,menus,_id}) => axiosInstance.post('manage/role/update',{auth_name,menus,_id});

//定义一个获取用户列表的方法
export const reqGetUser = () => axiosInstance.get('/manage/user/list');

//定义一个添加用户的方法
export const reqAddUser = ({username, password, phone, email, role_id}) => axiosInstance.post('/manage/user/add',{username, password, phone, email, role_id});