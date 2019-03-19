import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select, DatePicker } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const stateType = ['申请中', '待领取', '待归还', '已完成', '未通过', '已撤销'];

@connect(({ order }) => ({
  order,
}))
@Form.create()
export default class SelfListSearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'order/changeSearchFormFields',
          payload: {
            state: values.state,
            orderDate: values.orderDate
              ? [values.orderDate[0].format('YYYY-MM-DD'), values.orderDate[1].format('YYYY-MM-DD')]
              : [],
            submitTime: values.submitTime
              ? [
                  values.submitTime[0].format('YYYY-MM-DD'),
                  values.submitTime[1].format('YYYY-MM-DD'),
                ]
              : [],
          },
        });
        this.doPageSearch();
      }
    });
  };

  handleReset = e => {
    const { form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      key === 'state' ? (obj[key] = []) : (obj[key] = '');
      form.setFieldsValue(obj);
    });
    this.handleSubmit(e);
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'order/fetch',
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} style={{ marginBottom: 15 }}>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择" style={{ width: 150 }}>
                  {stateType.map((value, index) => {
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
          <Col md={9} sm={24}>
            <FormItem label="使用日期">
              {getFieldDecorator('orderDate')(<RangePicker style={{ width: 270 }} />)}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="申请日期">
              {getFieldDecorator('submitTime')(<RangePicker style={{ width: 270 }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col style={{ float: 'left' }}>
            <Button type="dashed" onClick={() => this.doPageSearch()}>
              刷新
            </Button>
          </Col>
          <Col style={{ float: 'right' }}>
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
