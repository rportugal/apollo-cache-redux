import { apolloReducer } from '../reducer';
import {APOLLO_RESET, APOLLO_OVERWRITE, APOLLO_WRITE} from "../constants";

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

    it('handles APOLLO_OVERWRITE', () => {
        const state = {
            existing: 'stuff'
        };

        const action = {
            type: APOLLO_OVERWRITE,
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
