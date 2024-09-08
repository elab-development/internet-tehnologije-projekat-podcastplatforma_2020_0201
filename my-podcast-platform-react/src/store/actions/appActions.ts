export const uploadPodcast = (podcast: any) => ({
    type: 'UPLOAD_PODCAST',
    payload: podcast,
});


export const likeVideo = (like: any) => ({
  type: 'LIKE_VIDEO',
  payload: like
});

export const commentOnVideo = (comment: any) => ({
  type: 'COMMENT_ON_VIDEO',
  payload: comment
});

export const deleteComment = (comment: { user: string; title: string; comment: string }) => ({
  type: 'DELETE_COMMENT',
  payload: comment
});
