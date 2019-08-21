import React,{ Component, Fragment } from 'react';
import { Card, Form, Input, Button, InputNumber, Icon, Cascader, message} from 'antd';
import {reqGetCategories, reqAddProduct, reqUpdateProduct, reqGetProduct} from '../../../api';
import RichTextEditor from './rich-text-editor';

import './index.less';

const {Item} = Form;

class SaveUpdate extends Component{

  state = {
    options: [],
    id: []
  };

  //获取的edidator的值
  onEditorChange = (text) => {
    this.props.form.setFields({
      detail: {
        value: text
      }
    })
  };


  submit =(e) => {
    e.preventDefault();
    //首先进行表单校验，校验成功发送请求
    this.props.form.validateFields(async (error,values) => {
      if (!error){
        // console.log(error, values);
        const { name, desc, id, price, detail} = values;

        let pCategoryId, categoryId;
        if (id.length === 1){
          pCategoryId = 0;
          categoryId = id[0];
        } else {
          pCategoryId = id[0];
          categoryId = id[1];
        }
        let promise;
        const {state} = this.props.location;
        if (state){
          console.log(1);
          promise = reqUpdateProduct({ _id: state._id, name, desc, pCategoryId, categoryId, price, detail})
        } else{
          console.log(2);
          promise = reqAddProduct({name, desc, pCategoryId, categoryId, price, detail})
        }

        promise
          .then((res) => {
            console.log(res);
            message.success('添加商品成功',3);
            //跳转到index
            this.props.history.push('/product/index');
          })
          .catch((error) => {
            message.error(error,3)
          })
      }




        /*reqAddProduct({name, desc, pCategoryId, categoryId, price, detail})
          .then((res) => {
            console.log(res);
            message.success('添加商品成功',3);
            //跳转到index
            this.props.history.replace('/product/index');
          })
          .catch((error) => {
            message.error(error,3)
          })

        //修改商品
        reqUpdateProduct({name, desc, pCategoryId, categoryId, price, detail})
          .then((res) => {
            console.log(res);
            message.success('添加商品成功',3);
            //跳转到index
            this.props.history.replace('/product/index');
          })
          .catch((error) => {
            message.error(error,3)
          })*/

    })
  };

  //请求一级分类列表
  componentDidMount(){
    const promiseArr = [];
    //一上来，请求以及分类
    promiseArr.push(reqGetCategories(0));

    const {state} = this.props.location;
    if (state){
      //判断是修改商品
      if (+state.pCategoryId === 0){
        //判断是一级分类
        this.setState({
          id: [state.categoryId]
        })
      } else{
        //是二级分类，要请求二级分类
        promiseArr.push(reqGetCategories(state.pCategoryId))
      }
    }

    Promise.all(promiseArr)
    .then((res) => {
      const [ categories, subCategories ] = res;
      this.setState({
        options: categories.map((category) => {
          const option = {
            label: category.name,
            value: category._id,
            isLeaf: false
          };
          //判断是否有二级分类
          if (subCategories && (category._id === state.pCategoryId)){
            option.children = subCategories.map((subCategory) => {
              return {
                label: subCategory.name,
                value: subCategory._id,
              }
            })
          }
          return option
        }),
        id: subCategories ? [state.pCategoryId, state.categoryId] : this.state.id
      })
    })
    .catch((error) => {
      message.error('请求数据失败',3)
    })








  };

  loadData = (selectedOptions) => {
    //找到最后一级菜单
    const targetOption = selectedOptions[selectedOptions.length-1];
    //给最后一集菜单添加loading属性
    targetOption.loading = true;

    //发送请求，请求二级分类数据
    reqGetCategories(targetOption.value)
      .then((res) => {
        //首先把loading图标去掉
        targetOption.loading = false;
        if (res.length === 0){
          targetOption.isLeaf = true;
        } else{
          targetOption.children = res.map((category) => {
            return {
              label: category.name,
              value: category._id
            }
          });
        }

        //更新状态，重新渲染组件
        this.setState({
          options: [...this.state.options]
        })

      })
      .catch((error) => {
        message.error(error,3)
      })
  };

  //点击箭头回到上一页
  goback = () => {
    this.props.history.push('/product/index')
  };


  render(){

    const { form: {getFieldDecorator}, location: {state}} = this.props;
    const isUpdateProduct = !!state;//负负得正，取两次反强行转化成布尔值

    const { options, id} = this.state;

    return <Card title={<Fragment>
      <Icon onClick={this.goback} type="arrow-left" /> {isUpdateProduct ? '修改' : '添加'}商品
    </Fragment>}>
      <Form  labelCol={{span:3}} wrapperCol={{span:8}} onSubmit={this.submit}>
        <Item label="商品名称">
          {getFieldDecorator(
            'name',
            {
              rules: [
                {required: true, message: '输入内容不能为空'}
              ],
              initialValue: isUpdateProduct? state.name : ''
            }
          )(
            <Input placeholder="请输入商品名称"/>
          )

          }
        </Item>
        <Item label="商品描述">
          {getFieldDecorator(
            'desc',
            {
              rules: [
                {required: true, message: '输入内容不能为空'}
              ],
              initialValue: isUpdateProduct? state.desc : ''
            }
          )(
            <Input placeholder="请输入商品描述"/>
          )

          }
        </Item>
        <Item label="商品分类">
          {getFieldDecorator(
            'id',
            {
              rules: [
                {required: true, message: '输入内容不能为空'}
              ],
              initialValue: id
            }
          )(
            <Cascader options={options} loadData={this.loadData} placeholder="please select"/>
          )

          }
        </Item>
        <Item label="商品价格">
          {getFieldDecorator(
            'price',
            {
              rules: [
                {required: true, message: '输入内容不能为空'}
              ],
              initialValue: isUpdateProduct? state.price : ''
            }
          )(
            <InputNumber
              /*defaultValue={1000}*/
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
              /*onChange={onChange}*/
            />
          )
          }
        </Item>
        <Item label="商品详情" wrapperCol={{span:20}}>
          {getFieldDecorator(
            'detail',
            {
              rules: [
                {required: true, message: '输入内容不能为空'}
              ]
            }
          )(
            <RichTextEditor onEditorChange={this.onEditorChange} />
          )
          }
        </Item>
        <Button className="saveUpdate-btn" type="primary" htmlType="submit">提交</Button>
      </Form>
    </Card>
  }
}

//需要表单校验，
export default Form.create()(SaveUpdate);