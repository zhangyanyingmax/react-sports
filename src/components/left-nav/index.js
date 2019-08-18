import React,{ Component } from 'react';
import {Link, withRouter} from "react-router-dom";
import {Icon, Menu} from "antd";
import { menuList} from '../../config/menuConfig';
const { SubMenu, Item } = Menu;

class LeftNav extends Component{

  constructor(props){
    super(props);
    // this.selectKey = this.props.location.pathname;
    let { pathname } = this.props.location;
    if (pathname.startsWith('/product')) {
      pathname = '/product'
    }
    this.menu = this.createMenu(pathname);
    this.state = {
      selectKey: ''
    }
  }

  static getDerivedStateFromProps(nextProps) {
    let { pathname } = nextProps.location;
    if (pathname.startsWith('/product')) {
      pathname = '/product'
    }
    return {
      selectKey: pathname
    }
  };

  //根据后台数据遍历生成
  createItem = (item) => {
    return <Item key={item.key}>
      <Link to={item.key}>
        <Icon type={item.icon} />
        <span>{item.title}</span>
      </Link>
    </Item>
  };



  createMenu = (path) => {
    return menuList.map((menu) => {
      //判断是一级菜单还是二级菜单
      if (menu.children){
        //存在children，代表是二级菜单
        return <SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
          {
            menu.children.map((item) => {
              //判断是否为二级菜单
              if (path === item.key){
                this.openKey = menu.key;
              }
              return this.createItem(item)
            })
          }

        </SubMenu>
      } else{
        //一级菜单
        return this.createItem(menu)
      }

    });



  };

  render(){
    console.log('render()');
    //menu在这里渲染是多次渲染，我们只需要渲染一次即可，则将生成菜单放在constructor
    /*
    * defaultSelectedKeys:刷新默认还是原来选中的菜单
    * defaultOpenKeys：刷新默认还是展开菜单
    *
    * */

    const { selectKey } = this.state;
    return <Menu theme="dark" selectedKeys={[selectKey]} defaultOpenKeys={[this.openKey]} mode="inline">
      {
        this.menu
      }
    </Menu>
  }
}

//使用withRouter高阶组件，传入leftNav组件，使LeftNav组件具有路由组件的三大属性
export default withRouter(LeftNav);