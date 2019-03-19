import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const type = [
  '库存紧张',
  '库存较少',
  '库存充足',
];

@connect(({ ipapply }) => ({
  ipapply,
}))
@Form.create()
export default class IPApplySearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'ipapply/changeSearchFormFields',
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
      key === 'status' ? (obj[key] = []) : (obj[key] = '');
      form.setFieldsValue(obj);
    });
    this.handleSubmit(e);
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'ipapply/fetch',
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
            <FormItem label="仪器名称">
              {getFieldDecorator('name')(<Input style={{ width: 170 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="仪器编号">
              {getFieldDecorator('code')(<Input style={{ width: 170 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="库存状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: 140 }}>
                  {type.map((value, index) => {
                    return (
                      <Option value={index} key={index}>
                        {value}
                      </Option>
                    );
                  })}
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
