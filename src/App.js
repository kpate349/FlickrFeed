import React from 'react';
import './App.css';
import fetchJsonP from 'fetch-jsonp';
import Background from './background_image.jpg'


var myStyle = {
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat', /* background style   */
  backgroundPosition: 'center',
};


class App extends React.Component {

  constructor() {
    super();
    this.state = {
      search: "",
      searchPictures: [],    /* my data storage */
      pictures: [],
    };
  }

  componentDidMount() {

    fetchJsonP("https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=jsonp_1565561998726_23514", { /* calling a public feed and fetching jsonP data */
      jsonpCallback: 'jsoncallback',
      timeout: 3000
    }).catch ((error) => {
      console.log("Error was found when fetching jsonP", error);
    })
    .then (function(response) {
      return response.json();
    }).catch((error) => {
      console.log("Error was found when converting to json", error);
    })
    .then (function (x) {    
      let xarray = x.items.map((pic) => { /* parsing the jsonP data from public feed and creating an array of images */
      var srcPath = pic.media.m;  /* saving the direct image link */
      return (
        <img alt = {pic.title} src = {srcPath} class="rounded mx-auto d-block"  mode = 'fit'></img>
      )
    })
    this.setState({pictures: xarray});   
  }.bind(this)).catch((error) => {
    console.log("Error was found when creating an array of images", error);
  })
  }


  getSearchPicture(x) {
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+ process.env.REACT_APP_API_KEY+'&tags=' + x + '&per_page=12&page=3&format=json&nojsoncallback=1') /* calling the search method with my api key with search tags*/
    .catch ((error) => {
      console.log("Error was found when fetching json from api call", error);
    })
    .then (function(response) {
      return response.json(); 
    }).catch((error) => {
      console.log("Error was found when converting to json", error);
    })
    .then (function(x) {
      let xarray2 = x.photos.photo.map((pic) => {
        var srcPath2 = 'https://farm'+ pic.farm +'.staticflickr.com/'+ pic.server +'/'+ pic.id +'_'+pic.secret+'.jpg'; /* manually creating the image direct link because it is not a JSONP being returned */
        return (
          <img alt = {pic.title} src = {srcPath2} class="rounded mx-auto d-block" mode = 'fit' ></img>
        )
      })
      this.setState({searchPictures : xarray2});
    }.bind(this)).catch((error) => {
      console.log("Error was found when creating an array of images", error);
    })
  }


  onchange = e => {
    this.setState({search : e.target.value})  /* user's search tag */
  }

  render() {

    var result = [];

    if (this.state.search !== "") {
    this.getSearchPicture(this.state.search);   /* simply checking if the search tag is empty or anything is being searched in the field, and appropriately making api calls if needed */
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
