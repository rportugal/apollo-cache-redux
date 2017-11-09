import { Cache, DataProxy, ApolloCache, Transaction } from 'apollo-cache';
import { 
    ApolloReducerConfig,
    defaultDataIdFromObject,
    defaultNormalizedCacheFactory,
    HeuristicFragmentMatcher,
    NormalizedCache,
    NormalizedCacheObject
} from 'apollo-cache-inmemory';

const defaultConfig: ApolloReducerConfig = {
    fragmentMatcher: new HeuristicFragmentMatcher(),
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
    storeFactory: defaultNormalizedCacheFactory,
  };
  
export class ReduxCache extends ApolloCache<NormalizedCacheObject> {
    private data: NormalizedCache;
    private config: ApolloReducerConfig;
    public initialState: any;
    private addTypename: boolean;
    constructor(config: ApolloReducerConfig = {}) {
        super();

        this.data = this.config.storeFactory();
    }

    public restore(data: NormalizedCacheObject): this {
        throw new Error(`restore() is not implemented on Redux Cache`);
    }

    public extract(optimistic: boolean = false): NormalizedCacheObject {
        throw new Error(`extract() is not implemented on Redux Cache`);
    }

    public read<T>(query: Cache.ReadOptions): T | null {
        throw new Error(`read() is not implemented on Redux Cache`);
    }

    public write(write: Cache.WriteOptions): void {
        throw new Error(`write() is not implemented on Redux Cache`);

        // writeResultToStore({
        //     dataId: write.dataId,
        //     result: write.result,
        //     extensions: write.extensions,
        //     variables: write.variables,
        //     document: this.transformDocument(write.query),
        //     store: this.data,
        //     dataIdFromObject: this.config.dataIdFromObject,
        //     fragmentMatcherFunction: this.config.fragmentMatcher.match,
        //   });
      
        //   this.broadcastWatches();

        //   this.store.dispatch({
        //     type: 'APOLLO_QUERY_RESULT_CLIENT',
        //     result: { data: storeResult },
        //     variables,
        //     document: queryDoc,
        //     operationName: getOperationName(queryDoc),
        //     complete: !shouldFetch,
        //     queryId,
        //     requestId,
        //   });
    }

    public diff<T>(query: Cache.DiffOptions): Cache.DiffResult<T> {
        throw new Error(`diff() is not implemented on Redux Cache`);
    }

    public watch(watch: Cache.WatchOptions): () => void {
        throw new Error(`watch() is not implemented on Redux Cache`);
    }

    public evict(query: Cache.EvictOptions): Cache.EvictionResult {
        throw new Error(`evict() is not implemented on Redux Cache`);
    }

    public reset(): Promise<void> {
        throw new Error(`reset() is not implemented on Redux Cache`);
    }

    public removeOptimistic(id: string) {
        throw new Error(`removeOptimistic() is not implemented on Redux Cache`);
    }

    public performTransaction(transaction: Transaction<NormalizedCacheObject>) {
        throw new Error(`performTransaction() is not implemented on Redux Cache`);
    }

    public recordOptimisticTransaction(transaction: Transaction<NormalizedCacheObject>, id: string) {
        throw new Error(`recordOptimisticTransaction() is not implemented on Redux Cache`);
    }
}