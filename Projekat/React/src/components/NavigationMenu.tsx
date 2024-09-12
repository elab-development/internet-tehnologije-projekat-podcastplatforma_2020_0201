import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './NavigationMenu.css';
import { logoutUser } from '../store/actions/welcomeActions';
import { connect } from 'react-redux';

interface INavigationMenuProps {
  userType: 'viewer' | 'host' | 'administrator';
  logoutUser: () => void;
}

const NavigationMenu: React.FC<INavigationMenuProps> = ({ userType, logoutUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); 
    navigate('/'); 
  };
  const [stringTip, setStringTip] = useState("");
  useEffect(() => {
    if (userType === 'administrator') {
      setStringTip('admin');
    } else {
      setStringTip(userType);
    }
  }, [userType]);

  return (
    <Navbar bg="light" expand="lg" className="navigation-menu">
      <Navbar.Brand as={NavLink} to="/pp">Podcast Platforma</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
        <Nav.Link as={NavLink} to={`/${stringTip}-home`} className="nav-link-custom">
          Početna</Nav.Link>
          {userType === 'viewer' && (
            <>
              <Nav.Link as={NavLink} to="/find-podcast" className="nav-link-custom">Pronađi podcast</Nav.Link>
              <Nav.Link as={NavLink} to="/viewer-profile" className="nav-link-custom">Moj Profil</Nav.Link>
            </>
          )}
          {userType === 'host' && (
            <>
              <Nav.Link as={NavLink} to="/upload-podcast" className="nav-link-custom">Okači podcast</Nav.Link>
              <Nav.Link as={NavLink} to="/host-profile" className="nav-link-custom">Moj Profil</Nav.Link>
            </>
          )}
          {userType === 'administrator' && (
            <>
              <Nav.Link as={NavLink} to="/administriranje" className="nav-link-custom">Administriranje stranice</Nav.Link>
              <Nav.Link as={NavLink} to="/admin-profile" className="nav-link-custom">Moj Profil</Nav.Link>
            </>
          )}
          <Nav.Link onClick={handleLogout} className="nav-link-custom">Odjavi se</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  logoutUser: () => dispatch(logoutUser())
});

export default connect(null, mapDispatchToProps)(NavigationMenu);
