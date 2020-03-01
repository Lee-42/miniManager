import { addProject, queryProject } from '../services/api';

export default {
    namespace: 'project',

    state: {
        notice: [],
        projectList: [],
        total: 0,
        projectDetail:{
            title: '',
            state: '',
            content: '',
            _id: '',
        },
    },

    effects: {
        *queryProject({ payload }, { call, put }) {
			const { resolve, params } = payload;
			const response = yield call(queryProject, params);
			!!resolve && resolve(response); // 返回数据
			// console.log('response :', response)
			if (response.code === 0) {
				yield put({
					type: 'saveProjectList',
					payload: response.data.list,
				});
				yield put({
					type: 'saveProjectListTotal',
					payload: response.data.count,
				});
			}
		},
        *addProject({ payload }, { call, put }){
            const { resolve, params } = payload;
            const response = yield call(addProject, params);
            !!resolve && resolve(response);
        }
    },

    reducers: {
        saveProjectList(state, { payload }) {
			return {
				...state,
				projectList: payload,
			};
		},
		saveProjectListTotal(state, { payload }) {
			return {
				...state,
				total: payload,
			};
		},
    }
}