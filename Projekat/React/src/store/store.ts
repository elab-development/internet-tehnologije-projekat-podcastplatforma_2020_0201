import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['welcome', 'appRed'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

// Combine enhancers
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storeEnhancers = composeEnhancers(
  applyMiddleware(sagaMiddleware)
);

const store = createStore(
  persistedReducer,
  storeEnhancers
);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export { store, persistor };
