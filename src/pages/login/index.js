import React,{ Component } from 'react';
import { Form, Icon, Input, Button, message} from 'antd';
import {reqLoad} from '../../api';
import data from '../../utils/store';
import { setItem} from '../../utils/storage';

import logo from '../../assets/images/logo.png';

import './index.less';
//定义变量不能放在import上面，会报错
const Item = Form.Item;

class Login extends Component{

  //表单校验
  validator = (rule,value,callback) => {
    /*callback();*/
    /*
      rule 通过这个参数能知道是哪个Input组件进行表单校验
      value 校验的值是多少
      callback
        callback() 代表表单校验成功
        callback(errMsg) 代表表单校验失败，失败的提示就是errMsg

     */

    // console.log(rule,value);
    const name = rule.field === 'username'? '用户名': '密码';
    const valueReg = /^\w+$/;
    if (!value){
      callback(`请输入${name}`)
    }else if (value.length < 4){
      callback(`${name}长度要大于4`)
    }else if (value.length > 10){
      callback(`${name}长度要小于10`)
    }else if (!valueReg.test(value)){
      callback(`${name}只能包含英文，字符，下划线`)
    }

    callback();

  };

  login = (e) => {
    //首先要禁止button默认行为
    e.preventDefault();
    //只有验证成功才可以进行登录
    this.props.form.validateFields((error,values) => {
      // console.log(error,values);
      //error是校验的错误信息提示，当校验成功，值为null，判断校验成功，主要判断error是否有值
      if (!error){
        //校验成功，允许登录，发送请求
        /*axios.post('http://localhost:3000/login',values)
          .then((response) => {
            const result = response.data;
            if (result.status === 0){
              message.success('登录成功',1)
            }else{
              message.error(result.msg,1);
              //重置密码
              this.props.form.resetFields(['password']);
            }
          })
          .catch((error) => {
            message.error('登录失败，网络出现异常',1);
            //重置密码
            this.props.form.resetFields(['password']);
          })*/
        const {username, password} = values;
        reqLoad(username,password)
          .then((response) => {
            // console.log(response);
            message.success('登陆成功');
            //所以登录成功需要保存数据，先保存在内存中，在保存到本地，
            data.user = response;
            //response是对象，保存需要是字符串，所以先转化为字符串
            setItem(response);
            //跳转页面到admin
            this.props.history.replace('/')
            //但是有可能直接访问admin，需要判断，不能直接访问，需要先登录
          })
          .catch((error) => {
            message.error('登陆失败', 3);
            this.props.form.resetFields(['password'])
          })

      }
      //有错误，浏览器自动提示
    })
  };


  render(){
    //提取一个方法进行表单验证
    //表单里面默认有三个属性：history，location，match
    const { getFieldDecorator } = this.props.form;
    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目：后台管理系统</h1>
      </header>
      <section className="login-from">
        <h2>用户登录</h2>
        <Form onSubmit={this.login}>
          <Item>
            {
              getFieldDecorator(
                'username',
                {
                  rules: [
                    {validator: this.validator}
                  ]
                }
              )(
                <Input prefix={<Icon type="user" />} placeholder="用户名"/>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator(
                'password',
                {
                  rules: [
                    {validator: this.validator}
                  ]
                }
              )(
                <Input prefix={<Icon type="lock"  />} type="password" placeholder="密码"/>
              )
            }
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
          </Item>

        </Form>
      </section>
    </div>
  }
}

//使用高阶组件，让login有form属性，可以进行表单校验
//高阶组件，调用返回一个新组件
export default Form.create()(Login);