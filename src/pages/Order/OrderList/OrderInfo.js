import React, { PureComponent } from 'react';
import { Col, Input, Button, Row, Form, Select, Modal, Divider } from 'antd';
import { connect } from 'dva';

const stateType = ['申请中', '待领取', '待归还', '已完成', '未通过', '已撤销'];
const time = ['第一大节', '第二大节', '第三大节', '第四大节'];

@connect(({ order, user, chemicals, instrument }) => ({
  order,
  userSd: user.userSd,
  chemicalSd: chemicals.chemicalSd,
  instrumentSd: instrument.instrumentSd,
}))
export default class OrderInfo extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserSd',
      payload: '123',
    });
    dispatch({
      type: 'chemicals/getChemicalSd',
    });
    dispatch({
      type: 'instrument/getInstrumentSd',
    });
  }

  handleClose() {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/changeInfoVisible',
    });
  }

  render() {
    const { userSd, chemicalSd, instrumentSd } = this.props;
    const { visible, record } = this.props.order;

    return (
      <Modal
        title="申请详情"
        visible={visible}
        onOk={() => {
          this.handleClose();
        }}
        onCancel={() => {
          this.handleClose();
        }}
        width={700}
        centered={true}
      >
        <div style={{ height: '350px', overflow: 'auto' }}>
          <Row style={{ marginBottom: 5 }}>
            <Col md={8} sm={24}>
              <span>当前进度：{stateType[record.state] || '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>申请人：{record.applicantId ? userSd[record.applicantId] : '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>申请时间：{record.submitTime || '暂无'}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 5 }}>
            <Col md={8} sm={24}>
              <span>使用日期：{record.orderDate || '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>
                使用时间：
                {record.orderTime
                  ? record.orderTime
                      .split(',')
                      .map(value => time[value])
                      .join(',')
                  : '暂无'}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 5 }}>
            <Col md={8} sm={24}>
              <span>审核人：{record.adoptId ? userSd[record.adoptId] : '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>分发人：{record.distributorId ? userSd[record.distributorId] : '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>入库人：{record.storageId ? userSd[record.storageId] : '暂无'}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 5 }}>
            <Col md={8} sm={24}>
              <span>审核时间：{record.adoptTime || '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>领取时间：{record.getTime || '暂无'}</span>
            </Col>
            <Col md={8} sm={24}>
              <span>入库时间：{record.storageTime || '暂无'}</span>
            </Col>
          </Row>
          {record.itemsId
            ? record.itemsId.chemicals.map((value, index) => {
                const orderNum = record.itemsNum.chemicals[index];
                const backNum = record.backNum ? record.backNum.chemicals[index] : '暂无';
                return (
                  <div>
                    {index === 0 ? <Divider orientation="left">所借药品信息</Divider> : null}
                    <Row style={{ marginBottom: 5 }}>
                      <Col md={8} sm={24}>
                        <span>药品名称：{chemicalSd[value]}</span>
                      </Col>
                      <Col md={8} sm={24}>
                        <span>申请数量：{orderNum}</span>
                      </Col>
                      <Col md={8} sm={24}>
                        <span>归还数量：{backNum}</span>
                      </Col>
                    </Row>
                  </div>
                );
              })
            : null}
          {record.itemsId
            ? record.itemsId.instrument.map((value, index) => {
                const orderNum = record.itemsNum.instrument[index];
                const backNum = record.backNum ? record.backNum.instrument[index] : '暂无';
                return (
                  <div>
                    {index === 0 ? <Divider orientation="left">所借仪器信息</Divider> : null}
                    <Row style={{ marginBottom: 5 }}>
                      <Col md={8} sm={24}>
                        <span>仪器名称：{instrumentSd[value]}</span>
                      </Col>
                      <Col md={8} sm={24}>
                        <span>申请数量：{orderNum}</span>
                      </Col>
                      <Col md={8} sm={24}>
                        <span>归还数量：{backNum}</span>
                      </Col>
                    </Row>
                  </div>
                );
              })
            : null}
        </div>
      </Modal>
    );
  }
}
