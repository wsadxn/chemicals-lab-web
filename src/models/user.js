import { queryUsers, queryCurrent, updateUserInfo, getUserSd, deleteUser } from '@/services/user';
import { fakeAccountLogin } from '@/services/api';
import { pagination, formatObj } from '@/utils/utils';

const searchData = pagination({
  name: '', // 用户名
  id: '', // 账号
  identity: [], // 权限
});

const formData = {
  id: '',
  identity: '',
};

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
    userSd: {},
    searchData,
    formData,
    visible: false,
  },

  effects: {
    *fetch(_, { call, put, select }) {
      const params = yield select(state => state.user.searchData);
      const response = yield call(queryUsers, formatObj(params));
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *updateUserInfo({ payload }, { call }) {
      const response = yield call(updateUserInfo, payload);
      return response;
    },
    *validPassword({ payload }, { call }) {
      const response = yield call(fakeAccountLogin, payload);
      return response;
    },
    *getUserSd({ payload }, { call, put }) {
      const response = yield call(getUserSd, payload);
      const list = response.data || [];
      const data = {};
      list.map(value => {
        data[value.id] = value.name;
      });
      yield put({
        type: 'saveUserSd',
        payload: data,
      });
    },
    *delete({ payload }, { call }) {
      const response = yield call(deleteUser, payload);
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data[0] || {},
      };
    },
    saveUserSd(state, action) {
      return {
        ...state,
        userSd: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
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
    changeVisible(state ) {
      return {
        ...state,
        visible: !state.visible,
      };
    },
  },
};
