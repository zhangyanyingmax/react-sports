import React,{ Component, Fragment } from 'react';
import { withRouter} from 'react-router-dom';
import { Card, Select, Input, Button, Icon, Table, message} from 'antd';
import { reqGetProduct } from '../../../api';
import './index.less';

const { Option } = Select;

class Index extends Component{

  //初始化状态
  state = {
    product: [],
    total: 0
  };

  //分类列数据
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      // render: text => <a>{text}</a>,
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      // render: text => <a>{text}</a>,
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: text => `￥${text}`,
    },
    {
      title: '状态',
      render: (product) => {
        return <Fragment>
          <Button type="primary">上架</Button>
          &nbsp;&nbsp;&nbsp;已下架
        </Fragment>
      }
    },
    {
      title: '状态',
      render: (product) => {
        return <Fragment>
          <Button type="link">详情</Button>
          <Button type="link">修改</Button>
        </Fragment>
      }
    }

  ];

  //获取商品列表
  getProduct = (pageNum, pageSize) => {
    reqGetProduct(pageNum,pageSize)
      .then((res) => {
        this.setState({
          product: res.list,
          total: res.total
        })
      })
      .catch((error) => {
        message.error(error,3)
      })
  };

  componentDidMount() {
    this.getProduct(1,3)
  };

  addProduct = () => {
    this.props.history.push('/product/saveupdate');
  };


  render(){
    const {product, total} = this.state;
    return <Card title={<Fragment> <Select value="1">
      <Option key="1" value="1">根据商品名称</Option>
      <Option key="2" value="2">根据商品描述</Option>
    </Select>
      <Input placeholder="关键字" className="product-btn"/>
      <Button type="primary"> 搜索</Button>
    </Fragment>} extra={<Button type="primary" onClick={this.addProduct}> <Icon type="plus" /> 添加产品</Button>}>
      <Table
        columns={this.columns}
        dataSource={product}
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3','6','9','12'],
          defaultPageSize: 3,
          total,
          onChange: this.getProduct
        }}
        rowKey="_id"
      />
    </Card>
  }
}

//让组件拥有三大属性
export default withRouter(Index);
