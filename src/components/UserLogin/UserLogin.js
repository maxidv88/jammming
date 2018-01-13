import React from 'react';
import './UserLogin.css';
import Spotify from '../../util/Spotify.js';


class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      userName: ''
    }
  }

  componentWillMount() {
    if (this.props.userLoggedIn === false || localStorage.getItem('accessToken') ) {// if user is not logged in
      if (localStorage.getItem('redirect') === '1') {//handle login after redirect with token in url
        this.getAccessTokenFromUrl();
        localStorage.setItem('redirect','0')
      }
      if (localStorage.getItem('accessToken')) {
        this.props.updateLogin(true);
      } else {
        this.props.updateLogin(false);
      }
      this.props.restorePlayListInfo();
      Spotify.getUserName().then(result => this.setState({ userName: result.id }) );
    } else { // if userLoggedIn es true y no hay token
      this.props.updateLogin(false);
    }
  }

  getAccessTokenFromUrl() {
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      let accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      localStorage.setItem('accessToken',accessToken);
      setTimeout( this.logOut , expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
  }

  login(event) { //when we click the login button we save the playlist info and requestAccessToken
    localStorage.setItem('playListName', this.props.playListName);
    localStorage.setItem('playListTracks', JSON.stringify(this.props.playListTracks));
    Spotify.requestAccessToken();
  }

  logOut(event) {
    localStorage.setItem('accessToken', '');
    this.props.updateLogin(false);
  }

  render() {

    let userInfo = '';

    if (this.props.userLoggedIn === false) {
      userInfo = (
        <div className="Login">
          <p>Please, login to search from spotify</p>
          <a onClick={this.login}> Login to Spotify </a>
        </div>
      )
    } else {
      userInfo = (
        <div className="Logout">
          <p>Hey! Welcome {this.state.userName}</p>
          <a onClick={this.logOut}> Logout </a>
        </div>
      )

    }

    return(

      <div>
        {userInfo}
      </div>
    )

  }
}

export default UserLogin;
