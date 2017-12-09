import {
    ApolloReducerConfig,
    InMemoryCache,
} from 'apollo-cache-inmemory';

import {
    ReduxCacheConfig,
    reduxNormalizedCacheFactory
} from './reduxNormalizedCache';

export class ReduxCache extends InMemoryCache {
    constructor(config: ApolloReducerConfig = {}, reduxCacheConfig: ReduxCacheConfig) {
        super(config);
        // Overwrite the in-memory data object
        this.data = reduxNormalizedCacheFactory({}, reduxCacheConfig);
    }
}
