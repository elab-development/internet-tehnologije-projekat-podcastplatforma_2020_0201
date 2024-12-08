// src/store/reducers/index.ts

import { combineReducers } from 'redux';
import { welcomeReducer } from './welcomeReducer'; // Import your reducer
import { appReducer } from './appRed';

const rootReducer = combineReducers({
  welcome: welcomeReducer,
  appRed: appReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
