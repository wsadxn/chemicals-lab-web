import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const urgenType = ['常规', '紧急'];

@connect(({ cplist, user, chemicals }) => ({
  cplist,
  userSd: user.userSd,
  chemicalSd: chemicals.chemicalSd,
}))
@Form.create()
export default class CPListSearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'cplist/changeSearchFormFields',
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
      obj[key] = [];
      form.setFieldsValue(obj);
    });
    this.handleSubmit(e);
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'cplist/fetch',
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      userSd,
      chemicalSd,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={7} sm={24}>
            <FormItem label="药品名称">
              {getFieldDecorator('itemId')(
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: 170 }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {Object.keys(chemicalSd).map(value => (
                    <Option value={value} key={value}>
                      {chemicalSd[value]}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="申请人">
              {getFieldDecorator('applicantId')(
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: 170 }}
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
          <Col md={6} sm={24}>
            <FormItem label="紧急度">
              {getFieldDecorator('urgency')(
                <Select placeholder="请选择" style={{ width: 140 }}>
                  {urgenType.map((value, index) => {
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
