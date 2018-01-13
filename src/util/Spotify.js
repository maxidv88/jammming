
const CLIENT_ID = 'fb6de1218f934f0496a41988569f726e';
const REDIRECT_URI = 'http://localhost:3000';

let Spotify = { };

Spotify.requestAccessToken = function() {
      //get access token from SPOTIFY
      const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=playlist-modify-public`;
      localStorage.setItem('redirect', '1');
      console.log('estoy dentro de requestAccessToken valor de redirect es: '+localStorage.getItem('redirect'));
      window.location.assign(url);
}


Spotify.search = function(term) {
  const accessToken = localStorage.getItem('accessToken');
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
                uri: track.uri,
                previewUrl: track.preview_url
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
  const userAccessToken = localStorage.getItem('accessToken');
  let userId;
  const headers1 = { Authorization: `Bearer ${userAccessToken}` };
  const headers2 = { Authorization: `Bearer ${userAccessToken}`, 'Content-Type': 'application/json' };
  let playListId = '';

  return fetch('https://api.spotify.com/v1/me', {headers: headers1}).then( response => response.json() ).then(
      jsonResponse => {
        userId = jsonResponse.id;
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

Spotify.getUserName = async function() {
  try{
    const userAccessToken = localStorage.getItem('accessToken');
    const headers1 = { Authorization: `Bearer ${userAccessToken}` };
    let response = await fetch('https://api.spotify.com/v1/me', {headers: headers1});
    if (response.ok) {
      let jsonResponse = await response.json();
      return jsonResponse;
    }
    if (response.status === 401){
      localStorage.setItem('accessToken', '')
      console.log('status 401: '+localStorage.getItem('accessToken'))
    }
    throw new Error('Fail!');
  } catch(error) {
    console.log(error);
    return '';
  }

}


export default Spotify;
