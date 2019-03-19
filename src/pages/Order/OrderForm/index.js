import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import styles from './style.less';

const { Step } = Steps;

@connect(({ order}) => ({
  order
}))
export default class StepForm extends PureComponent {
  componentWillUnmount(){
    this.props.dispatch({
      type: 'order/updateFormData',
    });
  }

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'time':
      return 0;
      case 'chemicals':
        return 1;
      case 'instrument':
        return 2;
        case 'result':
        return 3;
      default:
        return 0;
    }
  }

  render() {
    const { location, children } = this.props;
    return (
        <Card bordered={false} title="物品申请">
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="使用时间" />
              <Step title="药品申请" />
              <Step title="仪器申请" />
              <Step title="提交结果" />
            </Steps>
            {children}
          </Fragment>
        </Card>
    );
  }
}
