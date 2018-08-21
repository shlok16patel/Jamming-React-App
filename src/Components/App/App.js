import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';



class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks:[]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

 //addTrack function adds a songs to the playlist state
 addTrack(track){
    //track already exists in the playlist and break out of the method if it does
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
      } else {
        //if track does not exist in the playlist, add it
        let newPlaylistTracks = this.state.playlistTracks;
        newPlaylistTracks.push(track);
        this.setState({
          playlistTracks: newPlaylistTracks
        });
      }
  }

  //removeTrack functions removes songs from the playlist state
  removeTrack(track){
    let trackIndex = 0;

    this.state.playlistTracks.map(savedTrack => {
      if (savedTrack.id === track.id) {
        trackIndex = this.state.playlistTracks.indexOf(savedTrack)
      }
   })
   let newPlaylistTracks = this.state.playlistTracks;
   newPlaylistTracks.splice(trackIndex,1);
   this.setState({
     playlistTracks: newPlaylistTracks
    });

  }

  //updatePlaylistName changes the name of the Playlist and save the updated value to the playlistTracks
  updatePlaylistName(name){
    this.setState({ playlistName: name});
  }


  //savePlaylist method is to save the playlist to the Spotify Account
  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
       });
    });
  }

  search(term){
    Spotify.search(term).then(response => {
      this.setState({
        searchResults: response
      });
    })
  }

  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch = {this.search}/>
        <div className="App-playlist">
        <SearchResults
          searchResults = {this.state.searchResults}
          onAdd= {this.addTrack}/>

        <Playlist
         playlistName = {this.state.playlistName}
         playlistTracks = {this.state.playlistTracks}
         onRemove= {this.removeTrack}
         onNameChange={this.updatePlaylistName}
         onSave={this.savePlaylist}/>

        </div>
        </div>
      </div>
    );
  }
}
 export default App;
