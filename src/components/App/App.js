import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import PlayList from '../PlayList/PlayList.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [/*{ name: 'Black and white',
                                    artist: 'Michael Jackson',
                                    album: 'Black and White',
                                    id: 2,
                                    uri: 'sdsdffa2424'
                                  }*/],
                  playListName: 'jammmingPlaylist',
                  playListTracks: [/*{ name: 'Need to Believe',
                  artist: 'Gotthard',
                  album: 'Need to believe',
                  id: 1,
                  uri: 'sdsdffa242446gk'
                }*/]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(newTrack) {
    let notExist = true;
    this.state.playListTracks.forEach( track => {
      if (newTrack.id === track.id) {//check if the track exist in the playList
        notExist = false;
      }
    });
    if (notExist) { //add the track
      let newPlayListTracks = this.state.playListTracks;
      newPlayListTracks.push(newTrack);
      this.setState( {playListTracks: newPlayListTracks})
    }

  }

  removeTrack(trackToRemove) {
    let newPlayListTracks = this.state.playListTracks.filter( track =>
        track.id !== trackToRemove.id
    );
    this.setState( {playListTracks: newPlayListTracks} );
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
    /*let searchSpotify = Spotify.search(term);
    console.log(searchSpotify);
    this.setState( { searchResults: searchSpotify} );*/
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <PlayList playListName={this.state.playListName}
                    playListTracks={this.state.playListTracks}
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlayListName}
                    onSave={this.savePlayList} />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
