import React from 'react';
import NavigationMenu from './NavigationMenu';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import JokeWidget from './JokeComponent';

interface HostHomeProps {
  username: string;
  email: string;
}

const HostHome: React.FC<HostHomeProps> = ({ username, email }) => {
  return (
      <div className="home-page">
      <NavigationMenu userType="host" />
      <div className="home-content">
        <h1>Zdravo, {username}!</h1>
        <p>Trenutno se nalazis na svojoj pocetnoj stranici. Na meniju gore mozes izabrati neku od ponudjenih opcija. Vreme je za snimanje!</p>
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
  
  export default connect(mapStateToProps)(HostHome);
