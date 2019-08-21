import React,{ Component, Fragment } from 'react';
import { Card, Select, Input, Button, Icon, Table, message} from 'antd';
import {reqGetCategories, reqGetProduct, reqSearchProduct} from '../../../api';
import './index.less';

const { Option } = Select;

export default class Index extends Component{

  //初始化状态
  state = {
    product: [],
    total: 0,
    searchKey: 'productName',
    searchValue: '',
    pageSize: 3,
    pageNum: 1,
    isSearch: false
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
          <Button type="link" onClick={this.goProductDetail(product)}>详情</Button>
          <Button type="link" onClick={this.goUpdateProduct(product)}>修改</Button>
        </Fragment>
      }
    }

  ];

  goProductDetail = (product) => {
    return () => {
      let state = { product };
      if (product.pCategoryId !== '0'){
        reqGetCategories(0)
          .then((data) => {
            console.log(data);
            const {name} = data.find((item) => item._id === product.pCategoryId );
            state.pName = name;
            this.props.history.push('/product/detail', state)
          })
          .catch(() => {
            message.error('访问失败', 3)
          })
      }
    }
  };

  goUpdateProduct = (product) => {
    return () => {
      this.props.history.push('/product/saveupdate', product)//需要将产品传过去才会有数据
      this.setState({

      })
    }
  };

  //获取商品列表
  getProduct = (pageNum, pageSize) => {
    const { searchValue, isSearch } = this.state;
    if (isSearch && searchValue){
      this.setState({
        pageNum,
        pageSize
      },() => {
        this.search()
      })
    } else {
      reqGetProduct(pageNum,pageSize)
        .then((res) => {
          this.setState({
            product: res.list,
            total: res.total,
            pageNum,
            pageSize
          })
        })
        .catch((error) => {
          message.error(error,3)
        })
    }
  };

  componentDidMount() {
    this.getProduct(1,3)
  };

  addProduct = () => {
    this.props.history.push('/product/saveupdate');
  };

  //受控组件获取表单的值
  handelChange = (key) => {
    return (e) => {
      // console.log(e.target.value);
      this.setState({
        [key]: typeof e === 'string' ? e : e.target.value
      })
    }
  };

  //初始化searchValue的值
  searchValue = '';

  search = (e) => {
    let { pageNum, pageSize, searchKey, searchValue} = this.state;
    console.log(pageNum, pageSize);
    //检测是否点击搜索按钮去搜索
    pageNum = typeof e === 'object' ? 1 : pageNum;


    if (typeof e === 'object'){
      this.searchValue = searchValue
    }
    reqSearchProduct({
      [searchKey] : this.searchValue,
      pageSize,
      pageNum
    })
      .then((res) => {
        message.success('搜搜成功',3);
        // console.log(res);
        this.setState({
          product: res.list,
          total: res.total,
          pageSize,
          pageNum,
          isSearch: true
        })
      })
      .catch((error) => {
        message.error('搜索失败',3)
      })


  };


  render(){
    const {product, total, pageSize, pageNum} = this.state;
    return <Card title={<Fragment>
      <Select defaultValue="productName" onChange={this.handelChange('searchKey')}>
        <Option key="1" value="productName">根据商品名称</Option>
        <Option key="2" value="productDesc">根据商品描述</Option>
      </Select>
        <Input placeholder="关键字" className="product-btn" onChange={this.handelChange('searchValue')}/>
        <Button type="primary" onClick={this.search}> 搜索</Button>
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
            onChange: this.getProduct,
            onShowSizeChange: this.getProduct,
            pageSize,
            current: pageNum
          }}
          rowKey="_id"
        />
    </Card>
  }
}

