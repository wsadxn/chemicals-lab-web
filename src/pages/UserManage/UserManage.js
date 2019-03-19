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
import UserManageSearch from './UserManageSearch';
import UserManageForm from './UserManageForm';

import styles from './UserManage.less';

const type = ['学生', '教师', '管理员', '主管'];

@connect(({ user }) => ({
  user,
  currentUser: user.currentUser,
}))
export default class UserManage extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'user/fetch',
    });
  }

  componentWillUnmount(){
    this.props.dispatch({
      type: 'user/changeSearchFormFields',
    });
  }

  // 查看
  handleDetail = record => {
    Modal.info({
      width: 600,
      title: '药品详情',
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
              <span>数量：{record.number + record.unit}</span>
            </Col>
            <Col md={12} sm={24}>
              <span>类别：{type[record.type]}</span>
            </Col>
          </Row>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col>
              <span>
                操作指南：
                <br />
                {record.guild || '暂无'}
              </span>
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
      type: 'user/updateFormData',
      payload: record,
    });
    this.props.dispatch({
      type: 'user/changeVisible',
    });
  };
  // 新增
  handleAdd() {
    this.props.dispatch({
      type: 'user/updateFormData',
    });
    this.props.dispatch({
      type: 'user/changeVisible',
    });
  }

  // 删除
  handleDelete = record => {
    this.props
      .dispatch({
        type: 'user/delete',
        payload: record.id,
      })
      .then(data => {
        if (data && data.code) {
          message.success('删除成功');
          this.props.dispatch({
            type: 'user/fetch',
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
      type: 'user/changeSearchFormFields',
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
      type: 'user/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'user/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'user/fetch',
    });
  }

  render() {
    const { data } = this.props.user;
    const { currentUser } = this.props;

    const columns = [
      {
        title: '账号',
        dataIndex: 'id',
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: '用户名',
        dataIndex: 'name',
      },
      {
        title: '权限',
        dataIndex: 'identity',
        render: identity => type[identity],
      },
      {
        title: '联系电话',
        dataIndex: 'tel',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '操作',
        render: record => {
          return (
            <div>
              <Tooltip title="权限修改">
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
                  title="要删除当前用户数据吗？"
                  onConfirm={() => this.handleDelete(record)}
                >
                  <Icon
                    type="delete"
                    style={{ fontSize: 20, color: '#ff3673', cursor: 'pointer' }}
                  />
                </Popconfirm>
              </Tooltip>
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
        <UserManageForm />
        <Card
          title="用户列表"
          extra={
            <div>
              <Button onClick={() => this.handleRefresh()}>刷新</Button>
              <Button type="primary" style={{ marginLeft: 10 }} onClick={() => this.handleAdd()}>
                新增
              </Button>
            </div>
          }
        >
          <UserManageSearch />
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
