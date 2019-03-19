import React, { Component } from 'react';
import { Form, Input, message, Modal, Select, Row, Col, Divider, InputNumber } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ user }) => ({
  user,
}))
@Form.create()
export default class UserManageForm extends Component {
  handleCancel = () => {
    this.props.dispatch({
      type: 'user/changeVisible',
    });
  };

  handleOK = e => {
    const {
      dispatch,
      form,
      user: { formData },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/updateUserInfo',
          payload: {
            id: formData.id,
            identity: values.identity,
            type: 'identity',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('修改成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'user/fetch',
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
      user: { visible, formData },
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

    return (
      <Modal
        title="权限修改"
        visible={visible}
        destroyOnClose={true}
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        width={700}
      >
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="权限">
                {getFieldDecorator('identity', {
                  rules: [
                    {
                      required: true,
                      message: '请选择权限',
                    },
                  ],
                  initialValue: formData.identity,
                })(
                  <Select placeholder="请选择" style={{ width: 170 }}>
                    <Option value="0">学生</Option>
                    <Option value="1">教师</Option>
                    <Option value="2">管理员</Option>
                    <Option value="3">主管</Option>
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
