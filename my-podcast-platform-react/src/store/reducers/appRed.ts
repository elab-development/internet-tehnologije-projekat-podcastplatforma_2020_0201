const initialState: any = {
    videos: [],
    comments: [],
    likes: []
  };
  
export function appReducer(state = initialState, action: any) {
    switch (action.type) {
      case 'UPLOAD_PODCAST':
      return {
        ...state,
        videos: [...state.videos, action.payload]
      };
      case 'COMMENT_ON_VIDEO':
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    case 'LIKE_VIDEO':
      return {
        ...state,
        likes: [...state.likes, action.payload],
        videos: state.videos.map((video: any) =>
          video.title === action.payload.title
            ? { ...video, numberOfLikes: video.numberOfLikes + 1 }
            : video
        )
      };
      case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(
          (comment: any) =>
            !(comment.user === action.payload.user && comment.title === action.payload.title && comment.comment === action.payload.comment)
        )
      };
        default:
          return state;
    }
}
  