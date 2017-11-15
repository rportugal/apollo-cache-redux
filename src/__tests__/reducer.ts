import { apolloReducer } from '../reducer';
import {APOLLO_RESET, APOLLO_RESTORE, APOLLO_WRITE} from "../constants";

describe('apollo reducer', () => {
    it('returns the initial state', () => {
       expect(apolloReducer(undefined, {})).toEqual({});
    });

    it('handles APOLLO_RESET', () => {
        const state = {
            some: 'stuff'
        };

        const action = {
            type: APOLLO_RESET
        };

        expect(apolloReducer(state, action)).toEqual({});
    });

    it('handles APOLLO_RESTORE', () => {
        const state = {};

        const action = {
            type: APOLLO_RESTORE,
            data: {
                some: 'stuff'
            }
        };

        expect(apolloReducer(state, action)).toEqual({ some: 'stuff' });
    });

    it('handles APOLLO_WRITE', () => {
        const state = {
            some: 'stuff'
        };

        const action = {
            type: APOLLO_WRITE,
            data: {
                more: 'stuff'
            }
        };

        expect(apolloReducer(state, action)).toEqual({
            some: 'stuff',
            more: 'stuff'
        });

    });

});
