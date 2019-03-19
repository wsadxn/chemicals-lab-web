import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const stateType = ['未读', '已读'];
const type = [
  '物品申请',
  '申请撤销',
  '申请审核',
  '领取物品',
  '归还入库',
  '采购申请',
  '采购撤销',
  '采购审核',
  '采购成功',
  '权限修改',
];

@connect(({ notice }) => ({
  notice,
}))
@Form.create()
export default class NoticeSearch extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'notice/changeSearchFormFields',
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
      type: 'notice/fetch',
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row style={{ marginBottom: 15 }}>
          <Col md={7} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: 200 }}>
                  {type.map((value, index) => (
                    <Option value={index} key={index}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择" style={{ width: 200 }}>
                  {stateType.map((value, index) => (
                    <Option value={index} key={index}>
                      {value}
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
            <Button style={{ marginLeft: 5 }} onClick={this.handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
