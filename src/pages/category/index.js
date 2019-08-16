import React,{ Component } from 'react';
import { Card, Table, Button, Icon, Modal, message} from 'antd';
import AddCategories from './addCategories';
import { reqGetCategories, reqAddCategory} from '../../api';

import './index.less';

export default class Category extends Component{

  //初始化state
  state = {
    categories: [],
    isShowAddCategories: false
  };

  addCategoriesRef = React.createRef();

  //请求以及分类数据
  componentDidMount(){
    reqGetCategories(0)
      .then((res) => {
        //请求成功，更新数据状态
        this.setState({
          categories: res
        })
      })
      .catch((error) => {
        message.success(error)
      })
  }

  showAddCategories =() => {
    this.setState({
      isShowAddCategories: true
    })
  };

  addCategories =() => {
    //添加的操作在addCategories组件，但是更新数据在父组件
    //获取子组件的form属性，使用ref
    console.log(this.addCategoriesRef.current);//值为一个对象，具有form属性的各种方法
    this.addCategoriesRef.current.validateFields((error,values) => {
      if (!error){
        //表单验证通过，发送请求
        const { categoryName,parentId } = values;
        reqAddCategory(categoryName,parentId)
          .then((res) => {
            //请求成功，更新数据
            this.setState({
              categories: [...this.state.categories,res]
            });
            message.success('添加分类成功')
          })
          .catch((error) => {
            message.error(error)
          })
          .finally(() => {
            //最后，不管成功失败都清空表单，隐藏弹框
            this.setState({
              isShowAddCategories: false
            });
            this.addCategoriesRef.current.resetFields()
          })
      }
    });



  };

  cancel =() => {
    this.setState({
      isShowAddCategories: false
    })
  };

  render(){
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
        // render: text => <a>{text}</a>,
      },
      {
        title: '操作',
        className: 'column-operation',
        dataIndex: 'operation',
        render: () => <div>
          <Button type="link">修改品类名称</Button>
          <Button type="link">查看其子品类</Button>
        </div>
      },
    ];

   /* const data = [
      {
        key: '1',
        name: '手机1',
      },
      {
        key: '2',
        name: '手机2',
      },
      {
        key: '3',
        name: '手机3',
      },
      {
        key: '4',
        name: '手机4',
      },
      {
        key: '5',
        name: '手机5',
      }

    ];*/
   const {categories} = this.state;

    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.showAddCategories}><Icon type="plus"/>添加分类</Button>}>
      <Table
        columns={columns}
        dataSource={categories}
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3','6','9','12'],
          defaultPageSize: 3
        }}
        rowKey="_id"
      />
      <Modal
        title="添加分类"
        visible={this.state.isShowAddCategories}
        onOk={this.addCategories}
        onCancel={this.cancel}
        okText="确认"
        cancelText="取消"
      >
        <AddCategories categories={categories} ref={this.addCategoriesRef} />
      </Modal>

    </Card>
  }
}