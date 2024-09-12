import React, { useState } from 'react';
import { Button, Container, Table, Modal, Form, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';

interface GeneralProfileProps {
  currentUser: {
    email: string;
    name: string;
    role: string;
  };
  changePassword: (credentials: {email: string, name: string, new_password: string, new_password_confirmation: string}) => void;
}

const GeneralProfile: React.FC<GeneralProfileProps> = ({ currentUser, changePassword }) => {
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }
    changePassword({email: currentUser.email, name: currentUser.name, new_password: newPassword, new_password_confirmation: confirmNewPassword});
    setError('');
    setShowChangePassword(false);
  };

  return (
    <Container className="general-profile">
      <h1 className="text-center text-dark-blue">Podaci o tvom profilu:</h1>
      <Table striped bordered hover className="text-center">
        <tbody>
          <tr>
            <td>Email:</td>
            <td>{currentUser.email}</td>
          </tr>
          <tr>
            <td>Ime:</td>
            <td>{currentUser.name}</td>
          </tr>
          <tr>
            <td>Uloga:</td>
            <td>{currentUser.role}</td>
          </tr>
        </tbody>
      </Table>
      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => setShowChangePassword(true)}>Promeni lozinku</Button>
      </div>

      {/* Password Change Modal */}
      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Promeni lozinku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="formNewPassword">
              <Form.Label>Nova lozinka</Form.Label>
              <Form.Control
                type="password"
                placeholder="Unesite novu lozinku"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formConfirmNewPassword">
              <Form.Label>Potvrdi novu lozinku</Form.Label>
              <Form.Control
                type="password"
                placeholder="Potvrdite novu lozinku"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handlePasswordChange}>Promeni lozinku</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUser: state.welcome.currentUser
});

const mapDispatchToProps = (dispatch: any) => ({
  changePassword: (credentials: {email: string, name: string, new_password: string, new_password_confirmation: string}) => dispatch({ type: 'CHANGE_PASSWORD', payload: credentials }),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralProfile);
