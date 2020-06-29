import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { connectRouter } from 'connected-react-router';

// types
import { History } from 'history';

// Reducers
import sampleReducer from 'modules/sample/reducer';

// Persist Config
const samplePersistConfig = { key: 'sample', blacklist: [], storage };

// reducers

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    sample: persistReducer(samplePersistConfig, sampleReducer),
  });
