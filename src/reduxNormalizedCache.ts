import {
    NormalizedCache,
    NormalizedCacheObject,
    StoreObject
} from 'apollo-cache-inmemory';
import {
    APOLLO_OVERWRITE,
    APOLLO_RESET,
    APOLLO_WRITE
} from "./constants";
import {
    Store
} from "redux";

export interface ReduxNormalizedCacheConfig {
    reduxRootSelector?: string
    store: Store<any>
}

export class ReduxNormalizedCache implements NormalizedCache {
    private store: Store<any>;
    private reduxRootSelector: string;

    constructor(reduxCacheConfig: ReduxNormalizedCacheConfig) {
        this.reduxRootSelector = reduxCacheConfig.reduxRootSelector || 'apollo';
        this.store = reduxCacheConfig.store;
    }
    public toObject(): NormalizedCacheObject {
        return this.getReducer();
    }
    public get(dataId: string): StoreObject {
        return this.getReducer()[dataId];
    }
    public set(dataId: string, value: StoreObject) {
        this.store.dispatch({
            type: APOLLO_WRITE,
            data: { [dataId]: value }
        });
    }
    public delete(dataId: string): void {
        this.store.dispatch({
            type: APOLLO_WRITE,
            data: { [dataId]: undefined }
        });
    }
    public clear(): void {
        this.store.dispatch({
            type: APOLLO_RESET,
        });
    }
    public replace(newData: NormalizedCacheObject): void {
        const data = newData || {};
        this.store.dispatch({
            type: APOLLO_OVERWRITE,
            data
        });
    }
    private getReducer(): any {
        return this.store.getState()[this.reduxRootSelector];
    }
}

export function reduxNormalizedCacheFactory(
    reduxCacheConfig?: ReduxNormalizedCacheConfig
): NormalizedCache {
    return new ReduxNormalizedCache(reduxCacheConfig);
}
