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
  Tag,
} from 'antd';
import SelfListSearch from './SelfListSearch';
import OrderInfo from '../OrderInfo';

const stateType = ['申请中', '待领取', '待归还', '已完成', '未通过', '已撤销'];
const time = ['第一大节', '第二大节', '第三大节', '第四大节'];

@connect(({ order, user }) => ({
  order,
  currentUser: user.currentUser,
}))
export default class SelfList extends PureComponent {
  componentWillMount() {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'order/changeSearchFormFields',
      payload: {
        applicantId: currentUser.id,
      },
    });
    this.doPageSearch();
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'order/changeSearchFormFields',
    });
  }

  // 查看
  handleDetail = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/updateRecord',
      payload: record,
    });
    dispatch({
      type: 'order/changeInfoVisible',
    });
  };

  // 撤销
  handleRevoke = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'order/update',
      payload: {
        record: {
          ...record,
          state: '5',
        },
        operation: 'revoke',
      },
    }).then(data => {
      if (data && data.code) {
        message.success('撤销成功');
        this.props.dispatch({
          type: 'order/fetch',
        });
      } else {
        message.error('撤销失败');
      }
    });
  };

  // 排序
  handleTableChange = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'order/changeSearchFormFields',
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
      type: 'order/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'order/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'order/fetch',
    });
  }

  render() {
    const { data } = this.props.order;

    const columns = [
      {
        title: '使用日期',
        dataIndex: 'orderDate',
        sorter: (a, b) => (a.orderDate > b.orderDate ? 1 : -1),
      },
      {
        title: '使用时间',
        dataIndex: 'orderTime',
        render: orderTime =>
          orderTime
            .split(',')
            .map(value => time[value])
            .join(','),
      },
      {
        title: '申请时间',
        dataIndex: 'submitTime',
        sorter: (a, b) => (a.submitTime > b.submitTime ? 1 : -1),
      },
      {
        title: '进度',
        dataIndex: 'state',
        render: state => stateType[state],
      },
      {
        title: '操作',
        render: record => {
          return (
            <div>
              <Tooltip title="查看详情">
                <Icon
                  type="file-text"
                  onClick={() => this.handleDetail(record)}
                  style={{ fontSize: 20, color: '#108ee9', cursor: 'pointer' }}
                />
              </Tooltip>
              {record.state === 0 ? (
                <span>
                  <Divider type="vertical" />
                  <Tooltip title="撤销申请">
                    <Popconfirm
                      placement="topRight"
                      title="要撤销当前申请吗？"
                      onConfirm={() => this.handleRevoke(record)}
                    >
                      <Icon
                        type="delete"
                        style={{ fontSize: 20, color: '#ff3673', cursor: 'pointer' }}
                      />
                    </Popconfirm>
                  </Tooltip>
                </span>
              ) : null}
            </div>
          );
        },
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
        <OrderInfo />
        <Card title="申请列表">
          <SelfListSearch />
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
