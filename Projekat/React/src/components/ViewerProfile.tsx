import React, { useEffect } from 'react';
import NavigationMenu from './NavigationMenu';
import GeneralProfile from './GeneralProfile';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import './ViewerProfile.css'; 

interface Comment{
  title: string;
  comment: string;
}

interface ViewerProfileProps {
  username: string;
  email: string;
  token: string;
  likedVideos: [];
  userComments: Comment[];
  getUserLikes: (token: string) => void;
  getUserComments: (token: string) => void;
}

const ViewerProfile: React.FC<ViewerProfileProps> = ({ token, getUserLikes,username, email, likedVideos, userComments, getUserComments }) => {
  useEffect(() => {
    getUserLikes(token);  
    getUserComments(token);
  },[]);
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
                {likedVideos.map((title, index) => (
                  <tr key={index}>
                    <td>{title}</td>
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
  token: state.welcome.currentUser?.token || '',
  email: state.welcome.currentUser?.email || '',
  likedVideos: state.appRed.userLikes || [],
  userComments: state.appRed.userComments || []
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserLikes: (token: string) => dispatch({ type: 'GET_LIKES' , payload: token}),
  getUserComments: (token: string) => dispatch({ type: 'GET_USER_COMMENTS' , payload: token}),

});

export default connect(mapStateToProps,mapDispatchToProps)(ViewerProfile);
