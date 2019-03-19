import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const chemType = [
  '爆炸品',
  '压缩气体和液化气体',
  '易燃品',
  '氧化剂',
  '有毒物品',
  '放射性物品',
  '腐蚀品',
  '其它',
];

@connect(({ chemicals }) => ({
  chemicals,
}))
@Form.create()
export default class ChemicalsSearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'chemicals/changeSearchFormFields',
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
      key === 'type' ? (obj[key] = []) : (obj[key] = '');
      form.setFieldsValue(obj);
    });
    this.handleSubmit(e);
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'chemicals/fetch',
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
            <FormItem label="药品名称">
              {getFieldDecorator('name')(<Input style={{ width: 160 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="药品编号">
              {getFieldDecorator('code')(<Input style={{ width: 160 }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="药品分类">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: 120 }}>
                  {chemType.map((value, index) => {
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
