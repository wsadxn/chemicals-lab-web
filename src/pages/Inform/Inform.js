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
import InformSearch from './InformSearch';
import InformForm from './InformForm';

@connect(({ inform, user }) => ({
  inform,
  currentUser: user.currentUser,
  userSd: user.userSd,
}))
export default class Inform extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'user/getUserSd',
      payload: '23',
    });
    this.props.dispatch({
      type: 'inform/fetch',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'inform/changeSearchFormFields',
    });
  }

  // 查看
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
  // 编辑
  handleEdit = record => {
    this.props.dispatch({
      type: 'inform/updateFormData',
      payload: record,
    });
    this.props.dispatch({
      type: 'inform/changeVisible',
    });
  };
  // 新增
  handleAdd() {
    this.props.dispatch({
      type: 'inform/updateFormData',
    });
    this.props.dispatch({
      type: 'inform/changeVisible',
    });
  }

  // 删除
  handleDelete = record => {
    this.props
      .dispatch({
        type: 'inform/delete',
        payload: record.id,
      })
      .then(data => {
        if (data && data.code) {
          message.success('删除成功');
          this.props.dispatch({
            type: 'inform/fetch',
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
      type: 'inform/changeSearchFormFields',
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
      type: 'inform/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'inform/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'inform/fetch',
    });
  }

  render() {
    const { data } = this.props.inform;
    const { currentUser, userSd } = this.props;

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '发布人',
        dataIndex: 'author',
        render: author => userSd[author],
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
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
        <InformForm />
        <Card
          title="公告列表"
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
          <InformSearch />
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
