import {
    Cache,
} from 'apollo-cache';
import {
    ApolloReducerConfig,
    InMemoryCache,
    NormalizedCacheObject,
    readQueryFromStore,
    writeResultToStore
} from 'apollo-cache-inmemory';
import { combineReducers, createStore, Store } from 'redux';
import {
    APOLLO_RESET,
    APOLLO_RESTORE,
    APOLLO_WRITE
} from "./constants";
import { apolloReducer } from './reducer';

export type ReduxCacheConfig = ApolloReducerConfig & {
    reduxRootSelector?: string
}

export class ReduxCache extends InMemoryCache {
    private store: Store<any>;
    private reduxRootSelector: string;

    constructor(config: ReduxCacheConfig = {}, store: Store<any> = undefined) {
        super(config);
        this.store = store || createStore(combineReducers({ apollo: apolloReducer } ));
        this.reduxRootSelector = 'apollo';
    }

    public restore(data: NormalizedCacheObject): this {
        this.store.dispatch({
            type: APOLLO_RESTORE,
            data
        });
        return this;
    }

    public extract(optimistic: boolean = false): NormalizedCacheObject {
        if (optimistic && this.optimistic.length > 0) {
            const patches = this.optimistic.map(opt => opt.data);
            return Object.assign(this.getReducer(), ...patches);
        }

        return this.getReducer();
    }

    public read<T>(query: Cache.ReadOptions): T | null {
        if (query.rootId && this.getReducer()[query.rootId] === undefined) {
            return null;
        }

        const options = {
            store: this.config.storeFactory(this.extract(query.optimistic)),
            query: this.transformDocument(query.query),
            variables: query.variables,
            rootId: query.rootId,
            fragmentMatcherFunction: this.config.fragmentMatcher.match,
            previousResult: query.previousResult,
            config: this.config,
        };
        return readQueryFromStore(options);
    }

    public write(write: Cache.WriteOptions): void {
        const data = this.config.storeFactory();

        writeResultToStore({
            dataId: write.dataId,
            result: write.result,
            variables: write.variables,
            document: this.transformDocument(write.query),
            store: data,
            dataIdFromObject: this.config.dataIdFromObject,
            fragmentMatcherFunction: this.config.fragmentMatcher.match,
        });

        this.store.dispatch({
            type: APOLLO_WRITE,
            data: data.toObject()
        });
        this.broadcastWatches();
    }

    public evict(query: Cache.EvictOptions): Cache.EvictionResult {
        throw new Error(`evict() is not implemented on Redux Cache`);
    }

    public reset(): Promise<void> {
        this.store.dispatch({
            type: APOLLO_RESET,
        });
        this.broadcastWatches();

        return Promise.resolve();
    }

    private getReducer(): any {
        return this.store.getState()[this.reduxRootSelector];
    }
}
