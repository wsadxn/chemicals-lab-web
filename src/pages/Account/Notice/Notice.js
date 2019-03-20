import { connect } from 'dva';
import Link from 'umi/link';
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

import NoticeSearch from './NoticeSearch';

const stateType = ['未读', '已读'];
const type = [
  '物品申请',
  '申请撤销',
  '申请审核',
  '领取物品',
  '归还入库',
  '采购申请',
  '采购撤销',
  '采购审核',
  '采购成功',
  '权限修改',
];

@connect(({ notice, user }) => ({
  notice,
  currentUser: user.currentUser,
}))
export default class Notice extends PureComponent {
  componentWillMount() {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'notice/changeSearchFormFields',
      payload: {
        acceptId: currentUser.id,
        identity: currentUser.identity,
      },
    });
    dispatch({
      type: 'notice/fetch',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'notice/changeSearchFormFields',
    });
  }

  // 标记已读
  handleEdit = record => {
    this.props
      .dispatch({
        type: 'notice/update',
        payload: {
          id: record.id,
          state: 1,
        },
      })
      .then(data => {
        if (data && data.code) {
          message.success('操作成功');
          this.props.dispatch({
            type: 'notice/fetch',
          });
        } else {
          message.error('操作失败');
        }
      });
  };

  // 删除
  handleDelete = record => {
    this.props
      .dispatch({
        type: 'notice/delete',
        payload: record.id,
      })
      .then(data => {
        if (data && data.code) {
          message.success('删除成功');
          this.props.dispatch({
            type: 'notice/fetch',
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
      type: 'notice/changeSearchFormFields',
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
      type: 'notice/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'notice/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'notice/fetch',
    });
  }

  render() {
    const { data } = this.props.notice;
    const { currentUser } = this.props;

    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        render: data => type[data],
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
      {
        title: '发送人',
        dataIndex: 'sendId',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: data => stateType[data],
      },
      {
        title: '操作',
        render: record => {
          return (
            <div>
              {record.state == 0 ? (
                <span>
                  <Tooltip title="标记已读">
                    <Icon
                      type="check-square"
                      onClick={() => this.handleEdit(record)}
                      style={{ fontSize: 20, color: '#6abf47', cursor: 'pointer' }}
                    />
                  </Tooltip>
                  <Divider type="vertical" />
                </span>
              ) : null}
              <Tooltip title="删除">
                <Popconfirm
                  placement="topRight"
                  title="要删除当前通知吗？"
                  onConfirm={() => this.handleDelete(record)}
                >
                  <Icon
                    type="delete"
                    style={{ fontSize: 20, color: '#ff3673', cursor: 'pointer' }}
                  />
                </Popconfirm>
              </Tooltip>
              {record.type == 0 ? (
                <span>
                  <Divider type="vertical" />
                  <Tooltip title="前往">
                    <Link to={`/order/orderlist?id=${record.targetId}`}>
                      <Icon
                        type="arrow-right"
                        style={{ fontSize: 20, color: '#3c7a1f', cursor: 'pointer' }}
                      />
                    </Link>
                  </Tooltip>
                </span>
              ) : null}
              {record.type == 2 || record.type == 3 || record.type == 4 ? (
                <span>
                  <Divider type="vertical" />
                  <Tooltip title="前往">
                    <Link to={`/order/selflist?id=${record.targetId}`}>
                      <Icon
                        type="arrow-right"
                        style={{ fontSize: 20, color: '#3c7a1f', cursor: 'pointer' }}
                      />
                    </Link>
                  </Tooltip>
                </span>
              ) : null}
              {record.type == 5 || record.type == 7 || record.type == 8 ? (
                <span>
                  <Divider type="vertical" />
                  <Tooltip title="前往">
                    <Link to={`/purchase/${record.targetId.split(',')[0]==0?'chemicals':'instrument'}/list?id=${record.targetId.split(',')[1]}`}>
                      <Icon
                        type="arrow-right"
                        style={{ fontSize: 20, color: '#3c7a1f', cursor: 'pointer' }}
                      />
                    </Link>
                  </Tooltip>
                </span>
              ) : null}
              {record.type == 9 ? (
                <span>
                  <Divider type="vertical" />
                  <Tooltip title="前往">
                    <Link to={`/account/user-info`}>
                      <Icon
                        type="arrow-right"
                        style={{ fontSize: 20, color: '#3c7a1f', cursor: 'pointer' }}
                      />
                    </Link>
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
        <Card
          title="通知列表"
          extra={
            <div>
              <Button onClick={() => this.handleRefresh()}>刷新</Button>
            </div>
          }
        >
          <NoticeSearch />
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
