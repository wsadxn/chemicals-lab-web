import {
  queryPurchase,
  deleteChemicals,
  checkChemicalsCode,
  updatePurchase,
} from '@/services/api';
import {
  pagination, formatObj,
} from '@/utils/utils';

const searchData = pagination({
  itemId: [],  // 药品id
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
  namespace: 'cplist',

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
      const params = yield select(state => state.cplist.searchData);
      const response = yield call(queryPurchase, formatObj({
        ...params,
        type: 0,
      }));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *checkCode({ payload }, { call, select }) {
      const params = yield select(state => state.cplist.formData.id);
      const response = yield call(checkChemicalsCode, {
        id: params,
        code: payload,
      });
      return response;
    },
    *update({ payload }, { call }) {
      const response = yield call(updatePurchase, payload);
      return response;
    },
    *delete({ payload }, { call }) {
      const response = yield call(deleteChemicals, payload);
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
