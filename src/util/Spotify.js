let accessToken = '';

const clientID = '91cdd0cca7c149fd905e8a870c02725b';
const redirectURI = 'http://localhost:3000/';

const Spotify =  {

  getAccessToken(){

    if (accessToken !== '') {
      return accessToken;
    }
    const accessTokenArray = window.location.href.match(/access_token=([^&]*)/);
    const expiresInArray = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenArray && expiresInArray) {
        accessToken = accessTokenArray[1];
        let expiresIn = Number(expiresInArray[1]);
        window.setTimeout(() => accessToken = '', expiresIn*1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      }
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;

  },
  search(term){
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }).then(response => {
      if(response.ok){
        return response.json();
      }
      throw new Error('Request failed!');
    }).then(jsonResponse => {
      if(!jsonResponse.tracks){
        return [];
      }
      return jsonResponse.tracks.items.map(track =>({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        preview_url: track.preview_url
      }));
    })
  },
  //creates a playlist in user's Spotify account
  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;


    return fetch(`https://api.spotify.com/v1/me`, {headers: headers}).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }).then(jsonResponse => {
      userId = jsonResponse.id;

      // POST request to create new playlist
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: playlistName })
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }).then(jsonResponse => {
        const playlistId = jsonResponse.id;

      // POST request to add tracks to a playlist
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
        });
       })
      })
  }


};
export default Spotify;
