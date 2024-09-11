import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { likeVideo, commentOnVideo } from '../store/actions/appActions';
import NavigationMenu from './NavigationMenu';
import './FindPodcats.css'; 

interface FindPodcastProps {
  videos: any[];
  comments: any[];
  commentOnVideo: (comment: { user: string; title: string; comment: string }) => void;
  likeVideo: (like: any) => void;
  username: string;
}

const FindPodcast: React.FC<FindPodcastProps> = ({
  videos, comments, commentOnVideo, likeVideo, username
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(videos.map(video => video.category))];

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = (videoTitle: string) => {
    commentOnVideo({
      user: username,
      title: videoTitle,
      comment: commentText
    });
    setCommentText('');
    setSelectedVideo(null);
  };

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div>
      <NavigationMenu userType="viewer" />
      <div className="find-podcast">
        <div className="find-content">
          <h1 className='fp'>Find Podcasts</h1>
          <div className="filter-section">
            <label htmlFor="category-filter">Filter by Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {filteredVideos.length === 0 && <p>No videos available for selected category.</p>}
          <div className="videos-list">
            {filteredVideos.map(video => (
              <div key={video.title} className="video-item">
                <video controls src={video.pathToVideo} className="video-player" />
                <h3>{video.title}</h3>
                <p>Likes: {video.numberOfLikes}</p>
                <button onClick={() => likeVideo({user: username, title: video.title})}>Like</button>
                <button onClick={() => setSelectedVideo(video.title)}>Comment</button>
                {selectedVideo === video.title && (
                  <div>
                    <textarea value={commentText} onChange={handleCommentChange} />
                    <button onClick={() => handleCommentSubmit(video.title)}>Submit Comment</button>
                  </div>
                )}
                <div className="comments-list">
                  {comments.filter(comment => comment.title === video.title).map((comment, index) => (
                    <div key={index} className="comment-item">
                      <p><strong>{comment.user}:</strong> {comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  videos: state.appRed.videos,
  comments: state.appRed.comments,
  username: state.welcome.currentUser?.name || ''
});

const mapDispatchToProps  = (dispatch: any) => ({
  likeVideo: (like: any) => dispatch(likeVideo(like)),
  commentOnVideo: (comment: any) => dispatch(commentOnVideo(comment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FindPodcast);
