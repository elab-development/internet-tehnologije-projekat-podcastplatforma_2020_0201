import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { fetchUserPodcastsRequest } from '../store/actions/appActions';
import NavigationMenu from './NavigationMenu';
import GeneralProfile from './GeneralProfile';
import './HostProfile.css';

interface HostProfileProps {
  userPodcasts: any[];
  currentUserEmail: string;
  fetchUserPodcasts: (token: string) => void;
  token: string; // Assuming you have the token in your state or pass it as a prop
}

const HostProfile: React.FC<HostProfileProps> = ({ userPodcasts = [], currentUserEmail, fetchUserPodcasts, token }) => {
  useEffect(() => {
    fetchUserPodcasts(token);
  }, [fetchUserPodcasts, token]);

  useEffect(()=>{
    console.log(userPodcasts);
  },[userPodcasts]);

  const userVideos = userPodcasts;
  return (
    <div>
      <NavigationMenu userType="host" />
      <GeneralProfile />
      <div className="host-profile">
        <h1>Moji podcasti:</h1>
        <div className="videos-container">
          {userVideos.length > 0 ? (
            userVideos.map(video => (
              <div key={video.id} className="video-card">
                <video controls className="video-player">
                  <source src={`http://localhost:8000/storage/${video.video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-info">
                  <h2>{video.title}</h2>
                  <p>Kategorija: {video.category}</p>
                  <div className="video-likes">
                    <span>{video.likes} Likes</span>
                    <button className="like-button">❤️</button>
                  </div>
                  <div className="comments">
                    {video.comments && video.comments.length > 0 ? (
                      video.comments.map((comment: any, index: number) => (
                        <div key={index} className="comment">
                          <p><strong>{comment.user}:</strong> {comment.text}</p>
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
  userPodcasts: state.appRed.userPodcasts,
  currentUserEmail: state.welcome.currentUser?.email || '',
  token: state.welcome.currentUser?.token || ''
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchUserPodcasts: (token: string) => dispatch(fetchUserPodcastsRequest(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HostProfile);
