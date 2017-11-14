import * as merge from 'deepmerge';
import {
    APOLLO_RESET,
    APOLLO_RESTORE,
    APOLLO_STORE_WRITE
} from "./constants";

const initialState = {};

export function apolloReducer(state = initialState, action: any) {
    switch(action.type) {
        case APOLLO_RESET:
            return initialState;
        case APOLLO_RESTORE:
            return action.data;
        case APOLLO_STORE_WRITE:
            return merge(state, action.data);
        default:
            return state;
    }
}
