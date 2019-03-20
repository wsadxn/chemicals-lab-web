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
  Radio,
  Tag,
} from 'antd';
import OrderListSearch from './OrderListSearch';
import OrderListForm from './OrderListForm';
import OrderInfo from '../OrderInfo';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const time = ['第一大节', '第二大节', '第三大节', '第四大节'];
const stateType = ['申请中', '待领取', '待归还', '已完成', '未通过', '已撤销'];
const stateObj = {
  all: '',
  apply: '0',
  get: '1',
  back: '2',
  complete: '3',
  fail: '4',
  revoke: '5',
};

@connect(({ order, user }) => ({
  order,
  currentUser: user.currentUser,
  userSd: user.userSd,
}))
export default class OrderList extends PureComponent {
  state = {
    menuVal: 'all',
  };

  componentWillMount() {
    const { location, dispatch } = this.props;
    dispatch({
      type: 'order/changeSearchFormFields',
      payload: {
        id: location.query.id || '',
        state: stateObj[this.state.menuVal],
      },
    });
    dispatch({
      type: 'order/fetch',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'order/changeSearchFormFields',
    });
  }

  handleRadioGroup = e => {
    const { dispatch, currentUser } = this.props;
    this.setState({
      menuVal: e.target.value,
    });
    dispatch({
      type: 'order/changeSearchFormFields',
      payload: {
        id: '',
        state: stateObj[e.target.value],
      },
    });
    this.doPageSearch();
  };

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
  // 入库
  handleStorage = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'order/updateListFormData',
      payload: {
        record,
        operation: 'storage',
        currentUser: currentUser.id,
      },
    });
    dispatch({
      type: 'order/changeListVisible',
    });
  };
  // 审核
  handleAdopt = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'order/updateListFormData',
      payload: {
        record,
        operation: 'adopt',
        currentUser: currentUser.id,
      },
    });
    dispatch({
      type: 'order/changeListVisible',
    });
  };
  // 领取
  handleReceive = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'order/updateListFormData',
      payload: {
        record,
        operation: 'receive',
        currentUser: currentUser.id,
      },
    });
    dispatch({
      type: 'order/changeListVisible',
    });
  };

  // 刷新
  handleRefresh() {
    this.doPageSearch();
  }

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
    const { currentUser, userSd, chemicalSd } = this.props;
    const { menuVal } = this.state;

    const optButton = {
      detail: record => (
        <Tooltip title="查看详情">
          <Icon
            type="file-text"
            onClick={() => this.handleDetail(record)}
            style={{ fontSize: 20, color: '#108ee9', cursor: 'pointer' }}
          />
        </Tooltip>
      ),
      adopt: record => (
        <Tooltip title="申请审核">
          <Icon
            type="check-square"
            onClick={() => this.handleAdopt(record)}
            style={{ fontSize: 20, color: '#3cd4a7', cursor: 'pointer' }}
          />
        </Tooltip>
      ),
      receive: record => (
        <Tooltip title="领取登记">
          <Icon
            type="edit"
            onClick={() => this.handleReceive(record)}
            style={{ fontSize: 20, color: '#6abf47', cursor: 'pointer' }}
          />
        </Tooltip>
      ),
      storage: record => (
        <Tooltip title="归还登记">
          <Icon
            type="edit"
            onClick={() => this.handleStorage(record)}
            style={{ fontSize: 20, color: '#6abf47', cursor: 'pointer' }}
          />
        </Tooltip>
      ),
      divider: () => <Divider type="vertical" />,
    };

    const columns = [
      {
        title: '申请人',
        dataIndex: 'applicantId',
        render: applicantId => userSd[applicantId],
      },
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
        render: record => (
          <div>
            {optButton.detail(record)}
            {record.state === 0 ? (
              <span>
                {optButton.divider()}
                {optButton.adopt(record)}
              </span>
            ) : null}
            {record.state === 1 ? (
              <span>
                {optButton.divider()}
                {optButton.receive(record)}
              </span>
            ) : null}
            {record.state === 2 ? (
              <span>
                {optButton.divider()}
                {optButton.storage(record)}
              </span>
            ) : null}
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
        <OrderInfo />
        <OrderListForm />
        <Card title="预约列表">
          <OrderListSearch />
          <div style={{ marginTop: 15, marginBottom: 15 }}>
            <Button
              type="dashed"
              onClick={() => {
                this.handleRefresh();
              }}
            >
              刷新
            </Button>
            <RadioGroup
              style={{ float: 'right' }}
              value={menuVal}
              onChange={e => this.handleRadioGroup(e)}
            >
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="apply">申请中</RadioButton>
              <RadioButton value="get">待领取</RadioButton>
              <RadioButton value="back">待归还</RadioButton>
              <RadioButton value="complete">已完成</RadioButton>
              <RadioButton value="fail">未通过</RadioButton>
              <RadioButton value="revoke">已撤销</RadioButton>
            </RadioGroup>
          </div>
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
