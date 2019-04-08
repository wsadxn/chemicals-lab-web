import { connect } from 'dva';
import React, { PureComponent } from 'react';
import {
  Card,
  Table,
  Divider,
  Icon,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Button,
  Modal,
  message,
} from 'antd';
import InstrumentSearch from './InstrumentSearch';
import InstrumentForm from './InstrumentForm';

import styles from './Instrument.less';

const type = ['计量类', '反应类', '容器类', '分离类', '固体夹持类', '加热类', '配套类', '其它'];

@connect(({ instrument, user }) => ({
  instrument,
  currentUser: user.currentUser,
}))
export default class Instrument extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'instrument/fetch',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'instrument/changeSearchFormFields',
    });
  }

  // 查看
  handleDetail = record => {
    Modal.info({
      width: 700,
      title: '仪器详情',
      content: (
        <div>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <span>名称：{record.name}</span>
            </Col>
            <Col md={12} sm={24}>
              <span>编号：{record.code}</span>
            </Col>
          </Row>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <span>数量：{record.number}</span>
            </Col>
            <Col md={12} sm={24}>
              <span>类别：{type[record.type]}</span>
            </Col>
          </Row>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col>
              <Row>
                <Col>操作指南：</Col>
              </Row>
              <Row>
                <Col style={{ height: '220px', overflow: 'auto' }}>
                  <pre className={styles.discribe}>{record.guild || '暂无'}</pre>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ),
      okText: '关闭',
      onOk() {},
    });
  };
  // 编辑
  handleEdit = record => {
    this.props.dispatch({
      type: 'instrument/updateFormData',
      payload: record,
    });
    this.props.dispatch({
      type: 'instrument/changeVisible',
    });
  };
  // 新增
  handleAdd() {
    this.props.dispatch({
      type: 'instrument/updateFormData',
    });
    this.props.dispatch({
      type: 'instrument/changeVisible',
    });
  }

  // 删除
  handleDelete = record => {
    this.props
      .dispatch({
        type: 'instrument/delete',
        payload: record.id,
      })
      .then(data => {
        if (data && data.code) {
          message.success('删除成功');
          this.props.dispatch({
            type: 'instrument/fetch',
          });
        } else {
          message.error('删除失败');
        }
      });
  };
  // 刷新
  handleRefresh() {
    this.doPageSearch();
  }

  // 排序
  handleTableChange = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'instrument/changeSearchFormFields',
      payload: {
        pageNum: pagination.current || '',
        pageSize: pagination.pageSize || '',
        ...filters,
      },
    });
    this.doPageSearch();
  };

  // 分页
  handlePaginationChange = pageNum => {
    this.props.dispatch({
      type: 'instrument/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'instrument/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'instrument/fetch',
    });
  }

  render() {
    const { data } = this.props.instrument;
    const { currentUser } = this.props;

    const columns = [
      {
        title: '仪器编号',
        dataIndex: 'code',
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: '仪器名称',
        dataIndex: 'name',
      },
      {
        title: '仪器分类',
        dataIndex: 'type',
        render: data => type[data],
      },
      {
        title: '数量',
        dataIndex: 'number',
      },
      {
        title: '操作',
        render: record => (
          <div>
            <Tooltip title="查看">
              <Icon
                type="file-text"
                onClick={() => this.handleDetail(record)}
                style={{ fontSize: 20, color: '#108ee9', cursor: 'pointer' }}
              />
            </Tooltip>
            {(currentUser.identity === '2' || currentUser.identity === '3') && (
              <span>
                <Divider type="vertical" />
                <Tooltip title="编辑">
                  <Icon
                    type="edit"
                    onClick={() => this.handleEdit(record)}
                    style={{ fontSize: 20, color: '#6abf47', cursor: 'pointer' }}
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="删除">
                  <Popconfirm
                    placement="topRight"
                    title="要删除当前行数据吗？"
                    onConfirm={() => this.handleDelete(record)}
                  >
                    <Icon
                      type="delete"
                      style={{ fontSize: 20, color: '#ff3673', cursor: 'pointer' }}
                    />
                  </Popconfirm>
                </Tooltip>
              </span>
            )}
          </div>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: data.pagination.current || '',
      pageSize: data.pagination.pageSize || '',
      total: data.pagination.total || '',
      showTotal: total => `总计 ${total} 条数据`,
      onChange: this.handlePaginationChange,
      onShowSizeChange: this.handlePaginationSizeChange,
    };
    return (
      <div>
        <InstrumentForm />
        <Card
          title="仪器列表"
          extra={
            <div>
              <Button onClick={() => this.handleRefresh()}>刷新</Button>
              {(currentUser.identity === '2' || currentUser.identity === '3') && (
                <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.handleAdd()}>
                  新增
                </Button>
              )}
            </div>
          }
        >
          <InstrumentSearch />
          <Table
            bordered
            size="small"
            rowKey="id"
            columns={columns}
            dataSource={data.list || []}
            pagination={paginationProps}
            onChange={this.handleTableChange}
          />
        </Card>
      </div>
    );
  }
}
