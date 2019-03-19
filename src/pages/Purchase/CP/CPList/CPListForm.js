import React, { Component } from 'react';
import { Form, Input, message, Modal, Select, Row, Col, InputNumber } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const urgenType = ['常规', '紧急'];

@connect(({ cplist, chemicals }) => ({
  cplist,
  chemicalSd: chemicals.chemicalSd,
}))
@Form.create()
export default class CPListForm extends Component {
  handleCancel = () => {
    this.props.dispatch({
      type: 'cplist/changeVisible',
    });
  };

  handleStorage = e => {
    const {
      dispatch,
      form,
      cplist: { formData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'cplist/update',
          payload: {
            id: formData.id,
            itemId: formData.itemId,
            storageNum: values.storageNum,
            storageId: formData.currentUser,
            type: '0',
            operation: 'storage',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('登记成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'cplist/fetch',
            });
          } else {
            message.error('登记失败');
          }
        });
      }
    });
  };

  handleAdopt = e => {
    const {
      dispatch,
      form,
      cplist: { formData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'cplist/update',
          payload: {
            id: formData.id,
            adoptId: formData.currentUser,
            state: values.state,
            operation: 'adopt',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('审核成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'cplist/fetch',
            });
          } else {
            message.error('审核失败');
          }
        });
      }
    });
  };

  handleModify = e => {
    const {
      dispatch,
      form,
      cplist: { formData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'cplist/update',
          payload: {
            id: formData.id,
            itemNum: values.itemNum,
            urgency: values.urgency,
            operation: 'modify',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('修改成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'cplist/fetch',
            });
          } else {
            message.error('修改失败');
          }
        });
      }
    });
  };

  render() {
    const {
      chemicalSd,
      cplist: { formData, visible },
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

    if (formData.operation === 'storage') {
      return (
        <Modal
          title="入库登记"
          visible={visible}
          destroyOnClose={true}
          onOk={this.handleStorage}
          onCancel={this.handleCancel}
          width={700}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="药品名称">
                  {getFieldDecorator('itemId', {
                    initialValue: chemicalSd[formData.itemId],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="数量">
                  {getFieldDecorator('storageNum', {
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
          </Form>
        </Modal>
      );
    } else if (formData.operation === 'adopt') {
      return (
        <Modal
          title="申请审核"
          visible={visible}
          destroyOnClose={true}
          onOk={this.handleAdopt}
          onCancel={this.handleCancel}
          width={700}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="药品名称">
                  {getFieldDecorator('itemId', {
                    initialValue: chemicalSd[formData.itemId],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
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
                      <Option value="-1" key="-1">
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
    } else if (formData.operation === 'modify') {
      return (
        <Modal
          title="申请修改"
          visible={visible}
          destroyOnClose={true}
          onOk={this.handleModify}
          onCancel={this.handleCancel}
          width={700}
        >
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Col md={12} sm={24}>
                <FormItem {...formItemLayout} label="药品名称">
                  {getFieldDecorator('itemId', {
                    initialValue: chemicalSd[formData.itemId],
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
    } else {
      return <Modal visible={false} />;
    }
  }
}
