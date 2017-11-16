[![CircleCI](https://circleci.com/gh/rportugal/apollo-cache-redux.svg?style=svg)](https://circleci.com/gh/rportugal/apollo-cache-redux)

# WIP - DO NOT USE IN PRODUCTION

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

const cache = new ReduxCache({ <extraOptions> }, store);

const client = new ApolloClient({
  link: new HttpLink(),
  cache
});
```
