import React,{ Component } from 'react';
import { Form, Input, Select} from 'antd';
import PropTypes from 'prop-types';

const { Item } = Form;

class UpdateCategoryName extends Component{
  static propTypes = {
    category: PropTypes.object.isRequired
  };

  validator = (rule,value,callback) => {
    // console.log(value)
    if (!value){
      callback('请输入修改名称')
    } else if (value === this.props.category.name){//验证错误，
      callback('修改的名称不能相同')
    } else{
      callback()
    }
};

  render(){
    const { form:{ getFieldDecorator}, category:{name} } = this.props;
    return <Form>
      <Item>
        {
          getFieldDecorator(
            'categoryName',
            {
              initialValue: name,
              rules: [{
                validator: this.validator
              }]
            }
          )(
            <Input />
          )
        }
      </Item>
    </Form>
  }
}

//需要对表单进行校验，需要表单具有form属性
export default Form.create()(UpdateCategoryName);