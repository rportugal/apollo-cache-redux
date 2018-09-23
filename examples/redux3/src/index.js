import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import gql from 'graphql-tag';
import 'cross-fetch/polyfill';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ApolloClient from 'apollo-boost';
import logger from 'redux-logger';

const GRAPHQL_ENDPOINT = 'https://graphql-pokemon.now.sh';
const EXAMPLE_QUERY = gql`
  {
    pokemon(name: "Pikachu") {
      id
      number
      name
      attacks {
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        weight {
          minimum
          maximum
        }
        attacks {
          fast {
            name
            type
            damage
          }
        }
      }
    }
  }
`;
const store = createStore(
  combineReducers({
    apollo: apolloReducer
  }),
  applyMiddleware(logger)
);

store.subscribe(() => {});
const cache = new ReduxCache({ store });

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache
});

client.query({ query: EXAMPLE_QUERY }).then(() => {
  console.log(store.getState());
});
