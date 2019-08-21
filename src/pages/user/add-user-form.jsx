import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;

class AddUserForm extends Component {

  static propTypes = {
    roles: PropTypes.array.isRequired
  };


  render () {
    const { form: { getFieldDecorator }, roles } = this.props;
    
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',
              {
                rules: [
                  {required: true, message: '请输入内容'}
                ]
              }
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'password',
              {
                rules: [
                  {required: true, message: '请输入内容'}
                ]
              }
            )(
              <Input placeholder='请输入密码' type='password'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',
              {
                rules: [
                  {required: true, message: '请输入内容'}
                ]
              }
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',
              {
                rules: [
                  {required: true, message: '请输入内容'}
                ]
              }
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',
              {
                rules: [
                  {required: true, message: '请输入内容'}
                ]
              }
            )(
              <Select placeholder='请选择分类'>
                {
                  roles.map((role) => {
                    return <Option key={role._id} value={role._id}>{role.name}</Option>
                  })
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUserForm);