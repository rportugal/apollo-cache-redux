import { merge } from 'lodash';

import {
    APOLLO_RESET,
    APOLLO_RESTORE,
    APOLLO_WRITE
} from "./constants";

const initialState = {};

export function apolloReducer(state = initialState, action: any) {
    switch(action.type) {
        case APOLLO_RESET:
            return initialState;
        case APOLLO_RESTORE:
            return action.data;
        case APOLLO_WRITE:
            return merge(state, action.data);
        default:
            return state;
    }
}
