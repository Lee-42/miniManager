import { queryUser, addUSer, updateUser, delUser } from '../services/api';

export default {
    namespace: 'otherUser',

    state: {
        userList: [],
        total: 0,
    },

    reducers: {
        saveUserList(state, { payload }){
            return {
                ...state,
                userList: payload,
            };
        },
        saveUserListTotal(state, { payload }){
            return {
                ...state,
                total: payload,
            }
        }
    },

    effects: {
        *queryUser({ payload }, { call, put }) {
            const { resolve, params } = payload;
            // console.log(params);
            const response = yield call(queryUser, params);
			// console.log('response :', response)
			!!resolve && resolve(response); // 返回数据
			if (response.code === 0) {
				yield put({
					type: 'saveUserList',
					payload: response.data.list,
				});
				yield put({
					type: 'saveUserListTotal',
					payload: response.data.count,
				});
			} else {
				// 
			}
        },
        *delUser({ payload }, { call, put }) {
            const { resolve, params } = payload;
            const  response = yield call(delUser, params);
            !!resolve && resolve(response);
        }
    },
}