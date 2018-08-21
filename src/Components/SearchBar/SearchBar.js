import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{

  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }


  handleTermChange(event){
      this.setState({
        term: event.target.value
      });
      return event.target.value;
  }

//This feature makes user do less work by hitting "Enter Key" instead of hitting "Search Button"
  handleEnterKey(event){
    if(event.key === 'Enter') {
      return this.props.onSearch(this.state.term)
    }
    return;
  }

  search(){

    this.props.onSearch(this.state.term);
  }

  render(){
    return(
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
         onChange = {this.handleTermChange}
         onKeyPress = {this.handleEnterKey}
         />
        <a onClick= {this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
