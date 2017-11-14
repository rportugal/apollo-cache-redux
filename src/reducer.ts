import {
    APOLLO_RESET,
    APOLLO_RESTORE,
    APOLLO_STORE_WRITE
} from "./constants";
const initialState = {};

export function apolloReducer(state = initialState, action: any) {
    console.log('action');
    console.log(action);
    switch(action.type) {
        case APOLLO_RESET:
            return initialState;
        case APOLLO_RESTORE:
            return action.data;
        case APOLLO_STORE_WRITE:
            return { ...state, ...action.data.data };
        default:
            return state;
    }
}
