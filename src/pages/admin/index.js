import React,{ Component } from 'react';
import { Redirect} from 'react-router-dom';
import data from '../../utils/store';
import { getItem} from '../../utils/storage';

export default class Admin extends Component{
  render(){
    //判断用户是否登陆过，是否有用户数据
    if (!data.user._id){
      //内存中没有，再判断本地
      const user = getItem();
      if (!user){
        //本地也没有，先去登录
        return <Redirect to="/login" />
      }
      //如果本地有，先储存到内存
      data.user = user;
    }


    return <div>
      Admin...
    </div>
  }
}