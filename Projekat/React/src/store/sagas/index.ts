import { all } from 'redux-saga/effects';
import welcomeSaga from './welcomeSaga';
import appSaga from './appSaga';

export default function* rootSaga() {
  yield all([
    welcomeSaga(),  
    appSaga()
  ]);
}
