/* exported data */
var data = {
  view: 'search-form',
  movies: [],
  favorites: [],
  modal: [],
  nextEntryId: 1,
  resultNumber: null,
  searchKeyword: ''
};

var previousMovieEntryJSON = localStorage.getItem('movie-data-storage');
if (previousMovieEntryJSON !== null) {
  data = JSON.parse(previousMovieEntryJSON);
}

// this event stores the data object into local storage
window.addEventListener('beforeunload', function (event) {
  var movieDataJSON = JSON.stringify(data);
  this.localStorage.setItem('movie-data-storage', movieDataJSON);
});
