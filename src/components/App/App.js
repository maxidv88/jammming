import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import PlayList from '../PlayList/PlayList.js';
import Spotify from '../../util/Spotify.js';
import UserLogin from '../UserLogin/UserLogin.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [],
                  playListName: 'jammmingPlaylist',
                  playListTracks: [],
                  userLoggedIn: false
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
    this.updateLoginStatus = this.updateLoginStatus.bind(this);
    this.restorePlayListInfo = this.restorePlayListInfo.bind(this);
  }

  addTrack(newTrack) { //add track to the playList
    let notExist = true;
    this.state.playListTracks.forEach( track => {
      if (newTrack.id === track.id) {//check if the track exist in the playList
        notExist = false;
      }
    });
    if (notExist) { //add the track
      let newPlayListTracks = this.state.playListTracks;
      newPlayListTracks.push(newTrack);
      this.setState( {playListTracks: newPlayListTracks});
      // we can add here a function that removeTrackfromSearchList from searchList
    }
  }

  removeTrack(trackToRemove) {
    let newPlayListTracks = this.state.playListTracks.filter( track =>
        track.id !== trackToRemove.id
    );
    this.setState( {playListTracks: newPlayListTracks} );

    const index = this.state.searchResults.indexOf(trackToRemove);
    let newSearchResults = this.state.searchResults;
    if(index >= 0){// if track is hidden index >=0
      console.log('indice de removetrack: '+index);
      newSearchResults[index].id = Math.random().toString();
      this.setState( {searchResults: newSearchResults} );
    } else { // if track is not hidden add it to the botton
      newSearchResults.push(trackToRemove);
      this.setState( {searchResults: newSearchResults} );
    }
  }

  updatePlayListName(name) {
    this.setState({ playListName: name });
  }

  savePlayList() {
    let trackURIs = [];
    this.state.playListTracks.map( track =>
      trackURIs.push(track.uri)
    );
    Spotify.savePlayList(this.state.playListName, trackURIs).then( () => {
      this.setState({ playListName: 'New Playlist', playListTracks: [] });
    });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  updateLoginStatus(loginStatus) {
    this.setState({ userLoggedIn: loginStatus});
  }

  restorePlayListInfo() {
    let storedPLN = localStorage.getItem('playListName');
    let storedPLT = localStorage.getItem('playListTracks');
    storedPLT = JSON.parse(storedPLT);
    if (!storedPLT) {
      storedPLT = [];
    }

    this.setState({playListName: storedPLN })
    this.setState({playListTracks: storedPLT });
  }


  render() {

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <UserLogin userLoggedIn={this.state.userLoggedIn}
                     updateLogin={this.updateLoginStatus}
                     playListName={this.state.playListName}
                     playListTracks={this.state.playListTracks}
                     restorePlayListInfo={this.restorePlayListInfo} />
          <SearchBar onSearch={this.search} userLoggedIn={this.state.userLoggedIn}/>
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <PlayList playListName={this.state.playListName}
                    playListTracks={this.state.playListTracks}
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlayListName}
                    onSave={this.savePlayList}
                    userLoggedIn={this.state.userLoggedIn} />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
