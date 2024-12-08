import React from 'react';
import NavigationMenu from './NavigationMenu';
import GeneralProfile from './GeneralProfile';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import './ViewerProfile.css'; 

interface ViewerProfileProps {
  username: string;
  email: string;
  likedVideos: Array<{ title: string }>;
  userComments: Array<{ title: string; comment: string }>;
}

const ViewerProfile: React.FC<ViewerProfileProps> = ({ username, email, likedVideos, userComments }) => {
  return (
    <div>
      <NavigationMenu userType="viewer" />
      <GeneralProfile />
      <div className="viewer-profile">
        <div className="profile-content">
          <h2>Liked Videos</h2>
          {likedVideos.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {likedVideos.map((video, index) => (
                  <tr key={index}>
                    <td>{video.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No liked videos yet.</p>
          )}

          <h2>User Comments</h2>
          {userComments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {userComments.map((comment, index) => (
                  <tr key={index}>
                    <td>{comment.title}</td>
                    <td>{comment.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  username: state.welcome.currentUser?.name || '',
  email: state.welcome.currentUser?.email || '',
  likedVideos: state.appRed.likes
    .filter((like: { user: string }) => like.user === state.welcome.currentUser?.name)
    .map((like: { title: string }) => ({ title: like.title })),
  userComments: state.appRed.comments
    .filter((comment: { user: string }) => comment.user === state.welcome.currentUser?.name)
});

export default connect(mapStateToProps)(ViewerProfile);
