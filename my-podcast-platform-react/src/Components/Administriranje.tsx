import React from 'react';
import { connect } from 'react-redux';
import { deleteComment } from '../store/actions/appActions';
import { RootState } from '../store/reducers';
import './AdministriranjeStranice.css'; 
import { approveRegistration } from '../store/actions/welcomeActions';
import NavigationMenu from './NavigationMenu';

interface AdminPageProps {
  usersToBeApproved: Array<{ name: string; email: string }>;
  allComments: Array<{ user: string; title: string; comment: string }>;
  approveRegistration: (user: any) => void;
  deleteComment: (comment: { user: string; title: string; comment: string }) => void;
}

const AdministriranjeStranice: React.FC<AdminPageProps> = ({
  usersToBeApproved,
  allComments,
  approveRegistration,
  deleteComment
}) => {
  const handleApprove = (user: { name: string; email: string }) => {
    approveRegistration(user);
  };

  const handleDeleteComment = (comment: { user: string; title: string; comment: string }) => {
    deleteComment(comment);
  };

  return (
    <div>      <NavigationMenu userType="administrator" />
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
                    <button onClick={() => handleApprove(user)}>Approve</button>
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
                <th>Video Title</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allComments.map((comment, index) => (
                <tr key={index}>
                  <td>{comment.user}</td>
                  <td>{comment.title}</td>
                  <td>{comment.comment}</td>
                  <td>
                    <button onClick={() => handleDeleteComment(comment)}>Delete</button>
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
  allComments: state.appRed.comments
});

const mapDispatchToProps = (dispatch: any) => ({
  approveRegistration: (user: any) => dispatch(approveRegistration(user)),
  deleteComment: (comment: any) => dispatch(deleteComment(comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdministriranjeStranice);
