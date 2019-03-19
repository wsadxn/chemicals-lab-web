import {
  queryChemicals,
  deleteChemicals,
  checkChemicalsCode,
  updateChemicals,
  getChemicalSd,
  getChemicalsNum,
} from '@/services/api';
import {
  pagination, formatObj,
} from '@/utils/utils';

const searchData = pagination({
  name: '',  // 药品名称
  code: '',  // 药品编码
  type: '',  // 药品分类
});

const formData = {
  id: '',  // 药品id
  code: '',  // 编码
  name: '',  // 名称
  type: [],  // 分类
  number: '',  // 数量
  unit: '',  // 单位
  threshold: '',  // 阈值
  guild: '',  // 操作指南
};

export default {
  namespace: 'chemicals',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    searchData,  
    formData,
    visible: false,
    chemicalSd: {},
    chemicalsNum: {},
  },

  effects: {
    *fetch(_, { call, put, select}) {
      const params = yield select(state => state.chemicals.searchData);
      const response = yield call(queryChemicals, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *checkCode({ payload }, { call, select }) {
      const params = yield select(state => state.chemicals.formData.id);
      const response = yield call(checkChemicalsCode, {
        id: params,
        code: payload,
      });
      return response;
    },
    *update({ payload }, { call, select }) {
      const params = yield select(state => state.chemicals.formData);
      const response = yield call(updateChemicals, {
        ...params,
        ...payload,
      });
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(deleteChemicals, payload);
      return response;
    },
    *getChemicalSd(_, { call, put }) {
      const response = yield call(getChemicalSd);
      const list = response.data || [];
      const data = {};
      list.map((value) => {
        data[value.id] = value.name;
      });
      yield put({
        type: 'saveChemicalSd',
        payload: data,
      });
    },
    *getChemicalsNum(_, { call, put }) {
      const response = yield call(getChemicalsNum);
      const list = response.data || [];
      const data = {};
      list.map((value) => {
        data[value.id] = value.number;
      });
      yield put({
        type: 'saveChemicalsNum',
        payload: data,
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
    saveChemicalSd(state, action) {
      return {
        ...state,
        chemicalSd: action.payload,
      }
    },
    saveChemicalsNum(state, action) {
      return {
        ...state,
        chemicalsNum: action.payload,
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
