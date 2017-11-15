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
import {
    APOLLO_RESET,
    APOLLO_RESTORE,
    APOLLO_WRITE
} from "./constants";

export class ReduxCache extends InMemoryCache {
    private store: any;

    constructor(config: ApolloReducerConfig = {}, store: any) {
        super(config);
        this.store = store;
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
        return this.store.getState().apollo;
    }
}
