import {
    ApolloReducerConfig,
    InMemoryCache,
} from 'apollo-cache-inmemory';

import {
    ReduxNormalizedCacheConfig,
    reduxNormalizedCacheFactory
} from './reduxNormalizedCache';

export type ReduxCacheConfig = ApolloReducerConfig & ReduxNormalizedCacheConfig;

export class ReduxCache extends InMemoryCache {
    constructor(config: ReduxCacheConfig = {}) {
        super(config);
        // Overwrite the in-memory data object
        this.data = reduxNormalizedCacheFactory({}, config);
    }
}
