import { merge, cloneDeep } from 'lodash';
import { Reducer } from 'redux';
import {
    APOLLO_OVERWRITE,
    APOLLO_RESET,
    APOLLO_WRITE
} from "./constants";

const initialState: any = {};

export function apolloReducer(state = initialState, action: any): Reducer<any> {
    switch(action.type) {
        case APOLLO_RESET:
            return initialState;
        case APOLLO_OVERWRITE:
            return action.data;
        case APOLLO_WRITE:
            const newObj = cloneDeep(state);
            return merge(newObj, action.data);
        default:
            return state;
    }
}
