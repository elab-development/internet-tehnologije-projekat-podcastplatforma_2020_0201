// src/store/sagas/welcomeSaga.ts

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { loginUser, setLoginRes, setRegisterResponse, setTPS, setUsersToApprove } from '../actions/welcomeActions';
import { setApiCallError } from '../actions/appActions';

const API_URL = 'http://localhost:8000/api/';

interface LoginResponse {
    token: string;
    user: any;
}

interface RegisterResponse{
    message?: string;
    user?: any;
    token?: any;
}

interface PasswordChangeResponse {
    message : string;
}

interface ErrorResponse {
  error: string;
}

function* loginSaga(action: any) {
  try {
    const { email, password } = action.payload;
    const response: AxiosResponse<LoginResponse> = yield call(axios.post, `${API_URL}login`, { email, password });

    if (response.status === 200) {
      const { token, user } = response.data;
      yield(put(setLoginRes(response.status.toString())));
      let userToLog = {...user, 'token' : token};
      yield put(loginUser(userToLog));
    }
  } 
  catch (error) {
    if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;
        yield put(setLoginRes(status.toString()));
      } else {
        yield put(setLoginRes('Unknown error occurred'));
      }
  
  }
}

function* registerSaga(action:any){
  try {
      const { email, name, password, password_confirmation, role } = action.payload;
      const response: AxiosResponse<RegisterResponse> = yield call(axios.post, `${API_URL}register`, { email, name, password,password_confirmation,role });
      if (response.status === 201) {
          const {message, user, token} = response.data;
          if (message){
              yield put(setRegisterResponse("Morate sačekati da naši administratori odobre registraciju."));
          }
          else if (user && token){
              yield(put(setRegisterResponse("REGISTROVANI STE")));
          }
      }
    } 
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          yield put(setRegisterResponse("REGISTRACIJA NEUSPESNA"));
      }  else {
          yield put(setRegisterResponse('Unknown error occurred'));
        }
    
    }  
}

function * changePasswordSaga(action: any){
    try {
        const { email, name, new_password, new_password_confirmation } = action.payload;
        const response: AxiosResponse<PasswordChangeResponse> = yield call(axios.put, `${API_URL}change-password`, { email, name, new_password,new_password_confirmation });
        if (response.status === 200) {
            yield put(setLoginRes("P201"));
        }
      } 
      catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const { status } = error.response;
            yield put(setLoginRes(`P${status}`));
        }  else {
            yield put(setLoginRes('Unknown error occurred'));
          }
      
      }  
}


export default function* welcomeSaga() {
  yield takeEvery('LOGIN_REQUEST', loginSaga);
  yield takeEvery('CHANGE_PASSWORD', changePasswordSaga);
  yield takeEvery('REGISTER_USER', registerSaga);

}
