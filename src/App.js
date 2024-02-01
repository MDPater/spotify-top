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
        <div className='login'>
          <button id='login-button'>Log in with Spotify</button>
        </div>
        <div id='loggedin'>
          <div id='results'>
            <div id='tracks'></div>
            <div id='artists'></div>
          </div>
          <button id='logout-button'>Logout</button>
        </div>
      </div>
    );
}

export default App;
