import React, { Component } from 'react';
import { Card, Button, Table, Radio, Modal, message } from 'antd';
import dayjs from 'dayjs';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import { reqGetRole, reqAddRole, reqUpdateRole} from '../../api';

const RadioGroup = Radio.Group;

export default class Role extends Component {
  state = {
    value: '',  //单选的默认值，也就是选中的某个角色的id值
    roles: [], //权限数组
    isShowAddRoleModal: false, //是否展示创建角色的标识
    isShowUpdateRoleModal: false, //是否展示设置角色的标识
    isDisabled: true
  };

  addRoleFormRef = React.createRef();
  updateRoleFormRef = React.createRef();

  columns = [
      {
      dataIndex: '_id',
      render: id => <Radio value={id} />
    }, {
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      render: (time)=> dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }, {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: (time)=> time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
    }, {
      title: '授权人',
      dataIndex: 'auth_name',
    }
  ];

  //一上来请求角色列表
  componentDidMount(){
    reqGetRole()
      .then((res) => {
        // console.log(res);
        message.success('创建角色成功',3);
        this.setState({
          roles: res,
        })
      })
      .catch((error) => {
        message.error('创建角色失败',3)
      })
  };


  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
      isDisabled: false
    });
  };
  
  switchModal = (key, value) => {
    return () => {
      this.setState({[key]: value})
    }
  };
  
  //创建角色的回调函数
  addRole = () => {
    //首先表单校验，校验成功发送请求
    this.addRoleFormRef.current.validateFields((error, values) => {
      if (!error){
        const { name } = values;
        reqAddRole(name)
          .then((res) => {
            console.log(res);
            message.success('创建角色成功',3);
            this.setState({
              roles: [...this.state.roles,res]
            })
          })
          .catch((error) => {
            message.error('创建角色失败',3)
          })
          .finally(() => {
            this.setState({
              isShowAddRoleModal: false
            });
            this.addRoleFormRef.current.resetFields()
          })
      }
    })
  };
  //设置角色权限的回调函数
  updateRole = () => {
  //首先先表单校验，成功发送请求
    this.updateRoleFormRef.current.validateFields((error,values) => {
      if (!error){
        console.log(values);
        const { auth_name, menus} = values;
        const _id = this.state.value;
        reqUpdateRole({auth_name,menus,_id})
          .then((res) => {
            console.log(res);
            message.success('设置权限成功',3);
            this.setState({
              roles: this.state.roles.map((role) => {
                if (role._id === _id){
                  return res
                }
                return role
              })
            })
          })
          .catch((error) => {
            console.log(error);
            message.error('设置权限失败',3)
          })
          .finally(() => {
            this.setState({
              isShowUpdateRoleModal: false
            });
            this.updateRoleFormRef.current.resetFields()
          })


      }
    })
  };
  
  render () {
    const { roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal } = this.state;

    //设置权限角色时，找到选中的角色，
    const role = roles.find((role) => role._id === value );
    const name = role ? role.name : '';
    
    return (
      <Card
        title={
          <div>
            <Button type='primary' onClick={this.switchModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled} onClick={this.switchModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </div>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>
  
        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.switchModal('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm ref={this.addRoleFormRef}/>
        </Modal>
  
        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.updateRole}
          onCancel={this.switchModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm ref={this.updateRoleFormRef} name={name}/>
        </Modal>
        
      </Card>
    )
  }
}
