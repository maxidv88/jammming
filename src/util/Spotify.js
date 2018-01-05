let accessToken = '';
const CLIENT_ID = 'fb6de1218f934f0496a41988569f726e';
const REDIRECT_URI = 'http://localhost:3000';

let Spotify = {};

Spotify.getAccessToken = function() {
  if (accessToken) {//if accessToken variable is not empty return it
    return accessToken;
  } else {
    //check if access token and expiration time are in the url
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      //get access token from SPOTIFY
      const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=playlist-modify-public`;
      window.location.assign(url);
      }
    }
}

Spotify.search = function(term) {
  accessToken = Spotify.getAccessToken();
  console.log('token: '+accessToken);
  const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
  return fetch(url, { headers: { Authorization: `Bearer ${accessToken}`} } ).then( response => response.json()
  ).then( jsonResponse => {
        if (!jsonResponse.tracks){
          return [];
        } else {
          return jsonResponse.tracks.items.map( track => {
            return(
              {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
              }
            )
          });
        }
    }
  )
}

Spotify.savePlayList = async function(playListName, tracksURIs) {
  if (!playListName || !tracksURIs.length) {
    return;
  }
  const userAccessToken = Spotify.getAccessToken();
  let userId;
  const headers1 = { Authorization: `Bearer ${userAccessToken}` };
  const headers2 = { Authorization: `Bearer ${userAccessToken}`, 'Content-Type': 'application/json' };
  let playListId = '';

  return fetch('https://api.spotify.com/v1/me', {headers: headers1}).then( response => response.json() ).then(
      jsonResponse => {
        userId = jsonResponse.id;
        console.log('toke: '+userAccessToken);
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers2,
          body: JSON.stringify({ name: playListName })
        }).then( response => response.json() ).then(
          jsonResponse => {
            playListId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`, {
              method: 'POST',
              headers: headers2,
              body: JSON.stringify({uris: tracksURIs})
            });
          });
        });
}



export default Spotify;
