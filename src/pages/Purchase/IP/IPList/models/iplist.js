import {
  queryPurchase,
  updatePurchase,
} from '@/services/api';
import {
  pagination, formatObj,
} from '@/utils/utils';

const searchData = pagination({
  itemId: [],  // 仪器id
  applicantId: [],  // 申请人id
  urgency: [],  // 紧急度
  state: '', // 状态
});

const formData = {
  id: '',  // 采购记录id
  itemId: '', // 物品id
  operation: '',  // 操作类别
  currentUser: '', // 操作人id
};

export default {
  namespace: 'iplist',

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
      const params = yield select(state => state.iplist.searchData);
      const response = yield call(queryPurchase, formatObj({
        ...params,
        type: 1,
      }));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *update({ payload }, { call }) {
      const response = yield call(updatePurchase, payload);
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
