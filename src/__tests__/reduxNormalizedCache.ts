import { ReduxNormalizedCache } from '../reduxNormalizedCache';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

describe('ReduxNormalizedCache', () => {
    it('should create an empty cache', () => {
        const cache = new ReduxNormalizedCache();
        expect(cache.toObject()).toEqual({});
    });

    it('should .replace() the store', () => {
        const contents: NormalizedCacheObject = { a: {} };
        const cache = new ReduxNormalizedCache();
        cache.replace(contents);
        expect(cache.toObject()).toEqual(contents);
    });

    it(`should .get() an object from the store by dataId`, () => {
        const contents: NormalizedCacheObject = { a: {} };
        const cache = new ReduxNormalizedCache();
        cache.replace(contents);
        expect(cache.get('a')).toBe(contents.a);
    });

    it(`should .set() an object from the store by dataId`, () => {
        const obj = {};
        const cache = new ReduxNormalizedCache();
        cache.set('a', obj);
        expect(cache.get('a')).toEqual(obj);
    });

    it(`should .clear() the store`, () => {
        const obj = {};
        const cache = new ReduxNormalizedCache();
        cache.set('a', obj);
        cache.clear();
        expect(cache.get('a')).toBeUndefined();
    });
});
