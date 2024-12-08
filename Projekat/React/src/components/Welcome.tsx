import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Col,
  Row,
  Alert,
  Modal,
} from "react-bootstrap";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/reducers";
import "./WelcomePage.css";
import { setRegisterResponse } from "../store/actions/welcomeActions";

interface IWelcomePageProps {
  changePassword: (credentials: {
    email: string;
    name: string;
    new_password: string;
    new_password_confirmation: string;
  }) => void;
  errorLogin: string;
  loginRequest: (credentials: { email: string; password: string }) => void;
  user: any;
  registerStatus: string;
  registerUser: (credentials: {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
    role: string;
  }) => void;
  setRegisterResponse: (message: string) => void;
}

const WelcomePage: React.FC<IWelcomePageProps> = ({
  user,
  changePassword,
  loginRequest,
  registerStatus,
  errorLogin,
  registerUser,
  setRegisterResponse,
}) => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("viewer");
  const [error, setError] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = () => {
    loginRequest({ email, password });
  };
  useEffect(() => {
    if (errorLogin === "") {
      setError("");
    }
    if (errorLogin === "200") {
      setError("");
    }
    if (errorLogin === "P201") {
      setError("Lozinka je promenjena.");
    }
    if (errorLogin && errorLogin.includes("P4")) {
      setError("Lozinka NIJE promenjena.");
    }
    if (errorLogin === "401") {
      setError("Pogrešna lozinka.");
    } else if (errorLogin === "404") {
      setError("Ne postoji registracija sa tim emailom.");
    }
  }, [errorLogin]);

  useEffect(() => {
    if (user !== null) {
      if (user.role === "viewer") {
        navigate("/viewer-home");
      } else if (user.role === "host") {
        navigate("/host-home");
      } else if (user.role === "administrator") {
        navigate("/admin-home");
      }
    }
  }, [user]);

  useEffect(() => {
    if (registerStatus === "REGISTROVANI STE") {
      setShowLogin(true);
    }
    setError(registerStatus);
  }, [registerStatus]);

  useEffect(() => {
    setError("");
  }, []);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    const newUser = {
      email,
      name: username,
      password,
      password_confirmation: confirmPassword,
      role,
    };
    setShowRegister(false);
    setRegisterResponse("");
    registerUser(newUser);
  };

  const handleRegisterRedirect = () => {
    setShowLogin(false);
    setShowRegister(true);
    setError("");
  };

  const handlePasswordChangeRedirect = () => {
    setShowChangePassword(true);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    setShowChangePassword(false);
    changePassword({
      name: username,
      email: email,
      new_password: newPassword,
      new_password_confirmation: confirmNewPassword,
    });
  };

  return (
    <Container fluid className="login-page">
      <Row className="justify-content-center text-center">
        <Col>
          <h1 className="welcome-message">Dobrodošli!</h1>
          <div className="info-box">
            <p>
              Mi cenimo naše korisnike, molimo vas ulogujte se ili registrujte
              da biste pristupili podcast stranici.
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {error === "Pogrešna lozinka." && (
              <p
                className="clickable-text"
                onClick={handlePasswordChangeRedirect}
              >
                {" "}
                Zaboravljena lozinka?
              </p>
            )}
            {error === "Ne postoji registracija sa tim emailom." && (
              <p className="clickable-text" onClick={handleRegisterRedirect}>
                Registruj se!
              </p>
            )}
            {!showLogin && !showRegister && (
              <div>
                <Button
                  variant="primary"
                  className="m-2"
                  onClick={() => {
                    setShowLogin(true);
                    setError("");
                  }}
                >
                  Uloguj se
                </Button>
                <Button
                  variant="secondary"
                  className="m-2"
                  onClick={() => {
                    setShowRegister(true);
                    setError("");
                  }}
                >
                  Registruj se
                </Button>
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
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleLogin}
                  >
                    Prijavi se
                  </Button>
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
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={handleRegister}
                >
                  Registruj se
                </Button>
              </Form>
            )}
          </div>
        </Col>
      </Row>

      <Modal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
      >
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
            <Button
              variant="primary"
              className="mt-3"
              onClick={handlePasswordChange}
            >
              Promeni lozinku
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  allUsers: state.welcome.allUsers,
  errorLogin: state.welcome.error,
  user: state.welcome.currentUser,
  registerStatus: state.welcome.registerStatus,
});

const mapDispatchToProps = (dispatch: any) => ({
  changePassword: (credentials: {
    email: string;
    name: string;
    new_password: string;
    new_password_confirmation: string;
  }) => dispatch({ type: "CHANGE_PASSWORD", payload: credentials }),
  registerUser: (credentials: {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
    role: string;
  }) => dispatch({ type: "REGISTER_USER", payload: credentials }),
  loginRequest: (credentials: { email: string; password: string }) =>
    dispatch({ type: "LOGIN_REQUEST", payload: credentials }),
  setRegisterResponse: (message: string) =>
    dispatch(setRegisterResponse(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
