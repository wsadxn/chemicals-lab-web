import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ order }) => ({
  result: order.result,
  formData: order.formData,
}))
class Step4 extends React.PureComponent {
  render() {
    const { result, formData, dispatch } = this.props;
    const onFinish = () => {
      dispatch({
        type: 'order/resetFormData',
      });
      router.push('/order/form/time');
    };
    const success = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          继续申请
        </Button>
      </Fragment>
    );
    const error = (
      <Fragment>
        <Button
          type="primary"
          onClick={() => {
            router.push('/order/form/time');
          }}
        >
          重新申请
        </Button>
      </Fragment>
    );

    if (result === 1) {
      return (
        <Result
          type="success"
          title="申请成功，请等待审核"
          actions={success}
          className={styles.result}
        />
      );
    } else {
      return (
        <Result
          type="error"
          title="申请失败"
          actions={error}
          className={styles.result}
        />
      );
    }
  }
}

export default Step4;
