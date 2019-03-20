import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, InputNumber, Row, Col } from 'antd';
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

@connect(({ order, instrument }) => ({
  formData: order.formData,
  instrumentSd: instrument.instrumentSd,
  unUsedInsNum:order.unUsedInsNum,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    num: {},
  };
  componentWillMount() {
    const { formData, dispatch } = this.props;
    if (!formData.instrumentNum) {
      router.push('/order/form/chemicals');
    } else {
      dispatch({
        type: 'order/getUnusedInsNum',
        payload: {
          orderDate: formData.orderDate.format('YYYY-MM-DD'),
          orderTime: formData.orderTime.join(','),
        },
      });
      dispatch({
        type: 'instrument/getInstrumentSd',
      });
    }
  }
  render() {
    const { form, dispatch, formData, instrumentSd, unUsedInsNum } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { num } = this.state;
    const onSelectChange = (value, index) => {
      const obj = {};
      obj[index] = unUsedInsNum[value];
      this.setState({
        num: {
          ...num,
          ...obj,
        },
      });
    };
    const onPrev = () => {
      router.push('/order/form/chemicals');
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'order/updateInstrumentItem',
            payload: {
              itemsId: values.itemsId,
              itemsNum: values.itemsNum,
            },
          });
          dispatch({
            type: 'order/submitStepForm',
          }).then(() => {
            router.push('/order/form/result');
          });
        }
      });
    };
    const formItems = () => {
      const arr = [];
      for (let i = 0; i < formData.instrumentNum; i++) {
        arr.push(
          <Row>
            <Col md={15} sm={24}>
              <Form.Item {...formItemLayout} label="仪器名称">
                {getFieldDecorator(`itemsId[${i}]`, {
                  initialValue: formData.itemsId.instrument[i]
                    ? formData.itemsId.instrument[i]
                    : [],
                })(
                  <Select
                    showSearch
                    placeholder="请选择"
                    style={{ width: 170 }}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value, option) => {
                      onSelectChange(value, option.key);
                    }}
                  >
                    {Object.keys(instrumentSd).map(value => (
                      <Option value={value} key={i}>
                        {instrumentSd[value]}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={9} sm={24}>
              <Form.Item {...formItemLayout} label="数量">
                {getFieldDecorator(`itemsNum[${i}]`, {
                  rules: [{ required: true, message: '请输入该药品数量' }],
                  initialValue: formData.itemsNum.instrument[i]
                    ? formData.itemsNum.instrument[i]
                    : '',
                })(<InputNumber min={1} max={num[i]} style={{ width: 100 }} />)}
              </Form.Item>
            </Col>
          </Row>
        );
      }
      return arr;
    };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          {formItems()}
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
              提交
            </Button>
            <Button onClick={onPrev} style={{ marginLeft: 8 }}>
              上一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
      </Fragment>
    );
  }
}

export default Step2;
