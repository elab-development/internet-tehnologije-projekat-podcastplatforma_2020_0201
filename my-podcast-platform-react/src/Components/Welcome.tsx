import React, { useState } from 'react';
import { Button, Form, Container, Col, Row, Alert, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/reducers';
import './WelcomePage.css';
import { changePassword, loginUser, registerUser} from '../store/actions/welcomeActions';


interface IWelcomePageProps {
  allUsers: any[];
  changePassword: (user: any) => void;
  loginUser: (user: any) => void;
  registerUser: (user: any) => void;
}

const WelcomePage: React.FC<IWelcomePageProps> = ({ allUsers, changePassword, loginUser, registerUser }) => {

  const [showLogin, setShowLogin] = useState<boolean>(false); 
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('viewer'); 
  const [error, setError] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const navigate = useNavigate();


  const handleLogin = () => {
    const user = allUsers.find((user: any) => user.email === email);

    if (!user) {
      setError("Ne postoji registracija sa tim emailom.");
      return;
    }

    if (user.password !== password) {
      setError("Pogrešna lozinka.");
      return;
    }
    loginUser({ name: user.name, email: user.email, role: user.role });
    if (user.role === 'viewer') {
      navigate('/viewer-home');
    } else if (user.role === 'host') {
      navigate('/host-home');
    } else if (user.role === 'administrator') {
      navigate('/admin-home');
    }
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }
    
    const newUser = { name: username, email, password, role };
    registerUser(newUser);
    setShowRegister(false);
    setShowLogin(true);
    (role==='administrator') ? setError('Morate sačekati da naši administratori odobre registraciju.') : setError('');
  };

  const handleRegisterRedirect = () => {
    setShowLogin(false);
    setShowRegister(true);
    setError('');
  };

  const handlePasswordChangeRedirect = () => {
    setShowChangePassword(true);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      setError('Lozinke se ne poklapaju.');
      return;
    }
    setShowChangePassword(false);
    setError('Lozinka je promenjena.');
    changePassword({name: username, email: email, password: password});
  };

  return (
    <Container fluid className="login-page">
      <Row className="justify-content-center text-center">
        <Col>
          <h1 className="welcome-message">Dobrodošli!</h1>
          <div className="info-box">
            <p>
              Mi cenimo naše korisnike, molimo vas ulogujte se ili registrujte da biste pristupili podcast stranici.
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {error==="Pogrešna lozinka." && <p className="clickable-text" onClick={handlePasswordChangeRedirect}> Zaboravljena lozinka?</p>}
            {error==="Ne postoji registracija sa tim emailom." && <p className="clickable-text" onClick={handleRegisterRedirect}>Registruj se!</p>}
            {!showLogin && !showRegister && (
              <div>
                <Button variant="primary" className="m-2" onClick={() => { setShowLogin(true); }}>Uloguj se</Button>
                <Button variant="secondary" className="m-2" onClick={() => { setShowRegister(true); }}>Registruj se</Button>
              </div>
            )}
            {showLogin && !showRegister && !showChangePassword && (
              <div>
                <Form className="form-box">
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Unesite email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Unesite lozinku"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" className="mt-3" onClick={handleLogin}>Prijavi se</Button>
                </Form>
              </div>
            )}
            {showRegister && (
              <Form className="form-box">
                <Form.Group controlId="formUsername">
                  <Form.Label>Korisničko ime</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Unesite korisničko ime"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Unesite email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Lozinka</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Unesite lozinku"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Potvrdi lozinku</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Potvrdite lozinku"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formRole">
                  <Form.Label>Uloga</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="host">Host</option>
                    <option value="administrator">Administrator</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" className="mt-3" onClick={handleRegister}>Registruj se</Button>
              </Form>
            )}
          </div>
        </Col>
      </Row>

      <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Promeni lozinku</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Korisničko ime</Form.Label>
              <Form.Control
                type="text"
                placeholder="Unesite korisničko ime"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
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
  allUsers: state.welcome.allUsers
});

const mapDispatchToProps = (dispatch: any) => ({
  changePassword: (user: any) => dispatch(changePassword(user)),
  registerUser: (user: any) => dispatch(registerUser(user)),
  loginUser: (user: any) => dispatch(loginUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
