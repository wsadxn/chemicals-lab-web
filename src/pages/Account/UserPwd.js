import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Select, Card, message } from 'antd';
import styles from './style.less';

const FormItem = Form.Item;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class UserInfo extends Component {
  state = {
    confirmDirty: false,
  };
  handleSubmit = e => {
    const { dispatch, form, currentUser } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/validPassword',
          payload: {
            pid: currentUser.id,
            pwd: values.currentPwd,
          },
        }).then(data => {
          if (!data || !data.status) {
            message.error('当前密码不正确');
          } else {
            dispatch({
              type: 'user/updateUserInfo',
              payload: {
                id: currentUser.id,
                password: values.newPwd,
                type: 'self',
              },
            }).then(data => {
              if (data && data.code) {
                message.success('修改成功');
                this.handleCancel();
              } else {
                message.error('修改失败');
              }
            });
          }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPwd')) {
      callback('两次密码输入不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleCancel = e => {
    const { form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = '';
      form.setFieldsValue(obj);
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 9 },
      },
    };

    return (
      <Card title="修改密码" bordered={false}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="当前密码">
            {getFieldDecorator('currentPwd', {
              rules: [
                {
                  required: true,
                  message: '请输入当前密码',
                },
              ],
            })(<Input style={{ width: 240 }} type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('newPwd', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input style={{ width: 240 }} type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重复新密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请再次输入以确认新密码',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input style={{ width: 240 }} type="password" onBlur={this.handleConfirmBlur} />)}
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={this.handleCancel}>
              取消
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default UserInfo;
