import React,{ Component } from 'react';
import { Form, Icon, Input, Button} from 'antd';

import logo from './logo.png';

import './index.less';

const Item = Form.Item;

export default class Login extends Component{
  render(){
    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目：后台管理系统</h1>
      </header>
      <section className="login-from">
        <h2>用户登录</h2>
        <Form onSubmit={this.handelSubmit}>
          <Item>
            <Input prefix={<Icon type="user" />} placeholder="用户名"/>
          </Item>
          <Item>
            <Input prefix={<Icon type="lock" />} placeholder="用户名"/>
          </Item>
          <Button type="primary" htmlType="submit" className="login-btn">登录</Button>

        </Form>
      </section>
    </div>
  }
}