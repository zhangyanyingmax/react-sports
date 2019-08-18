import React,{ Component, Fragment } from 'react';
import { Card, Form, Input, Button, InputNumber, Icon, Cascader, message} from 'antd';
import { reqGetCategories} from '../../../api';

import './index.less';

const {Item} = Form;

class SaveUpdate extends Component{

  state = {
    options: []
  };

  submit =(e) => {
    e.preventDefault();
    this.props.history.replace('/product/index')
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


  render(){
    /*const options = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ];*/
    const { getFieldDecorator} = this.props.form;

    const { options} = this.state;

    return <Card title={<Fragment>
      <Icon type="arrow-left" /> 添加商品
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
        <Item label="商品详情">

        </Item>
        <Button className="saveUpdate-btn" type="primary" htmlType="submit">提交</Button>
      </Form>
    </Card>
  }
}

//需要表单校验，
export default Form.create()(SaveUpdate);