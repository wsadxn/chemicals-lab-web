import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, InputNumber, Button, Select, Divider, DatePicker, message } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const time = ['第一大节', '第二大节', '第三大节', '第四大节'];

@connect(({ order, user }) => ({
  formData: order.formData,
  currentUser: user.currentUser,
}))
@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, formData, currentUser } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'order/updateFormData',
            payload: {
              ...values,
              applicantId: currentUser.id,
            },
          });
          if (values.chemicalsNum) {
            router.push('/order/form/chemicals');
          } else if (values.instrumentNum) {
            router.push('/order/form/instrument');
          } else {
            message.error('请检查药品/仪器种数输入是否正确');
          }
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="使用日期">
            {getFieldDecorator('orderDate', {
              rules: [{ required: true, message: '请选择使用日期' }],
              initialValue: formData.orderDate ? formData.orderDate : '',
            })(
              <DatePicker
                style={{ width: 220 }}
                disabledDate={date => {
                  const current = new Date();
                  return date < current;
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="使用时间">
            {getFieldDecorator('orderTime', {
              rules: [{ required: true, message: '请选择使用时间' }],
              initialValue: formData.orderTime ? formData.orderTime : [],
            })(
              <Select placeholder="请选择" style={{ width: 220 }} mode="multiple">
                {time.map((value, index) => {
                  return (
                    <Option value={index} key={index}>
                      {value}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="药品种数">
            {getFieldDecorator('chemicalsNum', {
              rules: [{ required: true, message: '请输入要申请的药品种数' }],
              initialValue: formData.chemicalsNum ? formData.chemicalsNum : '',
            })(<InputNumber placeholder="请选择" min={0} style={{ width: 220 }} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="仪器种数">
            {getFieldDecorator('instrumentNum', {
              rules: [{ required: true, message: '请输入要申请的仪器种数' }],
              initialValue: formData.instrumentNum ? formData.instrumentNum : '',
            })(<InputNumber placeholder="请选择" min={0} style={{ width: 220 }} />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
      </Fragment>
    );
  }
}

export default Step1;
