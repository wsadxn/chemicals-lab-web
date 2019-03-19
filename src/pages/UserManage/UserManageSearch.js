import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ user }) => ({
  user,
}))
@Form.create()
export default class UserManageSearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/changeSearchFormFields',
          payload: values,
        });
        this.doPageSearch();
      }
    });
  };

  handleReset = e => {
    const { form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      key === 'identity' ? (obj[key] = []) : (obj[key] = '');
      form.setFieldsValue(obj);
    });
    this.handleSubmit(e);
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'user/fetch',
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col md={7} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('id')(<Input style={{ width: 200 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input style={{ width: 200 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="权限">
              {getFieldDecorator('identity')(
                <Select placeholder="请选择" style={{ width: 140 }}>
                  <Option value="0">学生</Option>
                  <Option value="1">教师</Option>
                  <Option value="2">管理员</Option>
                  <Option value="3">主管</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col style={{ float: 'right', marginTop: 4 }}>
            <Button type="primary" onClick={this.handleSubmit}>
              查询
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
