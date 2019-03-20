import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar, Modal } from 'antd';
import { ChartCard, MiniArea } from '@/components/Charts';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';

@connect(({ inform, user }) => ({
  inform,
  userSd: user.userSd,
}))
class IndexInform extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'user/getUserSd',
      payload: '23',
    });
    this.props.dispatch({
      type: 'inform/getMonthNum',
    });
    this.props.dispatch({
      type: 'inform/fetch',
      payload: {
        pageSize: 6,
        pageNum: 1,
      },
    });
  }

  handleDetail = record => {
    const { userSd } = this.props;
    Modal.info({
      width: 700,
      title: `${record.title}`,
      content: (
        <div>
          <Row>
            <Col md={12} sm={24}>
              <span style={{ fontSize: '12px' }}>发布人：{userSd[record.author]}</span>
            </Col>
            <Col md={12} sm={24}>
              <span style={{ fontSize: '12px' }}>发布时间：{record.updateTime}</span>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col style={{ height: '250px', overflow: 'auto' }}>
              <pre>{record.content}</pre>
            </Col>
          </Row>
        </div>
      ),
      okText: '关闭',
      onOk() {},
      centered: true,
    });
  };

  render() {
    const { data, monthNum } = this.props.inform;
    const average = {
      chemicals: 0,
      instrument: 0,
      order: 0,
    };
    const chemicalsData = monthNum.month
      ? monthNum.month.map((value, index) => {
          average.chemicals += monthNum.chemicals[index];
          return {
            x: value,
            y: monthNum.chemicals[index],
          };
        })
      : [];
    const instrumentData = monthNum.month
      ? monthNum.month.map((value, index) => {
          average.instrument += monthNum.instrument[index];
          return {
            x: value,
            y: monthNum.instrument[index],
          };
        })
      : [];
    const orderData = monthNum.month
      ? monthNum.month.map((value, index) => {
          average.order += monthNum.order[index];
          return {
            x: value,
            y: monthNum.order[index],
          };
        })
      : [];

    return (
      <Row gutter={24}>
        <Col md={16} sm={24} style={{ marginBottom: 24 }}>
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            title="最新公告"
            extra={<Link to="/inform">更多</Link>}
          >
            <List
              itemLayout="horizontal"
              dataSource={data.list || []}
              renderItem={item => (
                <List.Item style={{ marginLeft: 15, marginRight: 15 }}>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }} icon="exception" />}
                    title={
                      <a
                        onClick={() => {
                          this.handleDetail(item);
                        }}
                        style={{ fontSize: '16px' }}
                      >
                        {item.title.length > 30 ? item.title.substr(0, 30) + '...' : item.title}
                      </a>
                    }
                    description={
                      <span>
                        {item.content.length > 35
                          ? item.content.substr(0, 35) + '......'
                          : item.content}
                        <span style={{ float: 'right', color: '#bbb' }}>
                          {item.updateTime.substr(5, 11)}
                        </span>
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col md={8} sm={24}>
          <Row>
            <Col span={24}>
              <ChartCard
                title="药品采购数"
                footer={<span>{`月均采购 ${Math.ceil(average.chemicals / 6)}`}</span>}
              >
                <MiniArea line color="#cceafe" height={55} data={chemicalsData} />
              </ChartCard>
            </Col>
            <Col span={24}>
              <ChartCard
                title="仪器采购数"
                footer={<span>{`月均采购 ${Math.ceil(average.instrument / 6)}`}</span>}
                style={{ marginTop: 24 }}
              >
                <MiniArea line color="#cceafe" height={55} data={instrumentData} />
              </ChartCard>
            </Col>
            <Col span={24}>
              <ChartCard
                title="物品申请数"
                footer={<span>{`月均申请 ${Math.ceil(average.order / 6)}`}</span>}
                style={{ marginTop: 24 }}
              >
                <MiniArea line color="#cceafe" height={55} data={orderData} />
              </ChartCard>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default props => (
  <AsyncLoadBizCharts>
    <IndexInform {...props} />
  </AsyncLoadBizCharts>
);
