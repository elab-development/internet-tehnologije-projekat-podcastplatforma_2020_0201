import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import NavigationMenu from './NavigationMenu';
import GeneralProfile from './GeneralProfile';
import './HostProfile.css'; 

interface HostProfileProps {
  videos: any[];
  comments: any[];
  currentUserEmail: string;
}

const HostProfile: React.FC<HostProfileProps> = ({ videos, comments, currentUserEmail }) => {
  const userVideos = videos.filter(video => video.hostEmail === currentUserEmail);

  return (
    <div>
      <NavigationMenu userType="host" />
      <GeneralProfile />
      <div className="host-profile">
        <h1>Moji podcasti:</h1>
        <div className="videos-container">
          {userVideos.length > 0 ? (
            userVideos.map(video => (
              <div key={video.title} className="video-card">
                <video controls className="video-player">
                  <source src={video.pathToVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-info">
                  <h2>{video.title}</h2>
                  <p>Kategorija: {video.category}</p>
                  <div className="video-likes">
                    <span>{video.numberOfLikes} Likes</span>
                    <button className="like-button">❤️</button>
                  </div>
                  <div className="comments">
                    {/* Filter comments for the current video */}
                    {comments.filter(comment => comment.title === video.title).length > 0 ? (
                      comments.filter(comment => comment.title === video.title).map((comment: any, index: number) => (
                        <div key={index} className="comment">
                          <p><strong>{comment.user}:</strong> {comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No videos uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  videos: state.appRed.videos,
  comments: state.appRed.comments,
  currentUserEmail: state.welcome.currentUser?.email || ''
});

export default connect(mapStateToProps)(HostProfile);
