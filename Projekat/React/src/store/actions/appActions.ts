export const commentOnVideo = (comment: any, token:string) => ({
  type: 'COMMENT_ON_VIDEO',
  payload: {comment: comment, token: token}
});

export const setApiCallError = (error: string) => ({
  type: 'SET_API_CALL_ERROR',
  payload: error
});

export const setUserLikes = (data: any) => ({
  type: 'SET_USER_LIKES',
  payload: data
});

export const setUserComments = (data: any) => ({
  type: 'SET_USER_COMMENTS',
  payload: data
});

export const uploadPodcastRequest = (formData: FormData,token: string) => ({
  type: 'UPLOAD_PODCAST_REQUEST',
  payload: {formData: formData, token: token},
});
export const fetchUserPodcastsRequest = (token: string) => ({
  type: 'FETCH_USER_PODCASTS_REQUEST',
  payload: token,
});

export const setUserPodcasts = (data: any) => ({
  type: 'SET_USER_PODCASTS',
  payload: data,
});

export const fetchUserPodcastsError = (error: string) => ({
  type: 'FETCH_USER_PODCASTS_ERROR',
  payload: error,
});

export const setPodcasts = (data : any) => ({
  type: 'SET_PODCASTS',
  payload: data
});

export const fetchPodcastsRequest = (token: string) => ({
  type: 'FETCH_PODCASTS_REQUEST',
  payload: token,
});

export const likePodcastRequest = (podcastId: number, token: string) => ({
  type: 'LIKE_PODCAST_REQUEST',
  payload: {podcastId: podcastId, token: token},
});

export const likePodcastSuccess = (podcastId: number) => ({
  type: 'LIKE_PODCAST_SUCCESS',
  payload: podcastId,
});

export const likePodcastFailure = (error: string) => ({
  type: 'LIKE_PODCAST_FAILURE',
  payload: error,
});

export const setAllComments = (data:any) => ({
  type: 'SET_ALL_COMMENTS',
  payload: data
});

export const fetchAllComments = (token: string) => ({
  type: 'FETCH_ALL_COMMENTS',
  payload: token
});

export const deleteComment = (comm_id : number, token: string) => ({
  type: 'DELETE_COMMENT',
  payload: {id: comm_id, token: token}
});

