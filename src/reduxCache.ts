import {DocumentNode} from 'graphql';
import {
    Cache,
    ApolloCache,
    DataProxy,
    Transaction
} from 'apollo-cache';
import {
    ApolloReducerConfig,
    defaultDataIdFromObject,
    defaultNormalizedCacheFactory,
    diffQueryAgainstStore,
    HeuristicFragmentMatcher,
    // NormalizedCache,
    NormalizedCacheObject,
    OptimisticStoreItem,
    readQueryFromStore,
    // record,
    writeResultToStore
} from 'apollo-cache-inmemory';
import {
    APOLLO_RESET,
    APOLLO_RESTORE,
    APOLLO_STORE_WRITE
} from "./constants";
import {addTypenameToDocument, getFragmentQueryDocument} from 'apollo-utilities';

const defaultConfig: ApolloReducerConfig = {
    fragmentMatcher: new HeuristicFragmentMatcher(),
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
    storeFactory: defaultNormalizedCacheFactory,
  };

export class ReduxCache extends ApolloCache<NormalizedCacheObject> {
    private config: ApolloReducerConfig;
    private optimistic: OptimisticStoreItem[] = [];
    private watches: Cache.WatchOptions[] = [];
    private addTypename: boolean;
    private store: any;

    // Set this while in a transaction to prevent broadcasts...
    // don't forget to turn it back on!
    private silenceBroadcast: boolean = false;

    constructor(config: ApolloReducerConfig = {}, store: any) {
        super();
        this.config = { ...defaultConfig, ...config };
        this.store = store;
        this.addTypename = this.config.addTypename ? true : false;
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
            type: APOLLO_STORE_WRITE,
            data: data.toObject()
        });
        this.broadcastWatches();
    }

    public diff<T>(query: Cache.DiffOptions): Cache.DiffResult<T> {
        return diffQueryAgainstStore({
            store: this.config.storeFactory(this.extract(query.optimistic)),
            query: this.transformDocument(query.query),
            variables: query.variables,
            returnPartialData: query.returnPartialData,
            previousResult: query.previousResult,
            fragmentMatcherFunction: this.config.fragmentMatcher.match,
            config: this.config,
        });
    }

    public watch(watch: Cache.WatchOptions): () => void {
        this.watches.push(watch);

        return () => {
            this.watches = this.watches.filter(c => c !== watch);
        };
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

    // From inmemory
    public removeOptimistic(id: string) {
        // Throw away optimistic changes of that particular mutation
        const toPerform = this.optimistic.filter(item => item.id !== id);

        this.optimistic = [];

        // Re-run all of our optimistic data actions on top of one another.
        toPerform.forEach(change => {
            this.recordOptimisticTransaction(change.transaction, change.id);
        });

        this.broadcastWatches();
    }

    // From inmemory
    public performTransaction(transaction: Transaction<NormalizedCacheObject>) {
        // TODO: does this need to be different, or is this okay for an in-memory cache?

        let alreadySilenced = this.silenceBroadcast;
        this.silenceBroadcast = true;

        transaction(this);

        if (!alreadySilenced) {
            // Don't un-silence since this is a nested transaction
            // (for example, a transaction inside an optimistic record)
            this.silenceBroadcast = false;
        }

        this.broadcastWatches();
    }

    // From inmemory
    public recordOptimisticTransaction(
        transaction: Transaction<NormalizedCacheObject>,
        id: string,
    ) {
        throw new Error(`recordOptimisticTransaction() is not implemented on Redux Cache`);
        // this.silenceBroadcast = true;
        //
        // const patch = record(this.extract(true), recordingCache => {
        //     // swapping data instance on 'this' is currently necessary
        //     // because of the current architecture
        //     const dataCache = this.data;
        //     this.data = recordingCache;
        //     this.performTransaction(transaction);
        //     this.data = dataCache;
        // });
        //
        // this.optimistic.push({
        //     id,
        //     transaction,
        //     data: patch,
        // });
        //
        // this.silenceBroadcast = false;
        //
        // this.broadcastWatches();
    }

    // From inmemory
    public readQuery<QueryType>(
        options: DataProxy.Query,
        optimistic: boolean = false,
    ): QueryType {
        return this.read({
            query: options.query,
            variables: options.variables,
            optimistic,
        });
    }

    // From inmemory
    public readFragment<FragmentType>(
        options: DataProxy.Fragment,
        optimistic: boolean = false,
    ): FragmentType | null {
        return this.read({
            query: this.transformDocument(
                getFragmentQueryDocument(options.fragment, options.fragmentName),
            ),
            variables: options.variables,
            rootId: options.id,
            optimistic,
        });
    }

    // From inmemory
    public writeQuery(options: DataProxy.WriteQueryOptions): void {
        this.write({
            dataId: 'ROOT_QUERY',
            result: options.data,
            query: this.transformDocument(options.query),
            variables: options.variables,
        });
    }

    // From inmemory
    public writeFragment(options: DataProxy.WriteFragmentOptions): void {
        this.write({
            dataId: options.id,
            result: options.data,
            query: this.transformDocument(
                getFragmentQueryDocument(options.fragment, options.fragmentName),
            ),
            variables: options.variables,
        });
    }

    // From inmemory
    private broadcastWatches() {
        // Skip this when silenced (like inside a transaction)
        if (this.silenceBroadcast) return;

        // right now, we invalidate all queries whenever anything changes
        this.watches.forEach((c: Cache.WatchOptions) => {
            const newData = this.diff({
                query: c.query,
                variables: c.variables,

                // TODO: previousResult isn't in the types - this will only work
                // with ObservableQuery which is in a different package
                previousResult: (c as any).previousResult && c.previousResult(),
                optimistic: c.optimistic,
            });

            c.callback(newData);
        });
    }

    private getReducer(): any {
        return this.store.getState().apollo;
    }

    public transformDocument(document: DocumentNode): DocumentNode {
        if (this.addTypename) return addTypenameToDocument(document);
        return document;
    }
}
