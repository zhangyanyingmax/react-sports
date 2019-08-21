import React,{ Component } from 'react';
import { Link, Route, Redirect, Switch} from 'react-router-dom';
import { message, Spin,Layout } from 'antd';
import { connect } from 'react-redux';

// import data from '../../utils/store';
import { saveUser } from '../../redux/action-creators';
import { getItem} from '../../utils/storage';
import { reqValidateUser} from '../../api/index';
import LeftNav from '../left-nav/index';
import HeaderMain from '../header-main/index';
import Home from '../../pages/home/index';
import Category from '../category/index';
import Product from '../../pages/product/index';
import User from '../../pages/user/index';
import Role from '../../pages/role/index';
import Bar from '../../pages/charts/bar';
import Line from '../../pages/charts/line';
import Pie from '../../pages/charts/pie';

import logo from '../../assets/images/logo.png';
import './index.less';

const { Header, Content, Footer, Sider } = Layout;


class Admin extends Component{

  //初始化状态
  state = {
    // isLoading: true,
    collapsed: false,
    isDisplay: 'block',
    menus: []
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({
      collapsed,
      isDisplay: collapsed ? 'none' : 'block'
    });
  };

  checkUserLogin = () => {
    if (!this.props.user._id){
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
          //验证通过，把数据存储到redux中
          this.props.saveUser(user);
          /*但是请求是异步代码，render方法中不会等待异步代码，请求还没响应，就已经渲染admin了，所以无法做验证，需要通过更改页面的状态来完成，为了render方法简洁明了，定义一个函数，render里面调用
          更新了状态，会重新渲染组件，重新进入render方法，重新调用checkUserLogin方法
           */
          this.setState({
            // isLoading: false,
            menus: user.role.menus
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
    const { collapsed, menus, isDisplay } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <Link to="/home" className="admin-logo">
            <img src={logo} alt="logo"/>
            <h1 style={{display:isDisplay}}>硅谷后台</h1>
          </Link>
          {/*考虑到用户权限，需要将menu菜单动态生成，单独定义组件，非路由组件，定义在components*/}
          <LeftNav />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '65px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                {
                  menus.map((menu, index) => {
                    switch (menu) {
                      case '/home' :
                        return <Route key={index} path="/home" component={Home}/>;
                      case '/category' :
                        return <Route key={index} path="/category" component={Category}/>;
                      case '/product' :
                        return <Route key={index} path="/product" component={Product}/>;
                      case '/user' :
                        return <Route key={index} path="/user" component={User}/>;
                      case '/role' :
                        return <Route key={index} path="/role" component={Role}/>;
                      case '/charts/bar' :
                        return <Route key={index} path="/charts/bar" component={Bar}/>;
                      case '/charts/line' :
                        return <Route key={index} path="/charts/line" component={Line}/>;
                      case '/charts/pie' :
                        return <Route key={index} path="/charts/pie" component={Pie}/>;
                      default:
                        return null;
                    }
                  })
                }
                <Redirect to="/home" />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  (state) => ({user: state.user}),
  { saveUser }
)(Admin);