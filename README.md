[![CircleCI](https://circleci.com/gh/rportugal/apollo-cache-redux.svg?style=svg)](https://circleci.com/gh/rportugal/apollo-cache-redux)

`apollo-cache-redux` is a cache implementation backed by Redux for Apollo Client 2.0. 
It heavily reuses cache normalization code from `apollo-cache-inmemory`. 
 
# Installation
```javascript
npm install apollo-cache-redux --save
```

After installing the package:
```js
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import { HttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';

const store = createStore(
    combineReducers({
        apollo: apolloReducer
        ...otherReducers
    })
);

const cache = new ReduxCache({}, { store });

const client = new ApolloClient({
  link: new HttpLink(),
  cache
});
```

The first argument allows you to customise options passed to the underlying `InMemoryCache` (e.g. `fragmentMatcher`).
The second argument will take an optional Redux `store`, and an optional `reduxRootSelector`, which customises the reducer name for the cache (default: `apollo`).
If you don't want to pass in an existing store `ReduxCache` will create one for you.

# Tests
Apart from the unit tests in this repo, this cache implementation was tested with the `apollo-client` and `react-apollo` end-to-end tests. 
Until there's a better way to bring them to this repo, they will reside in their own branches of these projects:
* https://github.com/rportugal/apollo-client/tree/cache_tester
* https://github.com/rportugal/react-apollo/tree/redux_cache_tests
