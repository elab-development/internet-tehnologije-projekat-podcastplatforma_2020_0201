import React from 'react';
import NavigationMenu from './NavigationMenu';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import './Homepage.css'; 
import JokeWidget from './JokeComponent';

interface AdminHomeProps {
  username: string;
  email: string;
}

const AdminHome: React.FC<AdminHomeProps> = ({ username, email }) => {
  return (
    <div className="home-page">
      <NavigationMenu userType="administrator" />
      <div className="home-content">
        <h1>Zdravo, {username}!</h1>
        <p>Trenutno se nalazis na svojoj pocetnoj stranici. Na meniju gore mozes izabrati neku od ponudjenih opcija. Ukoliko zelis da postanes podcast host podrzavamo te da se odlogujes i napravis novi nalog kao host (pazi da koristis privatni email!)</p>
        <br/>
        <p>PROCITAJ S PAZNJOM!!!</p>
        <JokeWidget />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  username: state.welcome.currentUser?.name || '',
  email: state.welcome.currentUser?.email || ''
});

export default connect(mapStateToProps)(AdminHome);
