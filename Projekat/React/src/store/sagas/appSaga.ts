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

  function* fetchUserPodcastsSaga(action: any) {
    try {
        const token = action.payload;
        const response: AxiosResponse<any> = yield call(axios.get, `${API_URL}podcasts/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            yield put(setUserPodcasts(response.data));
            yield put(setApiCallError("OK"));
        }
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>; 
        if (axiosError.response) {
            const errorData = axiosError.response.data as ErrorResponse; 
            yield put(fetchUserPodcastsError(errorData.error));
            alert(`Failed to fetch podcasts: ${errorData.error}`);
        } else {
            yield put(fetchUserPodcastsError(axiosError.message));
            alert(`Failed to fetch podcasts: ${axiosError.message}`);
        }
    }
}

function* fetchPodcastsSaga(action:any){
    try {
        const token = action.payload;
        const response: AxiosResponse<any> = yield call(axios.get, `${API_URL}podcasts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            yield put(setPodcasts(response.data.podcasts));
            yield put(setApiCallError("OK"));
        }
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>; 
        if (axiosError.response) {
            const errorData = axiosError.response.data as ErrorResponse; 
            yield put(fetchUserPodcastsError(errorData.error));
            alert(`Failed to fetch podcasts: ${errorData.error}`);
        } else {
            yield put(fetchUserPodcastsError(axiosError.message));
            alert(`Failed to fetch podcasts: ${axiosError.message}`);
        }
    }
};

function* likePodcastSaga(action: any) {
    try {
      const {token,podcastId} = action.payload;
      const response: AxiosResponse<any> = yield call(axios.post, `${API_URL}like`, {
        podcast_id: podcastId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.status === 201) {
        yield put(likePodcastSuccess(podcastId));
        yield put(setApiCallError("OK"));
        window.location.reload();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        yield put(likePodcastFailure(errorData.error));
        alert(`Failed to like podcast: ${errorData.error}`);
      } else {
        yield put(likePodcastFailure(axiosError.message));
        alert(`Failed to like podcast: ${axiosError.message}`);
      }
    }
  };

  function* getAllComments(action:any){
    try {
        const token = action.payload;
        const response: AxiosResponse<any> = yield call(axios.get, `${API_URL}allComments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
          yield put(setAllComments(response.data.comments));
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

  function* commentOnVideoSaga(action: any) {
    try {
      const {comment, token } = action.payload;
      const response: AxiosResponse<any> = yield call(axios.post, `${API_URL}comment`, {
        podcast_id: comment.podcast_id,
        comment: comment.comment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 201) {
        yield put(setApiCallError("ALL GOOD"));
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

  function* deleteCommentSaga(action: any) {
    try {
      const { id, token } = action.payload;
      const response: AxiosResponse<any> = yield call(axios.delete, `${API_URL}comments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.status === 200) {
        yield put(setApiCallError("OK"));
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
  
export default function* appSaga() {
  yield takeEvery('GET_LIKES', getLikesSaga);
  yield takeEvery('GET_USER_COMMENTS',getUsersComments);
  yield takeLatest('UPLOAD_PODCAST_REQUEST', uploadPodcastSaga);
  yield takeEvery('FETCH_USER_PODCASTS_REQUEST', fetchUserPodcastsSaga);
  yield takeEvery('FETCH_PODCASTS_REQUEST', fetchPodcastsSaga);
  yield takeEvery('LIKE_PODCAST_REQUEST', likePodcastSaga);
  yield takeEvery('FETCH_ALL_COMMENTS', getAllComments);
  yield takeEvery('COMMENT_ON_VIDEO', commentOnVideoSaga); 
  yield takeEvery('DELETE_COMMENT', deleteCommentSaga);
}