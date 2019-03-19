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
import CPListSearch from './CPListSearch';
import CPListForm from './CPListForm';

import styles from './CPList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const type = ['常规', '紧急'];
const stateObj = {
  all: '',
  apply: '0',
  purchase: '1',
  complete: '2',
  fail: '-1',
  revoke: '-2',
};

@connect(({ cplist, user, chemicals }) => ({
  cplist,
  currentUser: user.currentUser,
  userSd: user.userSd,
  chemicalSd: chemicals.chemicalSd,
}))
export default class CPList extends PureComponent {
  state = {
    menuVal: 'all',
    visible: false,
    recordInfo: {},
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'cplist/changeSearchFormFields',
      payload: {
        state: stateObj[this.state.menuVal],
      },
    });
    this.props.dispatch({
      type: 'cplist/fetch',
    });
    this.props.dispatch({
      type: 'user/getUserSd',
      payload: '23',
    });
    this.props.dispatch({
      type: 'chemicals/getChemicalSd',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'cplist/changeSearchFormFields',
    });
  }

  handleRadioGroup = e => {
    const { dispatch, currentUser } = this.props;
    this.setState({
      menuVal: e.target.value,
    });
    dispatch({
      type: 'cplist/changeSearchFormFields',
      payload: {
        state: stateObj[e.target.value],
      },
    });
    this.doPageSearch();
  };

  // 查看
  handleDetail = record => {
    this.setState({
      visible: true,
      recordInfo: record,
    });
  };
  // 入库
  handleStorage = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'cplist/updateFormData',
      payload: {
        id: record.id,
        itemId: record.itemId,
        operation: 'storage',
        currentUser: currentUser.id,
      },
    });
    dispatch({
      type: 'cplist/changeVisible',
    });
  };
  // 审核
  handleAdopt = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'cplist/updateFormData',
      payload: {
        id: record.id,
        itemId: record.itemId,
        operation: 'adopt',
        currentUser: currentUser.id,
      },
    });
    dispatch({
      type: 'cplist/changeVisible',
    });
  };
  // 修改
  handleModify = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'cplist/updateFormData',
      payload: {
        id: record.id,
        itemId: record.itemId,
        operation: 'modify',
      },
    });
    dispatch({
      type: 'cplist/changeVisible',
    });
  };
  // 撤销
  handleRevoke = record => {
    const { currentUser, dispatch } = this.props;
    dispatch({
      type: 'cplist/update',
      payload: {
        id: record.id,
        operation: 'revoke',
      },
    }).then(data => {
      if (data && data.code) {
        message.success('撤销成功');
        this.props.dispatch({
          type: 'cplist/fetch',
        });
      } else {
        message.error('撤销失败');
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
      type: 'cplist/changeSearchFormFields',
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
      type: 'cplist/changeSearchFormFields',
      payload: { pageNum },
    });
    this.doPageSearch();
  };

  handlePaginationSizeChange = (_, pageSize, pageNum = 1) => {
    this.props.dispatch({
      type: 'cplist/changeSearchFormFields',
      payload: { pageNum, pageSize },
    });
    this.doPageSearch();
  };

  doPageSearch() {
    this.props.dispatch({
      type: 'cplist/fetch',
    });
  }

  render() {
    const { data } = this.props.cplist;
    const { currentUser, userSd, chemicalSd } = this.props;
    const { menuVal, recordInfo, visible } = this.state;

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
      modify: record => (
        <Tooltip title="申请修改">
          <Icon
            type="edit"
            onClick={() => this.handleModify(record)}
            style={{ fontSize: 20, color: '#6abf47', cursor: 'pointer' }}
          />
        </Tooltip>
      ),
      revoke: record => (
        <Tooltip title="撤销">
          <Popconfirm
            placement="topRight"
            title="要撤销当前申请/采购吗？"
            onConfirm={() => this.handleRevoke(record)}
          >
            <Icon type="delete" style={{ fontSize: 20, color: '#ff3673', cursor: 'pointer' }} />
          </Popconfirm>
        </Tooltip>
      ),
      storage: record => (
        <Tooltip title="入库登记">
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
        title: '药品名称',
        render: record => chemicalSd[record.itemId],
      },
      {
        title: '采购数量',
        dataIndex: 'itemNum',
      },
      {
        title: '紧急度',
        dataIndex: 'urgency',
        render: urgency => {
          if (urgency == 1) {
            return (
              <Tag color="#F5222D" style={{ height: '100%', float: 'center' }}>
                {type[urgency]}
              </Tag>
            );
          } else {
            return (
              <Tag color="#1890FF" style={{ height: '100%', float: 'center' }}>
                {type[urgency]}
              </Tag>
            );
          }
        },
      },
      {
        title: '申请人',
        render: record => userSd[record.applicantId],
      },
      {
        title: '进度',
        dataIndex: 'state',
        render: state => {
          switch (state) {
            case -2:
              return '已撤销';
            case -1:
              return '未通过';
            case 0:
              return '申请中';
            case 1:
              return '采购中';
            case 2:
              return '已完成';
            default:
              return '其它';
          }
        },
      },
      {
        title: '操作',
        render: record => (
          <div>
            {optButton.detail(record)}
            {record.state === 0 && currentUser.identity === '3' ? (
              <span>
                {optButton.divider()}
                {optButton.adopt(record)}
              </span>
            ) : null}
            {record.state === 0 && currentUser.id === record.applicantId ? (
              <span>
                {optButton.divider()}
                {optButton.modify(record)}
                {optButton.divider()}
                {optButton.revoke(record)}
              </span>
            ) : null}
            {record.state === 1 ? (
              <span>
                {optButton.divider()}
                {optButton.storage(record)}
              </span>
            ) : null}
            {record.state === 1 && currentUser.identity === '3' ? (
              <span>
                {optButton.divider()}
                {optButton.revoke(record)}
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
        <CPListForm />
        <Card title="采购列表">
          <CPListSearch />
          <div style={{ marginTop: 15, marginBottom: 15 }}>
            <Button type="dashed">刷新</Button>
            <RadioGroup
              style={{ float: 'right' }}
              value={menuVal}
              onChange={e => this.handleRadioGroup(e)}
            >
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="apply">申请中</RadioButton>
              <RadioButton value="purchase">采购中</RadioButton>
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
        <Modal
          title="药品采购详情"
          visible={visible}
          onOk={() => {
            this.setState({
              visible: false,
            });
          }}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          <div>
            <Row style={{ marginBottom: 15 }}>
              <Col md={12} sm={24}>
                <span>药品名称：{chemicalSd[recordInfo.itemId]}</span>
              </Col>
              <Col md={12} sm={24}>
                <span>申请人：{userSd[recordInfo.applicantId]}</span>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col md={12} sm={24}>
                <span>采购数量：{recordInfo.itemNum}</span>
              </Col>
              <Col md={12} sm={24}>
                <span>紧急程度：{type[recordInfo.urgency]}</span>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col md={12} sm={24}>
                <span>提交时间：{recordInfo.submitTime}</span>
              </Col>
              <Col md={12} sm={24}>
                <span>
                  当前进度：
                  {recordInfo.state == -2
                    ? '已撤销'
                    : recordInfo.state == -1
                    ? '未通过'
                    : recordInfo.state == 0
                    ? '申请中'
                    : recordInfo.state == 1
                    ? '采购中'
                    : recordInfo.state == 2
                    ? '已完成'
                    : '其它'}
                </span>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col md={12} sm={24}>
                <span>审批人：{userSd[recordInfo.adoptId] || '暂无'}</span>
              </Col>
              <Col md={12} sm={24}>
                <span>审批时间：{recordInfo.adoptTime || '暂无'}</span>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col md={12} sm={24}>
                <span>入库人：{userSd[recordInfo.storageId] || '暂无'}</span>
              </Col>
              <Col md={12} sm={24}>
                <span>入库时间：{recordInfo.storageTime || '暂无'}</span>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col md={12} sm={24}>
                <span>入库数量：{recordInfo.storageNum || '暂无'}</span>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}
