import React, { Component } from 'react';
import { Form, Input, message, Modal, Select, Row, Col, InputNumber } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

const urgenType = ['常规', '紧急'];

@connect(({ ipapply, user }) => ({
  ipapply,
  currentUser: user.currentUser,
}))
@Form.create()
export default class IPApplyForm extends Component {
  handleCancel = () => {
    this.props.dispatch({
      type: 'ipapply/changeVisible',
    });
  };

  handleOk = e => {
    const {
      dispatch,
      form,
      currentUser,
      ipapply: { formData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'ipapply/addPurchase',
          payload: {
            type: '1',
            applicantId: currentUser.id,
            itemId: formData.id,
            itemNum: values.itemNum,
            urgency: values.urgency,
          },
        }).then(data => {
          if (data && data.code) {
            message.success('采购申请成功');
            this.handleCancel();
          } else {
            message.error('采购申请失败');
          }
        });
      }
    });
  };

  render() {
    const {
      ipapply: { formData, visible },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    const textAreaLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    return (
      <Modal
        title="仪器信息"
        visible={visible}
        destroyOnClose={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={700}
      >
        <Form style={{ marginTop: 8 }}>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="编码">
                {getFieldDecorator('code', {
                  initialValue: formData.code,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                  initialValue: formData.name,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="当前数量">
                {getFieldDecorator('number', {
                  initialValue: formData.number,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="阈值">
                {getFieldDecorator('threshold', {
                  initialValue: formData.threshold,
                })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="采购数量">
                {getFieldDecorator('itemNum', {
                  rules: [
                    {
                      required: true,
                      message: '请输入采购数量',
                    },
                  ],
                })(<InputNumber placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="紧急度">
                {getFieldDecorator('urgency', {
                  rules: [
                    {
                      required: true,
                      message: '请选择紧急度',
                    },
                  ],
                })(
                  <Select placeholder="请选择" style={{ maxWidth: 220 }}>
                    {urgenType.map((value, index) => (
                      <Option key={index} value={index}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
