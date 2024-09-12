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


function* getUsersToApprove(action:any){
  try {
      const token = action.payload;
      const response: AxiosResponse<any> = yield call(axios.get, `${API_URL}admin/approve-users`, {
          headers: {
              'Authorization': `Bearer ${token}`,
          }
      });
      if (response.status === 200) {
        yield put(setUsersToApprove(response.data.users));
        yield put(setApiCallError("OK"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        yield put(setApiCallError(errorData.error));
      } else {
        yield put(setApiCallError(axiosError.message));
      }
    }
}

function* approveUserSaga(action: any) {
  try {
    const {email, token} = action.payload;
    const response: AxiosResponse<any> = yield call(axios.post, `${API_URL}admin/approve-user/${email}`, {
      email: email
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (response.status === 201) {
      alert("User approved!");
      window.location.reload();
      yield put(setApiCallError("OK"));
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      const errorData = axiosError.response.data as ErrorResponse;
      yield put(setApiCallError(errorData.error));
      alert(`Failed to like podcast: ${errorData.error}`);
    } else {
      yield put(setApiCallError(axiosError.message));
      alert(`Failed to like podcast: ${axiosError.message}`);
    }
  }
}

function* rejectUserToApprove(action:any){
  try{
    const { email, token } = action.payload;
    const response: AxiosResponse<any> = yield call(axios.delete, `${API_URL}admin/reject-user/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      yield put(setApiCallError("OK"));
      alert("Rejected!");
      window.location.reload();
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      const errorData = axiosError.response.data as ErrorResponse;
      yield put(setApiCallError(errorData.error));
    } else {
      yield put(setApiCallError(axiosError.message));
    }
  }

}
function* getTrendingPodcasts(action: any) {
  try {
    const response: AxiosResponse<any> = yield call(axios.get, `${API_URL}trending-podcasts`);

    if (response.status === 200) {
      yield put(setTPS(response.data.tps));
    }
  } 
  catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      const errorData = axiosError.response.data as ErrorResponse;
      yield put(setApiCallError(errorData.error));
    } else {
      yield put(setApiCallError(axiosError.message));
    }
    }
  }
export default function* welcomeSaga() {
  yield takeEvery('LOGIN_REQUEST', loginSaga);
  yield takeEvery('CHANGE_PASSWORD', changePasswordSaga);
  yield takeEvery('REGISTER_USER', registerSaga);
  yield takeEvery('REQUEST_USERS_TO_APPROVE', getUsersToApprove);
  yield takeLatest('APPROVE_NEW_ADMIN', approveUserSaga);
  yield takeLatest('REJECT_NEW_ADMIN', rejectUserToApprove);
  yield takeEvery('GET_TPS', getTrendingPodcasts);
}

