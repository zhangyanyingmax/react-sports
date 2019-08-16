import React,{ Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Button, Modal, message} from 'antd';
import data from '../../utils/store';
import { removeItem } from '../../utils/storage';
import './index.less';

class HeaderMain extends Component{

  logOut = () => {
    Modal.confirm({
      title: '您确定要退出登陆吗?',
      okText: '确定',
      cancelText: '取消',
      onOk:() => {//对象里不能用=号
        //先移除数据，再跳转到登录页面
        data.user = {};
        removeItem();
        this.props.history.replace('/login');
        message.success('已退出登录')
      }
    });
  };


  render(){
    return <div className="header-main">
      <div className="header-main-top">
        <span>欢迎，{data.user.username}</span>
        <Button type="link" onClick={this.logOut}>退出</Button>
      </div>
      <div className="header-main-bottom">
        <h3>首页</h3>
        <div>
          <span>2019-08-16 09:43</span>
          <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt=""/>
          <span>晴</span>
        </div>
      </div>
    </div>
  }
}

//使用withRouter高阶组件，使HeaderMain组件拥有三大属性
export default withRouter(HeaderMain);