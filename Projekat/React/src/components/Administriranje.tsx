import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteComment, fetchAllComments, fetchPodcastsRequest } from '../store/actions/appActions';
import { RootState } from '../store/reducers';
import './AdministriranjeStranice.css'; 
import { approveNewAdmin, approveRegistration, rejectNewAdmin, requestUsersToApprove } from '../store/actions/welcomeActions';
import NavigationMenu from './NavigationMenu';

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

interface AdminPageProps {
  usersToBeApproved: Array<{ name: string; email: string }>;
  allComments: Comment[];
  approveRegistration: (user: any) => void;
  deleteComment: (comment_id: number, token: string) => void;
  fetchAllComments: (token: string) => void;
  token: string;
  fetchAllPodcasts: (token: string) => void;
  requestUsersToApprove: (token: string) => void;
  approveNewAdmin: (email: string, token: string) => void;
  rejectNewAdmin: (email: string, token: string) => void;
  podcasts: any[];
}

const AdministriranjeStranice: React.FC<AdminPageProps> = ({
  usersToBeApproved,
  allComments,
  approveRegistration,
  deleteComment,
  fetchAllComments,
  fetchAllPodcasts,
  requestUsersToApprove,
  rejectNewAdmin,
  approveNewAdmin,
  podcasts,
  token
}) => {
  useEffect(() => {
    fetchAllComments(token);
    fetchAllPodcasts(token);
    requestUsersToApprove(token);
  }, [fetchAllComments, fetchAllPodcasts, requestUsersToApprove, token]);

  const handleApprove = (mail: string) => {
    approveNewAdmin(mail, token);
  };

  const handleReject = (mail: string) => {
    rejectNewAdmin(mail,token);
  };

  const handleDeleteComment = (comment_id : number, token: string) => {
    deleteComment(comment_id, token);
  };

  const getPodcastTitle = (podcast_id: number) => {
    const podcast = podcasts.find(podcast => podcast.id === podcast_id);
    return podcast ? podcast.title : 'Unknown Podcast';
  };

  return (
    <div>
      <NavigationMenu userType="administrator" />
      <div className="admin-page">
        <h1>Administriranje Stranice</h1>

        <div className="approval-section">
          <h2>Korisnici na čekanju</h2>
          {usersToBeApproved.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {usersToBeApproved.map((user, index) => ( 
                  <tr key={index}>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>
                      <button className="action-button approve-button" onClick={() => handleApprove(user.email)}>Approve</button>
                      <button className="action-button reject-button" onClick={() => handleReject(user.email)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users to approve.</p>
          )}
        </div>

        <div className="comments-section">
          <h2>All Comments</h2>
          {allComments.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Podcast Title</th>
                  <th>Comment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allComments.map((comment, index) => (
                  <tr key={index}>
                    <td>{comment.user_name}</td>
                    <td>{getPodcastTitle(comment.podcast_id)}</td> 
                    <td>{comment.text}</td>
                    <td>
                      <button onClick={() => handleDeleteComment(comment.id, token)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No comments available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  usersToBeApproved: state.welcome.usersToBeApproved,
  allComments: state.appRed.allComments,
  token: state.welcome.currentUser?.token || '',
  podcasts: state.appRed.podcasts || []
});

const mapDispatchToProps = (dispatch: any) => ({
  approveRegistration: (user: any) => dispatch(approveRegistration(user)),
  deleteComment: (comment_id: number, token: string) => dispatch(deleteComment(comment_id, token)),
  fetchAllComments: (token: string) => dispatch(fetchAllComments(token)),
  fetchAllPodcasts: (token: string) => dispatch(fetchPodcastsRequest(token)),
  requestUsersToApprove: (token: string) => dispatch(requestUsersToApprove(token)),
  approveNewAdmin: (email: string, token: string) => dispatch(approveNewAdmin(email,token)),
  rejectNewAdmin: (email: string, token: string) => dispatch(rejectNewAdmin(email,token)),

});

export default connect(mapStateToProps, mapDispatchToProps)(AdministriranjeStranice);
