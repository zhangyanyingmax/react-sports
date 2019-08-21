import React,{ Component, Fragment } from 'react';
import { Card, Table, Button, Icon, Modal, message} from 'antd';
import AddCategories from './addCategories';
import UpdateCategoryName from './updateCategoryName';
import { reqGetCategories, reqAddCategory, reqUpdateCategoryName} from '../../api';

import './index.less';

export default class Category extends Component{

  //初始化state
  state = {
    categories: [],
    category: {},
    subCategories: [],
    subCategory: {},
    isShowAddCategories: false,
    isShowUpdateCategoryName: false,
    isShowSubCategory: false
  };

  addCategoriesRef = React.createRef();
  updateCategoryNameRef = React.createRef();

  //分类列数据
  columns = [
    {
      title: '品类名称',
      dataIndex: 'name',
      // render: text => <a>{text}</a>,
    },
    {
      title: '操作',
      className: 'column-operation',
      // dataIndex: 'operation',
      render: (category) => <div>
        <Button type="link" onClick={this.showUpdateCategoryName(category)}>修改品类名称</Button>
        {
          this.state.isShowSubCategory ? '' : <Button type="link" onClick={this.showSubcategory(category)}>查看其子品类</Button>
        }
      </div>
    },
  ];

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
        message.error(error)
      })
  }

  showAddCategories =() => {
    this.setState({
      isShowAddCategories: true
    })
  };

  showUpdateCategoryName =(category) => {
    return () => {
      const key = category.parentId === 0 ? 'category' : 'subCategory';
      this.setState({
        isShowUpdateCategoryName: true,
        [key] : category
      })
    }
  };
  //添加分类名称
  addCategories =() => {
    //添加的操作在addCategories组件，但是更新数据在父组件
    //获取子组件的form属性，使用ref
    // console.log(this.addCategoriesRef.current);//值为一个对象，具有form属性的各种方法
    this.addCategoriesRef.current.validateFields((error,values) => {
      if (!error){
        //表单验证通过，发送请求
        const { categoryName,parentId } = values;
        reqAddCategory(categoryName,parentId)
          .then((res) => {
            message.success('添加分类成功')
            //请求成功，更新数据
            const key = +parentId !== 0 ? 'subCategories' : 'categories';
            const { isShowSubCategory, category} = this.state;
            //判断是否是在同一个二级分类
            if (isShowSubCategory && parentId !== category._id){
              return
            }
            this.setState({
              [key]: [...this.state[key],res]
            });

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
  //更新分类名称
  updateCategory = () => {
    // console.log(1);
    // console.log(this.updateCategoryNameRef)
    //首先验证，
    this.updateCategoryNameRef.current.validateFields((error,values) => {
      if (!error){
        const {categoryName} = values;
        const { isShowSubCategory} = this.state;
        const key = isShowSubCategory? 'subCategory' : 'category';
        const categoryId = this.state[key]._id;
        // console.log(values);
        reqUpdateCategoryName(categoryName,categoryId)
          .then((res) => {
            //请求成功，更新名称
            message.success('修改名称成功',3);
            const key = this.state.isShowSubCategory ? 'subCategories' : 'categories';
            this.setState({
              [key]: this.state[key].map((category) => {
                if (category._id === categoryId){
                  category.name = categoryName
                }
                // console.log(category);
                return category;

              })
            })

          })
          .catch((error) => {
            message.error(error,3);
          })
          .finally(() => {
            this.setState({
              isShowUpdateCategoryName: false
            });
            this.updateCategoryNameRef.current.resetFields()
          })
      }
    })
  };

  cancel =(key) => {
    return () => {
      this.setState({
        [key]: false
      });
      if (key === 'isShowAddCategories') {
        this.addCategoriesRef.current.resetFields()
      }else {
        this.updateCategoryNameRef.current.resetFields()
      }
    }
  };

  //查看子品类
  showSubcategory = (category) => {
    return () => {
      //请求二级分类，参数传id，一级分类id为0，二级分类id为category._id
      reqGetCategories(category._id)
        .then((res) => {
          message.success('请求二级分类成功',3);
          this.setState({
            //更新状态
            subCategories: res,
            isShowSubCategory: true,
            category
          })
        })
        .catch((error) => {
          message.error(error,3)
        })

    }


  };

  goback = () => {
    this.setState({
      isShowSubCategory: false
    })
  };




  render(){


   const {categories, category, subCategory, subCategories, isShowAddCategories, isShowUpdateCategoryName, isShowSubCategory} = this.state;

    return <Card title={isShowSubCategory ? <Fragment>
      <Button type="link" onClick={this.goback}>一级分类</Button> <Icon type="arrow-right" /> <span>{category.name}</span>
    </Fragment> : "一级分类列表"} extra={<Button type="primary" onClick={this.showAddCategories}><Icon type="plus"/>添加分类</Button>}>
      <Table
        columns={this.columns}
        dataSource={isShowSubCategory? subCategories : categories}
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3','6','9','12'],
          defaultPageSize: 3,
        }}
        rowKey="_id"
      />
      <Modal
        title="添加分类"
        visible={isShowAddCategories}
        onOk={this.addCategories}
        onCancel={this.cancel('isShowAddCategories')}
        okText="确认"
        cancelText="取消"
      >
        <AddCategories categories={categories} ref={this.addCategoriesRef} />
      </Modal>
      <Modal
        title="修改名称"
        visible={isShowUpdateCategoryName}
        onOk={this.updateCategory}
        onCancel={this.cancel('isShowUpdateCategoryName')}
        okText="确认"
        cancelText="取消"
        width={300}
      >
        <UpdateCategoryName category={isShowSubCategory? subCategory : category} ref={this.updateCategoryNameRef}/>
      </Modal>

    </Card>
  }
}