import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select, DatePicker } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ user, order }) => ({
  order,
  userSd: user.userSd,
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
            id: '',
            applicantId: values.applicantId,
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
      key === 'applicantId' ? (obj[key] = []) : (obj[key] = '');
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
      userSd,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row style={{ marginBottom: 15 }}>
          <Col md={4} sm={24}>
            <FormItem label="申请人">
              {getFieldDecorator('applicantId')(
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: 92 }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {Object.keys(userSd).map(value => (
                    <Option value={value} key={value}>
                      {userSd[value]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用日期">
              {getFieldDecorator('orderDate')(<RangePicker style={{ width: 210 }} />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="申请日期">
              {getFieldDecorator('submitTime')(<RangePicker style={{ width: 210 }} />)}
            </FormItem>
          </Col>
          <Col style={{ float: 'right', marginTop: 4 }}>
            <Button type="primary" onClick={this.handleSubmit}>
              查询
            </Button>
            <Button style={{ marginLeft: 5 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
