import {
    ApolloReducerConfig,
    defaultDataIdFromObject,
    HeuristicFragmentMatcher,
    InMemoryCache,
} from 'apollo-cache-inmemory';

import { reduxNormalizedCacheFactory } from './reduxNormalizedCache';

const defaultConfig: ApolloReducerConfig = {
    fragmentMatcher: new HeuristicFragmentMatcher(),
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
    storeFactory: reduxNormalizedCacheFactory,
};

export class ReduxCache extends InMemoryCache {
    constructor(config: ApolloReducerConfig = {}) {
        super({ ...defaultConfig, ...config });
    }
}
