import { routerRedux } from 'dva/router';
import { addOrder, queryOrder, updateOrder, getUnusedInsNum } from '@/services/api';
import { pagination, formatObj } from '@/utils/utils';

const searchData = pagination({
  id: '',
  applicantId: [], // 申请人id
  orderDate: [], // 使用时间
  submitTime: [], // 申请时间
  state: [], // 状态
});

const formData = {
  applicantId: '',
  orderDate: '',
  orderTime: [],
  chemicalsNum: '',
  instrumentNum: '',
  itemsId: {
    chemicals: [],
    instrument: [],
  },
  itemsNum: {
    chemicals: [],
    instrument: [],
  },
};

const listFormData = {
  operation: '', // 操作类别
  currentUser: '', // 操作人id
  record: {}, // record
};

export default {
  namespace: 'order',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    result: '',
    formData,
    unUsedInsNum: {},
    listFormData,
    searchData,
    record: {},
    visible: false,
    listVisible: false,
  },

  effects: {
    *fetch(_, { call, put, select }) {
      const params = yield select(state => state.order.searchData);
      const response = yield call(queryOrder, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *submitStepForm(_, { select, call, put }) {
      const params = yield select(state => state.order.formData);
      const response = yield call(addOrder, {
        applicantId: params.applicantId,
        orderDate: params.orderDate.format('YYYY-MM-DD'),
        orderTime: params.orderTime,
        itemsId: params.itemsId,
        itemsNum: params.itemsNum,
      });
      yield put({
        type: 'saveResult',
        payload: response.code,
      });
      return response;
    },
    *update({ payload }, { call }) {
      const response = yield call(updateOrder, payload);
      return response;
    },
    *getUnusedInsNum({ payload }, { call, put }) {
      const response = yield call(getUnusedInsNum, payload);
      yield put({
        type: 'saveUnusedInsNum',
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
    saveUnusedInsNum(state, action) {
      return {
        ...state,
        unUsedInsNum: action.payload,
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
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    updateFormData(state, { payload }) {
      const data = payload || formData;
      return {
        ...state,
        formData: {
          ...state.formData,
          ...data,
        },
      };
    },
    updateChemicalsItem(state, { payload }) {
      const data = payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          itemsId: {
            ...state.formData.itemsId,
            chemicals: data.itemsId,
          },
          itemsNum: {
            ...state.formData.itemsNum,
            chemicals: data.itemsNum,
          },
        },
      };
    },
    updateInstrumentItem(state, { payload }) {
      const data = payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          itemsId: {
            ...state.formData.itemsId,
            instrument: data.itemsId,
          },
          itemsNum: {
            ...state.formData.itemsNum,
            instrument: data.itemsNum,
          },
        },
      };
    },
    saveResult(state, { payload }) {
      return {
        ...state,
        result: payload,
      };
    },
    resetFormData(state) {
      return {
        ...state,
        formData,
      };
    },
    changeInfoVisible(state) {
      return {
        ...state,
        visible: !state.visible,
      };
    },
    updateRecord(state, { payload }) {
      return {
        ...state,
        record: {
          ...payload,
          itemsId: JSON.parse(payload.itemsId),
          itemsNum: JSON.parse(payload.itemsNum),
          backNum: payload.backNum ? JSON.parse(payload.backNum) : null,
        },
      };
    },
    updateListFormData(state, { payload }) {
      const data = payload || listFormData;
      return {
        ...state,
        listFormData: {
          ...data,
          record: {
            ...data.record,
            itemsId: data.record.itemsId ? JSON.parse(data.record.itemsId) : null,
            itemsNum: data.record.itemsNum ? JSON.parse(data.record.itemsNum) : null,
          },
        },
      };
    },
    changeListVisible(state) {
      return {
        ...state,
        listVisible: !state.listVisible,
      };
    },
  },
};
