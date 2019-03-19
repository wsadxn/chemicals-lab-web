import { connect } from 'dva';
import React, { PureComponent } from 'react';
import {
  Card,
  Table,
  Tag,
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
import CPApplySearch from './CPApplySearch';
import CPApplyForm from './CPApplyForm';

import styles from './CPApply.less';
import { ifError } from 'assert';

const status = ['库存紧张', '库存较少', '库存充足'];

@connect(({ cpapply, user }) => ({
  cpapply,
  currentUser: user.currentUser,
}))
export default class CPApply extends PureComponent {
  state = {
    visible: false,
    record: {},
    count: '',
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'cpapply/fetch',
    });
  }

  // 编辑
  handleEdit = record => {
    this.props
      .dispatch({
        type: 'cpapply/getExistCount',
        payload: {
          type: 0,
          itemId: record.id,
        },
      })
      .then(data => {
        if (data && data.data) {
          this.setState({
            visible: true,
            record,
            count: data.data,
          });
        } else {
          this.showApplyForm(record);
        }
      });
  };

  showApplyForm(record) {
    this.props.dispatch({
      type: 'cpapply/updateFormData',
      payload: record,
    });
    this.props.dispatch({
      type: 'cpapply/changeVisible',
    });
  }

  // 刷新
  handleRefresh() {
    this.doPageSearch();
  }

  // 排序
  handleTableChange = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'cpapply/changeSearchFormFields',
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
      type: 'cpapply/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'cpapply/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'cpapply/fetch',
    });
  }

  render() {
    const { data } = this.props.cpapply;
    const { currentUser } = this.props;

    const columns = [
      {
        title: '药品编号',
        dataIndex: 'code',
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: '药品名称',
        dataIndex: 'name',
      },
      {
        title: '库存状态',
        render: record => {
          if (record.number - record.threshold < 0) {
            return (
              <Tag color="#F5222D" style={{ height: '100%', float: 'center' }}>
                {status[0]}
              </Tag>
            );
          } else if (record.number - record.threshold < 10) {
            return (
              <Tag color="#FFE32D" style={{ height: '100%', float: 'center' }}>
                {status[1]}
              </Tag>
            );
          } else {
            return (
              <Tag color="#1890FF" style={{ height: '100%', float: 'center' }}>
                {status[2]}
              </Tag>
            );
          }
        },
        sorter: (a, b) => a.number - a.threshold - (b.number - b.threshold),
      },
      {
        title: '数量',
        render: record => `${record.unit ? record.number + ' ' + record.unit : record.number}`,
      },
      {
        title: '阈值',
        render: record =>
          `${record.unit ? record.threshold + ' ' + record.unit : record.threshold}`,
      },
      {
        title: '操作',
        render: record => (
          <div>
            <Tooltip title="采购">
              <Icon
                type="edit"
                onClick={() => this.handleEdit(record)}
                style={{ fontSize: 20, color: '#6abf47', cursor: 'pointer' }}
              />
            </Tooltip>
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
        <CPApplyForm />
        <Card title="药品列表">
          <CPApplySearch />
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
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={()=>{
            this.setState({
              visible: false,
            });
            this.showApplyForm(this.state.record);
          }}
          onCancel={()=>{
            this.setState({
              visible: false,
            });
          }}
        >
          <p>此药品现已有&nbsp;<strong>{this.state.count}</strong>&nbsp;条采购请求，</p>
          <p>请确认是否继续申请采购？</p>
        </Modal>
      </div>
    );
  }
}
