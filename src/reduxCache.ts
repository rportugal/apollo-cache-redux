import { Cache, DataProxy, ApolloCache, Transaction } from 'apollo-cache';
import { 
    ApolloReducerConfig,
    defaultDataIdFromObject,
    defaultNormalizedCacheFactory,
    HeuristicFragmentMatcher,
    NormalizedCacheObject
} from 'apollo-cache-inmemory';

const defaultConfig: ApolloReducerConfig = {
    fragmentMatcher: new HeuristicFragmentMatcher(),
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
    storeFactory: defaultNormalizedCacheFactory,
  };
  
export class ReduxCache extends ApolloCache<NormalizedCacheObject> {
    constructor(config: ApolloReducerConfig = {}) {
        super();
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
        throw new Error(`read() is not implemented on Redux Cache`);
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