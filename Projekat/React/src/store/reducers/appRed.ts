const initialState: any = {
    userLikes: [],
    apiError: "",
    userComments: [],
    uploading: false,
    uploadError: null,
    userPodcasts: [],
    podcasts: [],
    allComments: []
  };
  
  export function appReducer(state = initialState, action: any) {
    switch (action.type) {
        case 'SET_USER_LIKES':
            return {
                ...state,
                userLikes: action.payload
            };
        case 'SET_USER_COMMENTS':
            return {
                ...state,
                userComments: action.payload
            };
        case 'SET_API_CALL_ERROR':
            return {...state, apiError: action.payload};
        case 'UPLOAD_PODCAST_REQUEST':
            return {
                ...state,
                uploading: true,
                uploadError: null,
            };
        case 'UPLOAD_PODCAST_SUCCESS':
            return {
                ...state,
                uploading: false,
            };
        case 'UPLOAD_PODCAST_FAILURE':
            return {
                ...state,
                uploading: false,
                uploadError: action.payload,
            };
        case 'SET_USER_PODCASTS':
            return {
                ...state,
                userPodcasts: action.payload
            };
        case 'FETCH_USER_PODCASTS_ERROR':
            return { ...state, apiError: action.payload };
      case 'SET_PODCASTS':
          return {...state, podcasts: action.payload};
      case 'SET_ALL_COMMENTS':
            return {...state, allComments: action.payload};
        default:
            return state;
    }
  }
  