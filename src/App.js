import React from 'react';
import './App.css';
import fetchJsonP from 'fetch-jsonp';
import Background from './background_image.jpg'


var myStyle = {
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
};


class App extends React.Component {

  constructor() {
    super();
    this.state = {
      search: "",
      searchPictures: [],
      pictures: [],
    };
  }

  componentDidMount() {

    fetchJsonP("https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonp_1565561998726_23514", {
      jsonpCallback: 'jsoncallback',
      timeout: 3000
    })
    .then (function(response) {
      return response.json();
    })
    .then (function (x) {    
      let xarray = x.items.map((pic) => {
      var srcPath = pic.media.m;
      return (
        <img alt = {pic.title} src = {srcPath} class="rounded mx-auto d-block"  mode = 'fit'></img>
      )
    })
    this.setState({pictures: xarray});
  }.bind(this))
  }


  getSearchPicture(x) {
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+ process.env.REACT_APP_API_KEY+'&tags=' + x + '&per_page=12&page=3&format=json&nojsoncallback=1')
    .then (function(response) {
      return response.json();
    })
    .then (function(x) {
      let xarray2 = x.photos.photo.map((pic) => {
        var srcPath2 = 'https://farm'+ pic.farm +'.staticflickr.com/'+ pic.server +'/'+ pic.id +'_'+pic.secret+'.jpg';
        return (
          <img alt = {pic.title} src = {srcPath2} class="rounded mx-auto d-block" mode = 'fit' ></img>
        )
      })
      this.setState({searchPictures : xarray2});
    }.bind(this))
  }


  onchange = e => {
    this.setState({search : e.target.value})
  }

  render() {

    var result = [];
    if (this.state.search !== "") {
    this.getSearchPicture(this.state.search);
    result = this.state.searchPictures;
    }
    else {
    result = this.state.pictures;
    }

    return (
      <div style = {myStyle} className = "App">
      <input label="Search" icons="search" onChange={this.onchange}/>
      <p className="App-intro">
        {result}
      </p>
      </div>
    );
  }
}


export default App;
