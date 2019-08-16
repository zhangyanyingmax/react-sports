import React,{ Component } from 'react';
import { Link} from 'react-router-dom';
import data from '../../utils/store';
import { getItem} from '../../utils/storage';
import { reqValidateUser} from '../../api';
import { message, Spin,Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';

import logo from '../../assets/images/logo.png';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;


export default class Admin extends Component{

  //初始化状态
  state = {
    isLoading: true,
    collapsed: false,
    isDisplay: 'block'
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({
      collapsed,
      isDisplay: collapsed ? 'none' : 'block'
    });
  };

  checkUserLogin = () => {
    if (!data.user._id){
      //内存中没有，再判断本地
      const user = getItem();
      if (!user){
        //本地也没有，先去登录
        this.props.history.replace('/login');
        return true;
      }
      //如果本地有，先验证信息是否合法
      reqValidateUser(user._id)
        .then(() => {
          //验证通过，把数据存储到内存中
          data.user = user;
          /*但是请求是异步代码，render方法中不会等待异步代码，请求还没响应，就已经渲染admin了，所以无法做验证，需要通过更改页面的状态来完成，为了render方法简洁明了，定义一个函数，render里面调用
          更新了状态，会重新渲染组件，重新进入render方法，重新调用checkUserLogin方法
           */
          this.setState({
            isLoading: false
          })
        })
        .catch(() => {
          //验证不通过，先去登陆
          this.props.history.replace('/login');
          message.error('请先登录')

        });
      return true;

    }else {
      return false;
    }
  };


  render(){
    //判断用户是否登陆过，是否有用户数据
    const isLoading = this.checkUserLogin();
    //通过函数的返回值，判断，如果返回值为true，就渲染loading
    if(isLoading) return <Spin tip="loading" />;

    //返回值为false，就渲染admin
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <Link to="/home" className="admin-logo">
            <img src={logo} alt="logo"/>
            <h1 style={{display:this.state.isDisplay}}>硅谷后台</h1>
          </Link>
          {/*考虑到用户权限，需要将menu菜单动态生成，单独定义组件，非路由组件，定义在components*/}
          <LeftNav />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '65px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    );
  }
}