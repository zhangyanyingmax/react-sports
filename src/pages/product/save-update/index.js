import React,{ Component, Fragment } from 'react';
import { Card, Form, Input, Button, InputNumber, Icon, Cascader, message} from 'antd';
import { reqGetCategories, reqAddProduct} from '../../../api';
import RichTextEditor from './rich-text-editor';

import './index.less';

const {Item} = Form;

class SaveUpdate extends Component{

  state = {
    options: []
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
    this.props.form.validateFields((error,values) => {
      console.log(error, values);
      const { name, desc, id, price, detail} = values;
      let pCategoryId, categoryId;
      if (id.length === 1){
        pCategoryId = 0;
        categoryId = id[0];
      } else {
        pCategoryId = id[0];
        categoryId = id[1];
      }
      if (!error){
        reqAddProduct({name, desc, pCategoryId, categoryId, price, detail})
          .then((res) => {
            message.success('添加商品成功',3);
            //跳转到index
            this.props.history.replace('/product/index');
          })
          .catch((error) => {
            message.error(error,3)
          })
      }
    })
  };


  //请求以及分类列表
  componentDidMount(){
    reqGetCategories(0)
      .then((res) => {
        this.setState({
          options: res.map((category) => {
            return {
              label: category.name,
              value: category._id,
              isLeaf: false
            }
          })
        })
      })
      .catch((error) => {
        message.error(error,3)
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

    const { getFieldDecorator} = this.props.form;

    const { options} = this.state;

    return <Card title={<Fragment>
      <Icon onClick={this.goback} type="arrow-left" /> 添加商品
    </Fragment>}>
      <Form  labelCol={{span:3}} wrapperCol={{span:8}} onSubmit={this.submit}>
        <Item label="商品名称">
          {getFieldDecorator(
            'name',
            {
              rules: [
                {required: true,message: '输入内容不能为空'}
              ]
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
                {required: true,message: '输入内容不能为空'}
              ]
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
                {required: true,message: '输入内容不能为空'}
              ]
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
              initialValue: '1000',
              rules: [
                {required: true,message: '输入内容不能为空'}
              ]
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
                {required: true,message: '输入内容不能为空'}
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