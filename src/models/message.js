import { queryMessage, addReplyMessage, delMessage, getMessageDetail } from '../services/api';


export default {
    namespace: 'message',

    state: {
        messageList: [],
        total: 0,
        messageDetail: {
            avatar: 'user',
            content: '留言',
            reply_list: [],
            create_time: '2020-2-29T20:20:20.761Z',
            email: '1725210731',
            id: 15,
            introduce: 'introduce',
            name: 'Lee',
            phone: '18666319044',
            state: 0,
            updata_time: '2020-2-29T20:20:20.761Z',
            user_id: '5bd9a84c2758be723f5ef2cb',
            __v: 0,
            _id: '5bd9a84c2758be723f5ef2cb',
        },
    },

    effects: {
        *queryMessage({ payload }, {call, put}){
            const { resolve, params } = payload;
            const response = yield call(queryMessage, params);
            !!resolve && resolve(response);
            // console.log('response: ', response);
            if(response.code === 0){
                yield put({
                    type: 'saveMessageList',
                    payload: response.data.list,
                });
                yield put({
                    type: 'saveMessageListTotal',
                    payload: response.data.count,
                });
            }
        },
        *addReplyMessage({ payload }, { call, put }){
            const { resolve, params } = payload;
            const response = yield call(addReplyMessage, params);
            console.log('model/response: ', response);
            !!resolve && resolve(response); 
        },
        *delMessage({ payload }, { call, put }){
            const { resolve, params } = payload;
            const response = yield call(delMessage, params);
            !!resolve && resolve(response);
        },
        *getMessageDetail({ payload }, { call, put }){
            const { resolve, params } = payload;
            const response = yield call(getMessageDetail, params);
            !!response && resolve(response);
            console.log('reponse: ', response);
            if(response.code === 0){
                yield put({
                    type: 'saveMessageDetail',
                    payload: response.data,
                })
            }
        }
    },

    reducers: {
        saveMessageList(state, { payload }){
            return {
                ...state,
                messageList: payload,
            }
        },
        saveMessageListTotal(state, { payload }){
            return {
                ...state,
                total: payload,
            }
        },
        saveMessageDetail(state, { payload }){
            return {
                ...state,
                messageDetail: payload,
            }
        }
    }
}
