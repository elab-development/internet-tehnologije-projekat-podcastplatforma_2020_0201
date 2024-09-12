import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import {
  likePodcastRequest,
  commentOnVideo,
  fetchPodcastsRequest,
  fetchAllComments
} from '../store/actions/appActions';
import NavigationMenu from './NavigationMenu';
import './FindPodcats.css';

interface Comment {
  id: number;
  user_id: number;
  podcast_id: number;
  text: string;
  created_at: string | null;
  updated_at: string | null;
  podcast_title: string;
  user_email: string;
  user_name: string;
}

interface FindPodcastProps {
  podcasts: any[];
  comments: Comment[];
  likedVideos: number[];
  commentOnVideo: (podcast_id: number, comment: string, token: string) => void;
  likePodcastRequest: (podcastId: number, token: string) => void;
  fetchPodcasts: (token: string) => void;
  getUserLikes: (token: string) => void;
  fetchAllComments: (token: string) => void;
  username: string;
  token: string;
  error: string;
}

const FindPodcast: React.FC<FindPodcastProps> = ({
  podcasts, comments, likedVideos, commentOnVideo, fetchAllComments, likePodcastRequest, fetchPodcasts, getUserLikes, username, token, error
}) => {
  const [selectedPodcast, setSelectedPodcast] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...new Set(podcasts.map(podcast => podcast.category))];

  useEffect(() => {
    fetchPodcasts(token);
    getUserLikes(token);
    fetchAllComments(token);
  }, [token]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = (podcastId: number) => {
    if (commentText.trim()) {
      commentOnVideo(podcastId, commentText, token);
      setCommentText('');
      setSelectedPodcast(null);
    }
  };

  const handleLike = (podcastId: number) => {
    likePodcastRequest(podcastId, token);
  };

  const filteredPodcasts = selectedCategory === 'All'
    ? podcasts
    : podcasts.filter(podcast => podcast.category === selectedCategory);

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
          {filteredPodcasts.length === 0 && <p>No podcasts available for the selected category.</p>}
          <div className="video-list">
            {filteredPodcasts.map(podcast => (
              <div key={podcast.id} className="video-item">
                <video controls src={`http://localhost:8000/storage/${podcast.video_url}`} className="video-player" />
                <h3>{podcast.title}</h3>
                <p>Likes: {podcast.likes}</p>
                {!likedVideos.includes(podcast.title) && (
                  <button onClick={() => handleLike(podcast.id)}>Like</button>
                )}
                <button onClick={() => setSelectedPodcast(podcast.id)}>Comment</button>
                {selectedPodcast === podcast.id && (
                  <div>
                    <textarea value={commentText} onChange={handleCommentChange} />
                    <button onClick={() => handleCommentSubmit(podcast.id)}>Submit Comment</button>
                  </div>
                )}
                <div className="comments-list">
                  {comments.filter(comment => comment.podcast_id === podcast.id).map((comment, index) => (
                    <div key={index} className="comment-item">
                      <p><strong>{comment.user_name}:</strong> {comment.text}</p>
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
  podcasts: state.appRed.podcasts,
  comments: state.appRed.allComments, 
  likedVideos: state.appRed.userLikes,
  username: state.welcome.currentUser?.name || '',
  token: state.welcome.currentUser?.token || '',
  error: state.appRed.apiError
});

const mapDispatchToProps = (dispatch: any) => ({
  likePodcastRequest: (podcastId: number, token: string) => dispatch(likePodcastRequest(podcastId, token)),
  commentOnVideo: (podcast_id: number, comment: string, token: string) => dispatch(commentOnVideo({ podcast_id, comment }, token)),
  fetchPodcasts: (token: string) => dispatch(fetchPodcastsRequest(token)),
  getUserLikes: (token: string) => dispatch({ type: 'GET_LIKES', payload: token }),
  fetchAllComments: (token: string) => dispatch(fetchAllComments(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(FindPodcast);
