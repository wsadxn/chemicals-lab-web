import React, { Component } from 'react';
import { Form, Input, message, Modal, Select, Row, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const type = [
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
export default class ChemicalsForm extends Component {

  handleCancel = () => {
    this.props.dispatch({
      type: 'chemicals/changeVisible',
    });
  };

  handleOk = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'chemicals/checkCode',
          payload: values.code,
        }).then(data => {
          if (data && data.code) {
            dispatch({
              type: 'chemicals/update',
              payload: values,
            }).then(data => {
              if(data && data.code) {
                message.success('更新成功');
                this.handleCancel();
                this.props.dispatch({
                  type: 'chemicals/fetch',
                });
              }else{
                message.error('更新失败');
              }
            });
          } else {
            message.error('药品编码已存在');
          }
        });
      }
    });
  };

  render() {
    const {
      chemicals: { formData, visible },
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
        title="药品信息"
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
                  rules: [
                    {
                      required: true,
                      message: '请输入药品编码',
                    },
                  ],
                  initialValue: formData.code,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入药品名称',
                    },
                  ],
                  initialValue: formData.name,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="分类">
                {getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择药品类型',
                    },
                  ],
                  initialValue: formData.type,
                })(
                  <Select placeholder="请选择" style={{ maxWidth: 220 }}>
                    {type.map((value, index) => (
                      <Option key={index} value={index}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="数量">
                {getFieldDecorator('number', {
                  rules: [
                    {
                      required: true,
                      message: '请输入药品数量',
                    },
                  ],
                  initialValue: formData.number,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="数量单位">
                {getFieldDecorator('unit', {
                  rules: [
                    {
                      required: true,
                      message: '请输入药品数量单位',
                    },
                  ],
                  initialValue: formData.unit,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="阈值">
                {getFieldDecorator('threshold', {
                  initialValue: formData.threshold,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...textAreaLayout} label="操作指南">
                {getFieldDecorator('guild', {
                  initialValue: formData.guild,
                })(<TextArea rows={4} placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
