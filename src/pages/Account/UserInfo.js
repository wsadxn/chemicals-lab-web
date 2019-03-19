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
  componentDidMount() {
    this.setUserInfo();
  }

  setUserInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] + '' || '';
      form.setFieldsValue(obj);
    });
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/updateUserInfo',
          payload: {
            ...values,
            type: 'self',
          },
        }).then(data => {
          if (data && data.code) {
            message.success('修改成功');
            dispatch({
              type: 'user/fetchCurrent',
              payload: {
                userId: window.sessionStorage.getItem('currentUserId'),
              },
            }).then(() => {
              this.setUserInfo();
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
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
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
        sm: { span: 10, offset: 8 },
      },
    };

    return (
        <Card title="个人信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="权限">
              {getFieldDecorator('identity')(
                <Select style={{ width: 220 }} disabled>
                  <Option value="0">学生</Option>
                  <Option value="1">教师</Option>
                  <Option value="2">管理员</Option>
                  <Option value="3">主管</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('id')(<Input style={{ width: 220 }} disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
              })(<Input style={{ width: 220 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('tel', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系电话',
                  },
                ],
              })(<Input style={{ width: 220 }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="邮箱地址">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱地址',
                  },
                ],
              })(<Input style={{ width: 220 }} />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.setUserInfo}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
    );
  }
}

export default UserInfo;
