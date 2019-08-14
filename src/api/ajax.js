import axios from 'axios';

//判断是开发环境还是生产环境
console.log(process.env.NODE_ENV);
const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:5000';

//创建axios实例对象
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
});

//设置拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    //响应成功的回调
    const result = response.data;
    if (result.status === 0){
      //响应成功，返回成功的数据
      return result.data || {};
    } else{
      //响应失败，返回失败的具体信息
      return Promise.reject(result.msg || '请求失败')
    }
  },
  (error) => {
    //响应失败的回调
    console.log(error);
    return Promise.reject('网络异常，请刷新重试')
  }
);

//暴露
export default axiosInstance;