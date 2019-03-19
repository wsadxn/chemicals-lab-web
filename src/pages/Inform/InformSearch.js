import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ inform, user }) => ({
  inform,
  userSd: user.userSd,
}))
@Form.create()
export default class InformSearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'inform/changeSearchFormFields',
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
      key === 'author' ? (obj[key] = []) : (obj[key] = '');
      form.setFieldsValue(obj);
    });
    this.handleSubmit(e);
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'inform/fetch',
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      userSd,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col md={7} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(<Input style={{ width: 200 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="发布人">
              {getFieldDecorator('author')(
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: 200 }}
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
