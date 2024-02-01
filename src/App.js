import React from 'react';
import logo from './logo.svg';
import './spotifyAuth.js'
import './App.css';

function App () {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className='App-buttons'>
          <button id='login-button'> Log in with Spotify</button>
          <button id='logout-button'> Logout</button>
        </div>
      </div>
    );
}

export default App;
