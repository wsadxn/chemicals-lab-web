import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar, Modal } from 'antd';

@connect(({ inform, user }) => ({
  inform,
  userSd: user.userSd,
}))
export default class IndexInform extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'user/getUserSd',
      payload: '23',
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
    const { data } = this.props.inform;

    return (
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            bodyStyle={{ padding: 0 }}
            bordered={false}
            title="最新公告"
            extra={<Link to="/inform/all">更多</Link>}
          >
            <List
              itemLayout="horizontal"
              dataSource={data.list || []}
              renderItem={item => (
                <List.Item style={{ marginLeft: 15, marginRight: 15 }}>
                  <List.Item.Meta
                    avatar={<Avatar icon="exception" />}
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
      </Row>
    );
  }
}
