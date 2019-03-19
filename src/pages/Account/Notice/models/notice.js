import { queryNotice, deleteNotice, updateNotice } from '@/services/api';
import { pagination, formatObj } from '@/utils/utils';

const searchData = pagination({
  acceptId: '', // 接收人
  identity: '', // 接收人权限
  state: [], // 状态
  type: [], // 类别
});

export default {
  namespace: 'notice',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    searchData,
  },

  effects: {
    *fetch(_, { call, put, select }) {
      const params = yield select(state => state.notice.searchData);
      const response = yield call(queryNotice, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *update({ payload }, { call }) {
      const response = yield call(updateNotice, payload);
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(deleteNotice, payload);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.list,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: parseInt(action.payload.pageNum, 10),
          },
        },
      };
    },
    changeSearchFormFields(state, { payload }) {
      const data = payload || searchData;
      return {
        ...state,
        searchData: {
          ...state.searchData,
          pageNum: 1,
          ...data,
        },
      };
    },
  },
};
