import React, { Component } from 'react';
import { Form, Input, message, Modal, Select, Row, Col, Divider, InputNumber } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ order, chemicals, instrument, user }) => ({
  order,
  userSd: user.userSd,
  chemicalSd: chemicals.chemicalSd,
  instrumentSd: instrument.instrumentSd,
}))
@Form.create()
export default class OrderListForm extends Component {
  handleCancel = () => {
    this.props.dispatch({
      type: 'order/changeListVisible',
    });
  };

  handleStorage = e => {
    const {
      dispatch,
      form,
      order: { listFormData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'order/update',
          payload: {
            record: {
              ...listFormData.record,
              storageId: listFormData.currentUser,
              backNum: {
                chemicals: values.chemicalsNum ? values.chemicalsNum : [],
                instrument: values.instrumentNum ? values.instrumentNum : [],
              },
              state: '3',
            },
            password: values.password,
            operation: 'storage',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('入库登记成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'order/fetch',
            });
          } else {
            message.error('入库登记失败');
          }
        });
      }
    });
  };

  handleAdopt = e => {
    const {
      dispatch,
      form,
      order: { listFormData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'order/update',
          payload: {
            record: {
              ...listFormData.record,
              adoptId: listFormData.currentUser,
              state: values.state,
            },
            operation: 'adopt',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('审核成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'order/fetch',
            });
          } else {
            message.error('审核失败');
          }
        });
      }
    });
  };

  handleReceive = e => {
    const {
      dispatch,
      form,
      order: { listFormData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'order/update',
          payload: {
            record: {
              ...listFormData.record,
              state: '2',
            },
            password: values.password,
            operation: 'receive',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('领取登记成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'order/fetch',
            });
          } else {
            message.error('领取登记失败');
          }
        });
      }
    });
  };

  render() {
    const {
      userSd,
      chemicalSd,
      instrumentSd,
      order: { listFormData, listVisible },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      style: { marginBottom: -5 },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    if (listFormData.operation === 'storage') {
      return (
        <Modal
          title="入库登记"
          visible={listVisible}
          destroyOnClose={true}
          onOk={this.handleStorage}
          onCancel={this.handleCancel}
          width={700}
        >
          <Form style={{ marginTop: 8 }}>
            {listFormData.record.itemsId &&
              listFormData.record.itemsId.chemicals.map((value, index) => {
                return (
                  <span>
                    {index === 0 && <Divider orientation="left">所借药品信息</Divider>}
                    <Row>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="药品名称">
                          {chemicalSd[value]}
                        </FormItem>
                      </Col>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="入库数量">
                          {getFieldDecorator(`chemicalsNum[${index}]`, {
                            rules: [
                              {
                                required: true,
                                message: '请输入入库数量',
                              },
                            ],
                          })(<InputNumber placeholder="请输入" />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </span>
                );
              })}
            {listFormData.record.itemsId &&
              listFormData.record.itemsId.instrument.map((value, index) => {
                return (
                  <span>
                    {index === 0 && <Divider orientation="left">所借仪器信息</Divider>}
                    <Row>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="仪器名称">
                          {instrumentSd[value]}
                        </FormItem>
                      </Col>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="入库数量">
                          {getFieldDecorator(`instrumentNum[${index}]`, {
                            rules: [
                              {
                                required: true,
                                message: '请输入入库数量',
                              },
                            ],
                          })(<InputNumber placeholder="请输入" />)}
                        </FormItem>
                      </Col>
                    </Row>
                  </span>
                );
              })}
            <Divider orientation="left">确认并填写</Divider>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="申请人">
                  {userSd[listFormData.record.applicantId]}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="验证密码">
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(<Input type="password" placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    } else if (listFormData.operation === 'adopt') {
      return (
        <Modal
          title="申请审核"
          visible={listVisible}
          destroyOnClose={true}
          onOk={this.handleAdopt}
          onCancel={this.handleCancel}
          width={700}
        >
          <Form style={{ marginTop: 8 }}>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="审核结果">
                  {getFieldDecorator('state', {
                    rules: [
                      {
                        required: true,
                        message: '请选择审核结果',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" style={{ width: 170 }}>
                      <Option value="4" key="4">
                        不通过
                      </Option>
                      <Option value="1" key="1">
                        通过
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    } else if (listFormData.operation === 'receive') {
      return (
        <Modal
          title="物品领取"
          visible={listVisible}
          destroyOnClose={true}
          onOk={this.handleReceive}
          onCancel={this.handleCancel}
          width={700}
        >
          <Form>
            {listFormData.record.itemsId &&
              listFormData.record.itemsId.chemicals.map((value, index) => {
                const orderNum = listFormData.record.itemsNum.chemicals[index];
                return (
                  <span>
                    {index === 0 && <Divider orientation="left">所借药品信息</Divider>}
                    <Row>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="药品名称">
                          {chemicalSd[value]}
                        </FormItem>
                      </Col>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="申请数量">
                          {orderNum}
                        </FormItem>
                      </Col>
                    </Row>
                  </span>
                );
              })}
            {listFormData.record.itemsId &&
              listFormData.record.itemsId.instrument.map((value, index) => {
                const orderNum = listFormData.record.itemsNum.instrument[index];
                return (
                  <span>
                    {index === 0 && <Divider orientation="left">所借仪器信息</Divider>}
                    <Row>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="仪器名称">
                          {instrumentSd[value]}
                        </FormItem>
                      </Col>
                      <Col md={12} sm={24}>
                        <FormItem {...formItemLayout} label="申请数量">
                          {orderNum}
                        </FormItem>
                      </Col>
                    </Row>
                  </span>
                );
              })}
            <Divider orientation="left">确认并填写</Divider>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="申请人">
                  {userSd[listFormData.record.applicantId]}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="验证密码">
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(<Input type="password" placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    } else {
      return <Modal visible={false} />;
    }
  }
}
