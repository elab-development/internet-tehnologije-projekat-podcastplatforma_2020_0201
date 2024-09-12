import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { fetchUserPodcastsError, likePodcastFailure, likePodcastSuccess, setAllComments, setApiCallError, setPodcasts, setUserComments, setUserLikes, setUserPodcasts } from '../actions/appActions';

const API_URL = 'http://localhost:8000/api/';

interface GetLikesResponse{
    likes: [];
}
interface GetCommentsResponse{
    comments: [];
}

interface ErrorResponse {
    error: string;
  }
  

function* getLikesSaga(action:any){
    try {
        const token = action.payload;
        const response: AxiosResponse<GetLikesResponse> = yield call(axios.get, `${API_URL}likes/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            const {likes} = response.data;
            yield put(setUserLikes(likes));
            yield put(setApiCallError("OK"));
        }
      } 
      catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            yield put(setApiCallError("PUKO API"));
        }  else {
            yield put(setApiCallError('Unknown error occurred'));
          }
      
      }  
}

function* getUsersComments(action:any){
    try {
        const token = action.payload;
        const response: AxiosResponse<GetCommentsResponse> = yield call(axios.get, `${API_URL}comments/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            const {comments} = response.data;
            yield put(setUserComments(comments));
            yield put(setApiCallError("OK"));
        }
      } 
      catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            yield put(setApiCallError("PUKO API"));
        }  else {
            yield put(setApiCallError('Unknown error occurred'));
          }
      }  
}

function* uploadPodcastSaga(action: any): Generator<any, any, any> {
    try {
      const {formData,token} = action.payload;
      const response = yield call(() => 
        axios.post('http://localhost:8000/api/podcasts/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        })
      );
      yield put({ type: 'UPLOAD_PODCAST_SUCCESS', payload: response.data });
      alert('Podcast uploaded successfully!');
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>; 
        if (axiosError.response) {
          const errorData = axiosError.response.data as ErrorResponse; 
          yield put({ type: 'UPLOAD_PODCAST_FAILURE', payload: errorData.error });
          alert(`Failed to upload podcast: ${errorData.error}`);
        } else {
          yield put({ type: 'UPLOAD_PODCAST_FAILURE', payload: axiosError.message });
          alert(`Failed to upload podcast: ${axiosError.message}`);
        }
    }
  };

  
  
export default function* appSaga() {
  yield takeEvery('GET_LIKES', getLikesSaga);
  yield takeEvery('GET_USER_COMMENTS',getUsersComments);
  yield takeLatest('UPLOAD_PODCAST_REQUEST', uploadPodcastSaga);
}
