import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      term: ''
    }

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);

  }

  search(event) {
    this.props.onSearch(this.state.term);
    event.preventDefault();
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  render() {
    return(
      <div className="SearchBar">
        <form onSubmit={this.search}>
          <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        </form>
        <a onClick={this.search}>SEARCH</a>

      </div>
    );
  }
}

export default SearchBar;
