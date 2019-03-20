import React, { Component } from 'react';
import { Form, Input, message, Modal, Select, Row, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ inform, user }) => ({
  inform,
  currentUser: user.currentUser,
}))
@Form.create()
export default class InformForm extends Component {
  handleCancel = () => {
    this.props.dispatch({
      type: 'inform/changeVisible',
    });
  };

  handleOk = e => {
    const { dispatch, form, currentUser } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'inform/update',
          payload: {
            ...values,
            author: currentUser.id,
          },
        }).then(data => {
          if (data && data.code) {
            message.success('更新成功');
            this.handleCancel();
            this.props.dispatch({
              type: 'inform/fetch',
            });
          } else {
            message.error('更新失败');
          }
        });
      }
    });
  };

  render() {
    const {
      inform: { formData, visible },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
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
        title="公告信息"
        visible={visible}
        destroyOnClose={true}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={700}
        centered
      >
        <Form style={{ marginTop: 8 }}>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label="标题">
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请输入公告标题',
                    },
                  ],
                  initialValue: formData.title,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <FormItem {...formItemLayout} label="内容">
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: '请输入公告内容',
                    },
                  ],
                  initialValue: formData.content,
                })(<TextArea rows={10} placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
