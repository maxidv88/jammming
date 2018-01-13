import React from 'react';
import './Track.css';


class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.state = {hide: false};

  }

  addTrack(event) {
    this.props.onAdd(this.props.track);
    this.setState({hide: true});
  }

  removeTrack(event) {
    this.props.onRemove(this.props.track);
    //this.setState({hide: false}); it's not needed
  }

  className() {
    return this.state.hide ? 'Track Track-hide' : 'Track';
  }


  render() {
    let previewTrack = ''; // this variable show the track preview if available
    if (this.props.track.previewUrl !== null) {
      previewTrack = (
        <div className="Preview-audio">
          <audio controls preload="none">
            <source src={this.props.track.previewUrl} type="audio/ogg" />
          </audio>
        </div>
      )

    }

    return(
      <div className={this.className()}>
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
          {previewTrack}
        </div>
        <a className='Track-action' onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}>{this.props.isRemoval ? '-' : '+'}</a>

      </div>
    );

  }

}

export default Track;
