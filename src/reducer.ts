import { APOLLO_RESET, APOLLO_STORE_WRITE } from "./constants";
const initialState = {};

export function apolloReducer(state = initialState, action: any) {
    switch(action.type) {
        case APOLLO_RESET:
            return initialState;
        case APOLLO_STORE_WRITE:
            return { ...state, ...action.data.data };
        default:
            return state;
    }
}
