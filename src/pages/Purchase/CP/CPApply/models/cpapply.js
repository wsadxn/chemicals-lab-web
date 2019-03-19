import {
  queryChemicals,
  addPurchase,
  getExistCount,
} from '@/services/api';
import {
  pagination, formatObj,
} from '@/utils/utils';

const searchData = pagination({
  name: '',  // 药品名称
  code: '',  // 药品编码
  status: [],  // 库存状态
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
  namespace: 'cpapply',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    searchData,  
    formData,
    visible: false,
  },

  effects: {
    *fetch(_, { call, put, select}) {
      const params = yield select(state => state.cpapply.searchData);
      const response = yield call(queryChemicals, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *addPurchase({ payload }, { call }) {
      const response = yield call(addPurchase, payload);
      return response;
    },
    *getExistCount({ payload }, { call }) {
      const response = yield call(getExistCount, payload);
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
            current: parseInt(action.payload.pageNum,10),
          }
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
