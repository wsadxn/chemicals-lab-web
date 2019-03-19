import {
  queryInstrument,
  deleteInstrument,
  checkInstrumentCode,
  updateInstrument,
  getInstrumentSd,
} from '@/services/api';
import {
  pagination, formatObj,
} from '@/utils/utils';

const searchData = pagination({
  name: '',  // 仪器名称
  code: '',  // 仪器编码
  type: '',  // 仪器分类
});

const formData = {
  id: '',  // 仪器id
  code: '',  // 编码
  name: '',  // 名称
  type: [],  // 分类
  number: '',  // 数量
  threshold: '',  // 阈值
  guild: '',  // 操作指南
};

export default {
  namespace: 'instrument',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    searchData,  
    formData,
    visible: false,
    instrumentSd: {},
    instrumentNum: {},
  },

  effects: {
    *fetch(_, { call, put, select}) {
      const params = yield select(state => state.instrument.searchData);
      const response = yield call(queryInstrument, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *checkCode({ payload }, { call, select }) {
      const params = yield select(state => state.instrument.formData.id);
      const response = yield call(checkInstrumentCode, {
        id: params,
        code: payload,
      });
      return response;
    },
    *update({ payload }, { call, select }) {
      const params = yield select(state => state.instrument.formData);
      const response = yield call(updateInstrument, {
        ...params,
        ...payload,
      });
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(deleteInstrument, payload);
      return response;
    },
    *getInstrumentSd(_, { call, put }) {
      const response = yield call(getInstrumentSd);
      const list = response.data || [];
      const data = {};
      list.map((value) => {
        data[value.id] = value.name;
      });
      yield put({
        type: 'saveInstrumentSd',
        payload: data,
      });
    },
    *getInstrumentNum(_, { call, put }) {
      const response = yield call(getInstrumentNum);
      const list = response.data || {};
      yield put({
        type: 'saveInstrumentNum',
        payload: list,
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
            current: parseInt(action.payload.pageNum,10),
          }
        },
      };
    },
    saveInstrumentSd(state, action) {
      return {
        ...state,
        instrumentSd: action.payload,
      }
    },
    saveInstrumentNum(state, action) {
      return {
        ...state,
        instrumentNum: action.payload,
      }
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
