import { queryInform, deleteInform, updateInform, getMonthNum } from '@/services/api';
import { pagination, formatObj } from '@/utils/utils';

const searchData = pagination({
  title: '', // 标题
  author: [], // 发布人
});

const formData = {
  id: '', // id
  title: '', // 标题
  content: '', // 内容
  author: '', // 发布人
};

export default {
  namespace: 'inform',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    monthNum: {},
    searchData,
    formData,
    visible: false,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const params = payload ? payload : yield select(state => state.inform.searchData);
      const response = yield call(queryInform, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *update({ payload }, { call, select }) {
      const params = yield select(state => state.inform.formData);
      const response = yield call(updateInform, {
        ...params,
        ...payload,
      });
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(deleteInform, payload);
      return response;
    },
    *getMonthNum(_, { call, put }) {
      const response = yield call(getMonthNum);
      yield put({
        type: 'saveMonthNum',
        payload: response.data,
      });
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
    saveMonthNum(state, action) {
      return {
        ...state,
        monthNum: action.payload,
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
    updateFormData(state, { payload }) {
      const data = payload || formData;
      return {
        ...state,
        formData: {
          ...data,
        },
      };
    },
    changeVisible(state) {
      return {
        ...state,
        visible: !state.visible,
      };
    },
  },
};
