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

@connect(({ order, chemicals }) => ({
  formData: order.formData,
  chemicalSd: chemicals.chemicalSd,
  chemicalsNum: chemicals.chemicalsNum,
}))
@Form.create()
class Step2 extends React.PureComponent {
  state = {
    num: {},
  };
  componentWillMount() {
    const { formData, dispatch } = this.props;
    if (!formData.chemicalsNum) {
      router.push('/order/form/time');
    } else {
      dispatch({
        type: 'chemicals/getChemicalsNum',
      });
      dispatch({
        type: 'chemicals/getChemicalSd',
      });
    }
  }
  render() {
    const { form, dispatch, formData, chemicalSd, chemicalsNum } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { num } = this.state;
    const onSelectChange = (value, index) => {
      const obj = {};
      obj[index] = chemicalsNum[value];
      this.setState({
        num: {
          ...num,
          ...obj,
        },
      });
    };
    const onPrev = () => {
      router.push('/order/form/time');
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'order/updateChemicalsItem',
            payload: {
              itemsId: values.itemsId,
              itemsNum: values.itemsNum,
            },
          });
          if (formData.instrumentNum) {
            router.push('/order/form/instrument');
          } else {
            dispatch({
              type: 'order/submitStepForm',
            }).then(() => {
              router.push('/order/form/result');
            });
          }
        }
      });
    };
    const formItems = () => {
      const arr = [];
      for (let i = 0; i < formData.chemicalsNum; i++) {
        arr.push(
          <Row>
            <Col md={15} sm={24}>
              <Form.Item {...formItemLayout} label="药品名称">
                {getFieldDecorator(`itemsId[${i}]`, {
                  initialValue: formData.itemsId.chemicals[i] ? formData.itemsId.chemicals[i] : [],
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
                    {Object.keys(chemicalSd).map(value => (
                      <Option value={value} key={i}>
                        {chemicalSd[value]}
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
                  initialValue: formData.itemsNum.chemicals[i]
                    ? formData.itemsNum.chemicals[i]
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
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
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
              {formData.instrumentNum ? '下一步' : '提交'}
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
