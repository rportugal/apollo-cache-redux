import { ReduxNormalizedCache, ReduxNormalizedCacheConfig } from '../reduxNormalizedCache';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { apolloReducer } from "../reducer";
import { combineReducers, createStore } from "redux";

describe('ReduxNormalizedCache', () => {
    function createCache({
        initialState
    }: {
            initialState?: any;
        } = {}, ): ReduxNormalizedCache {
        const store = createStore(
            combineReducers({
                apollo: apolloReducer
            })
        );

        return new ReduxNormalizedCache({ store });
    }

    it('should create an empty cache', () => {
        const cache = createCache();
        expect(cache.toObject()).toEqual({});
    });

    it('should .replace() the store', () => {
        const contents: NormalizedCacheObject = { a: {} };
        const cache = createCache();
        cache.replace(contents);
        expect(cache.toObject()).toEqual(contents);
    });

    it(`should .get() an object from the store by dataId`, () => {
        const contents: NormalizedCacheObject = { a: {} };
        const cache = createCache();
        cache.replace(contents);
        expect(cache.get('a')).toBe(contents.a);
    });

    it(`should .set() an object from the store by dataId`, () => {
        const obj = {};
        const cache = createCache();
        cache.set('a', obj);
        expect(cache.get('a')).toEqual(obj);
    });

    it(`should .clear() the store`, () => {
        const obj = {};
        const cache = createCache();
        cache.set('a', obj);
        cache.clear();
        expect(cache.get('a')).toBeUndefined();
    });
});
