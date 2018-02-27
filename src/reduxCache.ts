import {
    Cache,
} from 'apollo-cache';
import {
    ApolloReducerConfig,
    InMemoryCache,
    writeResultToStore
} from 'apollo-cache-inmemory';

import {
    ReduxNormalizedCacheConfig,
    reduxNormalizedCacheFactory
} from './reduxNormalizedCache';
import {cloneDeep} from 'lodash';

export type ReduxCacheConfig = ApolloReducerConfig & ReduxNormalizedCacheConfig;

export class ReduxCache extends InMemoryCache {
    constructor(config: ReduxCacheConfig) {
        super(config);
        // Overwrite the in-memory data object
        this.data = reduxNormalizedCacheFactory(config);
    }

    public write(write: Cache.WriteOptions): void {
        const data = this.config.storeFactory(cloneDeep(this.data.toObject()));

        writeResultToStore({
            dataId: write.dataId,
            result: write.result,
            variables: write.variables,
            document: this.transformDocument(write.query),
            store: data,
            dataIdFromObject: this.config.dataIdFromObject,
            fragmentMatcherFunction: this.config.fragmentMatcher.match,
        });


        this.data.replace(data.toObject());
        this.broadcastWatches();
    }
}
