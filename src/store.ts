export function createApolloStore({
    reduxRootKey = 'apollo',
    initialState,
    config = {},
    reportCrashes = true,
    logger,
  }: {
    reduxRootKey?: string,
    initialState?: any,
    config?: ApolloReducerConfig,
    reportCrashes?: boolean,
    logger?: Middleware,
  } = {}): ApolloStore {
    const enhancers: any[] = [];
    const middlewares: Middleware[] = [];
  
    if (reportCrashes) {
      middlewares.push(crashReporter);
    }
  
    if (logger) {
      middlewares.push(logger);
    }
  
    if (middlewares.length > 0) {
      enhancers.push(applyMiddleware(...middlewares));
    }
  
    // Dev tools enhancer should be last
    if (typeof window !== 'undefined') {
      const anyWindow = window as any;
      if (anyWindow.devToolsExtension) {
        enhancers.push(anyWindow.devToolsExtension());
      }
    }
  
    // XXX to avoid type fail
    const compose: (...args: any[]) => () => any = reduxCompose;
  
    // Note: The below checks are what make it OK for QueryManager to start from 0 when generating
    // new query IDs. If we let people rehydrate query state for some reason, we would need to make
    // sure newly generated IDs don't overlap with old queries.
    if ( initialState && initialState[reduxRootKey] && initialState[reduxRootKey]['queries']) {
      throw new Error('Apollo initial state may not contain queries, only data');
    }
  
    if ( initialState && initialState[reduxRootKey] && initialState[reduxRootKey]['mutations']) {
      throw new Error('Apollo initial state may not contain mutations, only data');
    }
  
    return createStore(
      combineReducers({ [reduxRootKey]: createApolloReducer(config) }),
      initialState,
      compose(...enhancers),
    );
  }
  
  