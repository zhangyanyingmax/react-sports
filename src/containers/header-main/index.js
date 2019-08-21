import React,{ Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Button, Modal, message} from 'antd';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { removeUser } from '../../redux/action-creators';
// import data from '../../utils/store';
import { removeItem } from '../../utils/storage';
import { menuList } from '../../config/menuConfig';
import { reqWeather } from '../../api/index';

import './index.less';

class HeaderMain extends Component{

  //初始化状态
  constructor(){
    super();
    this.state = {
      title: '',
      time: this.getTime(),
      weather: '晴',
      dayPictureUrl: 'http://api.map.baidu.com/images/weather/day/qing.png'
    }
  }

  //跳转获取title,因为初始化渲染和更新都要进行
  static getDerivedStateFromProps(nextProps,prevState){
    //获取地址
    const path = nextProps.location.pathname;
   /* if (path === '/'){
      return {
        title: '首页'
      }
    }*/

    //遍历menulist
    for (let i = 0; i <menuList.length ; i++) {
      const menu = menuList[i];
      if (menu.children){
        //二级菜单
        const children = menu.children;
        for (let j = 0; j <children.length ; j++) {
          const cMenu = children[j];
          if (path === cMenu.key){
            return {
              title: cMenu.title
            }
          }
        }
      } else {
        //一级菜单
        if (path === menu.key){
          return {
            title: menu.title
          }
        }
      }
    }
    return {
      title: '首页'
    }

  }

  //请求时间跟天气
  componentDidMount(){
    //请求时间
    this.timer = setInterval(() => {
      this.setState({
        time: this.getTime()
      })
    },1000);

    //请求天气
    reqWeather('深圳')
      .then((res) => {
        message.success('请求天气成功',3);
        // console.log(res);
        this.setState(res)
      })
      .catch((error) => {
        message.error(error,3);
      })



  }

  //清除计时器
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  //退出登录
  logOut = () => {
    Modal.confirm({
      title: '您确定要退出登录吗?',
      okText: '确定',
      cancelText: '取消',
      onOk:() => {//对象里不能用=号
        //先移除数据，再跳转到登录页面
        this.props.removeUser();
        removeItem();
        this.props.history.replace('/login');
        message.success('已退出登录')
      }
    });
  };

  //获取时间
  getTime = () => dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

  render(){
    const { title, time, weather, dayPictureUrl} = this.state;
    return <div className="header-main">
      <div className="header-main-top">
        <span>欢迎，{this.props.user.username}</span>
        <Button type="link" onClick={this.logOut}>退出</Button>
      </div>
      <div className="header-main-bottom">
        <h3>{title}</h3>
        <div>
          <span>{time}</span>
          <img src={dayPictureUrl} alt=""/>
          <span>{weather}</span>
        </div>
      </div>
    </div>
  }
}

//使用withRouter高阶组件，使HeaderMain组件拥有三大属性
export default connect(
  (state) => ({ user: state.user}),
  { removeUser}
)(withRouter(HeaderMain));