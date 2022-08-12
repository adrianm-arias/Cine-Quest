// CAPTURES SEARCH INPUT VALUES

var $searchForm = document.querySelector('.search-form');
var $searchResultKeyword = document.querySelector('.search-results-keyword');
var $searchResultNumber = document.querySelector('.search-results-number');

// QUERIES DATA VIEW PROPERTIES FROM DOM

var $viewSearchMovies = document.querySelector('[data-view="search-movies"]');
var $viewSearchForm = document.querySelector('[data-view="search-form"]');
var $upcomingMoviesView = document.querySelector('[data-view="upcoming-movies-view"]');
var $popularMoviesView = document.querySelector('[data-view="popular-movies-view"]');
var $watchListView = document.querySelector('[data-view="watch-list-view"]');
var $addedMovieModal = document.querySelector('[data-view="added-movie-modal"]');

var $searchFooterForm = document.querySelector('.footer-form');

// FUNCTION LISTEN FOR SUBMIT EVENT OF SEARCH INPUTS

document.addEventListener('submit', function (event) {
  // resets data object

  event.preventDefault();
  $upcomingMoviesView.className = 'hidden';
  $popularMoviesView.className = 'hidden';
  $watchListView.className = 'hidden';
  data.resultNumber = null;
  data.searchKeyword = '';
  data.movies = [];
  var $movieRenderUl = document.getElementById('movie-render-ul');
  $movieRenderUl.textContent = '';

  if (event.target.matches('.search-form')) {
    // calls search api for main input

    var searchQuery = $searchForm.elements.search.value;
    $searchForm.reset();
    searchApi(searchQuery);
    $searchResultKeyword.textContent = searchQuery;
    data.searchKeyword = searchQuery;
    $viewSearchMovies.className = '';
    $viewSearchForm.className = 'hidden';
    data.view = 'search-movies';
  }
  if (event.target.matches('.footer-form')) {
    // calls search api for footer input
    var searchQueryFooter = $searchFooterForm.elements.search.value;
    $searchFooterForm.reset();
    searchApi(searchQueryFooter);
    $searchResultKeyword.textContent = searchQueryFooter;
    data.searchKeyword = searchQueryFooter;
    $viewSearchMovies.className = '';
    $viewSearchForm.className = 'hidden';
    data.view = 'search-movies';
  }
});

// CHANGES VIEWS TO SEARCH FORM (NAV LINK)

var $searchNavLink = document.getElementById('search-nav-link');

$searchNavLink.addEventListener('click', function (event) {
  $viewSearchMovies.className = 'hidden';
  $upcomingMoviesView.className = 'hidden';
  $popularMoviesView.className = 'hidden';
  $watchListView.className = 'hidden';
  $viewSearchForm.className = '';
  data.view = 'search-form';
  data.movies = [];
  // HIDES NAV ONCE NAV LINK IS CLICKED
  $navElement.classList.remove('nav-open');
  $navIcon.forEach(icon => {
    icon.classList.toggle('hidden');
  });
});

// API FOR SEARCH BY MOVIE TITLE FEATURE

function searchApi(keyword) {
  var targetUrl = encodeURIComponent('https://api.themoviedb.org/3/search/movie?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl + 'query=' + keyword + '&page=1');
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var response = xhr.response.results;
    var resultNo = xhr.response.total_results;
    $searchResultNumber.textContent = resultNo;
    data.resultNumber = resultNo;
    for (var i = 0; i < response.length; i++) {
      var movieEntry = {};
      movieEntry.title = response[i].title;
      movieEntry.releaseDate = response[i].release_date;
      movieEntry.userRating = response[i].vote_average;
      movieEntry.entryId = response[i].id;
      if (response[i].poster_path === null) {
        movieEntry.posterUrl = 'images/placerholder-image.jpeg';
      } else {
        movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
      }
      movieEntry.description = response[i].overview;
      data.movies.push(movieEntry);
      var renderNewMovie = renderMovies(movieEntry);
      var ulElement = document.getElementById('movie-render-ul');
      ulElement.appendChild(renderNewMovie);
    }
  });
  xhr.send();
}

// FUNCTION RENDERS MOVIE DATA FROM API

function renderMovies(movie) {

  var liItem = document.createElement('li');
  var divRow = document.createElement('div');
  divRow.className = 'row flex-row justify-content-center pad-bottom';
  liItem.appendChild(divRow);
  liItem.setAttribute('data-entry-id', movie.entryId);

  var divColumn = document.createElement('div');
  divColumn.className = 'column-one-thirds';
  divRow.appendChild(divColumn);

  var movieImg = document.createElement('img');
  movieImg.className = 'movie-img-small';
  movieImg.setAttribute('src', movie.posterUrl);
  divColumn.appendChild(movieImg);

  var divColumnText = document.createElement('div');
  divColumnText.className = 'column-two-thirds flex-row movie-border align-cont-center';
  divRow.appendChild(divColumnText);

  var divWrapper = document.createElement('div');
  divWrapper.className = 'movie-details-wrapper';
  divColumnText.appendChild(divWrapper);

  var movieTitle = document.createElement('h1');
  movieTitle.textContent = movie.title;
  movieTitle.className = 'movie-title';
  divWrapper.appendChild(movieTitle);
  var movieRelease = document.createElement('h2');
  movieRelease.className = 'movie-info';
  movieRelease.textContent = 'Release Date: ' + movie.releaseDate;
  divWrapper.appendChild(movieRelease);
  var movieRating = document.createElement('h2');
  movieRating.className = 'movie-info';
  movieRating.textContent = 'User Rating: ' + movie.userRating;
  divWrapper.appendChild(movieRating);

  var btnWrapper = document.createElement('div');
  btnWrapper.className = 'flex-row align-cont-center';
  divWrapper.appendChild(btnWrapper);
  var movieBtn = document.createElement('button');
  movieBtn.textContent = 'View Movie Details';
  movieBtn.className = 'movie-btn';
  btnWrapper.appendChild(movieBtn);
  var addBtn = document.createElement('img');
  addBtn.setAttribute('src', 'images/add-icon.svg');
  // addBtn.setAttribute('id', 'add-movie-icon');
  addBtn.className = 'add-icon';
  btnWrapper.appendChild(addBtn);

  return liItem;
}

// EVENT OPENS MODAL AND POPULATES MOVIE DATA FROM MOVIES ARRAY
document.addEventListener('click', function (event) {
  if (data.view !== 'watch-list-view') {
    if (event.target && event.target.matches('.movie-btn')) {
      var targetLi = event.target.closest('li');
      var targetId = targetLi.getAttribute('data-entry-id');
      var targetIdNumber = parseInt(targetId);
      var movieCardModal = {};
      for (var i = 0; i < data.movies.length; i++) {
        if (targetIdNumber === data.movies[i].entryId) {
          var $modalCardTitle = document.querySelector('.movie-title-card');
          $modalCardTitle.textContent = data.movies[i].title;
          movieCardModal.title = data.movies[i].title;
          var $modalCardDate = document.querySelector('.movie-info-card-date');
          $modalCardDate.textContent = data.movies[i].releaseDate;
          movieCardModal.date = data.movies[i].releaseDate;
          var $modalCardRating = document.querySelector('.movie-info-card-rating');
          $modalCardRating.textContent = data.movies[i].userRating + ' / 10';
          movieCardModal.rating = data.movies[i].userRating + ' / 10';
          var $modalCardUrl = document.querySelector('.movie-img-card');
          $modalCardUrl.setAttribute('src', data.movies[i].posterUrl);
          movieCardModal.imgUrl = data.movies[i].posterUrl;
          var $modalCardDesc = document.querySelector('.movie-info-card-desc');
          $modalCardDesc.textContent = data.movies[i].description;
          movieCardModal.description = data.movies[i].description;
          movieCardModal.entryId = data.movies[i].entryId;
        }
      }
      data.modal.push(movieCardModal);
      var $modalCard = document.querySelector('[data-view="modal-card-view"]');
      $modalCard.className = '';
    }
    if (event.target.matches('.now-playing-link')) {
      var targetLiNowPlaying = event.target.closest('li');
      var targetIdNowPlaying = targetLiNowPlaying.getAttribute('data-entry-id');
      var targetIdNumberNowPlaying = parseInt(targetIdNowPlaying);
      var movieCardModalNowPlaying = {};
      for (var y = 0; y < data.playing.length; y++) {
        if (targetIdNumberNowPlaying === data.playing[y].entryId) {
          var $modalCardTitleNowPlaying = document.querySelector('.movie-title-card');
          $modalCardTitleNowPlaying.textContent = data.playing[y].title;
          movieCardModalNowPlaying.title = data.playing[y].title;
          var $modalCardDateNowPlaying = document.querySelector('.movie-info-card-date');
          $modalCardDateNowPlaying.textContent = data.playing[y].releaseDate;
          movieCardModalNowPlaying.date = data.playing[y].releaseDate;
          var $modalCardRatingNowPlaying = document.querySelector('.movie-info-card-rating');
          $modalCardRatingNowPlaying.textContent = data.playing[y].userRating + ' / 10';
          movieCardModalNowPlaying.rating = data.playing[y].userRating + ' / 10';
          var $modalCardUrlNowPlaying = document.querySelector('.movie-img-card');
          $modalCardUrlNowPlaying.setAttribute('src', data.playing[y].posterUrl);
          movieCardModalNowPlaying.imgUrl = data.playing[y].posterUrl;
          var $modalCardDescNowPlaying = document.querySelector('.movie-info-card-desc');
          $modalCardDescNowPlaying.textContent = data.playing[y].description;
          movieCardModalNowPlaying.description = data.playing[y].description;
          movieCardModalNowPlaying.entryId = data.playing[y].entryId;
        }
      }
      data.modal.push(movieCardModalNowPlaying);
      var $modalCardNowPlaying = document.querySelector('[data-view="modal-card-view"]');
      $modalCardNowPlaying.className = '';
    }
  }
});

document.addEventListener('click', function (event) {
  if (data.view === 'watch-list-view') {
    if (event.target && event.target.matches('.movie-btn')) {

      var targetLi = event.target.closest('li');
      var targetId = targetLi.getAttribute('data-entry-id');
      var targetIdNumber = parseInt(targetId);
      var movieCardModal = {};
      for (var i = 0; i < data.favorites.length; i++) {
        if (targetIdNumber === data.favorites[i].entryId) {
          var $modalCardTitleList = document.querySelector('.movie-list-title-card');
          $modalCardTitleList.textContent = data.favorites[i].title;
          movieCardModal.title = data.favorites[i].title;
          var $modalCardDateList = document.querySelector('.list-movie-info-card-date');
          $modalCardDateList.textContent = data.favorites[i].releaseDate;
          movieCardModal.date = data.favorites[i].releaseDate;
          var $modalCardRatingList = document.querySelector('.list-movie-info-card-rating');
          $modalCardRatingList.textContent = data.favorites[i].userRating + ' / 10';
          movieCardModal.rating = data.favorites[i].userRating + ' / 10';
          var $modalCardUrlList = document.querySelector('.list-movie-img-card');
          $modalCardUrlList.setAttribute('src', data.favorites[i].posterUrl);
          movieCardModal.imgUrl = data.movies[i].posterUrl;
          var $modalCardDescList = document.querySelector('.list-movie-info-card-desc');
          $modalCardDescList.textContent = data.favorites[i].description;
          movieCardModal.description = data.favorites[i].description;
          movieCardModal.entryId = data.favorites[i].entryId;
        }
      }
      data.modal.push(movieCardModal);
      var $modalCard = document.querySelector('[data-view="list-modal-view"]');
      $modalCard.className = '';

    }
  }

});

// EVENT CLOSES LIST MODAL WINDOW WHEN X BUTTON IS CLICKED

var $closeListModalBtn = document.querySelector('.list-modal-btn');
$closeListModalBtn.addEventListener('click', function (event) {
  var $modalCard = document.querySelector('[data-view="list-modal-view"]');
  $modalCard.className = 'hidden';
  data.modal = [];
});

// EVENT CLOSES MODAL WINDOW WHEN X BUTTON IS CLICKED

var $closeModalBtn = document.querySelector('.modal-btn');
$closeModalBtn.addEventListener('click', function (event) {
  var $modalCard = document.querySelector('[data-view="modal-card-view"]');
  $modalCard.className = 'hidden';
  data.modal = [];
});

// ENSURES CORRECT PAGE VIEW IS LOADED AFTER PAGE REFRESH
window.addEventListener('DOMContentLoaded', function loadMovies() {

  if (data.view === 'search-form') {
    $viewSearchForm.className = '';
    $viewSearchMovies.className = 'hidden';
    $upcomingMoviesView.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    $watchListView.className = 'hidden';

  }
  if (data.view === 'search-movies') {
    for (var i = 0; i < data.movies.length; i++) {
      var ulElement = document.getElementById('movie-render-ul');
      var movieRefresh = renderMovies(data.movies[i]);
      ulElement.appendChild(movieRefresh);
      $searchResultNumber.textContent = data.resultNumber;
      $searchResultKeyword.textContent = data.searchKeyword;
    }
    $viewSearchMovies.className = '';
    $viewSearchForm.className = 'hidden';
    $upcomingMoviesView.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    $watchListView.className = 'hidden';

  }
  if (data.view === 'upcoming-movies-view') {
    for (var y = 0; y < data.movies.length; y++) {
      var ulElementUpcoming = document.getElementById('upcoming-movie-render-ul');
      var upcomingMovieRefresh = renderMovies(data.movies[y]);
      ulElementUpcoming.appendChild(upcomingMovieRefresh);
    }
    $upcomingMoviesView.className = '';
    $viewSearchForm.className = 'hidden';
    $viewSearchMovies.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    $watchListView.className = 'hidden';
  }
  if (data.view === 'popular-movies-view') {
    for (var j = 0; j < data.movies.length; j++) {
      var ulElementPopular = document.getElementById('popular-movie-render-ul');
      var popularMovieRefresh = renderMovies(data.movies[j]);
      ulElementPopular.appendChild(popularMovieRefresh);
    }
    $popularMoviesView.className = '';
    $upcomingMoviesView.className = 'hidden';
    $viewSearchForm.className = 'hidden';
    $viewSearchMovies.className = 'hidden';
    $watchListView.className = 'hidden';
  }
  if (data.view === 'watch-list-view') {
    for (var a = 0; a < data.favorites.length; a++) {
      var ulElementWatchList = document.getElementById('watch-list-render-ul');
      var WatchListRefresh = renderMovies(data.favorites[a]);
      ulElementWatchList.appendChild(WatchListRefresh);
    }
    changePlusIcon();
    $popularMoviesView.className = 'hidden';
    $upcomingMoviesView.className = 'hidden';
    $viewSearchForm.className = 'hidden';
    $viewSearchMovies.className = 'hidden';
    $watchListView.className = '';
  }
});

// LISTENS FOR ALL 'UPCOMING' LINKS/BUTTONS TO CALL API
document.addEventListener('click', function (event) {
  if (event.target.matches('#upcoming-nav-link') ||
  event.target.matches('#upcoming-footer-link') ||
    event.target.matches('.upcoming-movie-btn')) {

    // hides other views not in use

    $viewSearchMovies.className = 'hidden';
    $watchListView.className = 'hidden';
    $viewSearchForm.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    $upcomingMoviesView.className = '';

    // hides mobile nav once clicked

    if (event.target.matches('#upcoming-nav-link')) {
      $navElement.classList.remove('nav-open');
      $navIcon.forEach(icon => {
        icon.classList.toggle('hidden');
      });
    }

    // resets data model object

    data.resultNumber = null;
    data.searchKeyword = '';
    data.movies = [];

    // calls for api for upcoming movies

    var targetUrl = encodeURIComponent('https://api.themoviedb.org/3/movie/upcoming?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&page=1');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
    xhr.setRequestHeader('token', 'abc123');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var response = xhr.response.results;
      for (var i = 0; i < response.length; i++) {
        var movieEntry = {};
        movieEntry.title = response[i].title;
        movieEntry.releaseDate = response[i].release_date;
        movieEntry.userRating = response[i].vote_average;
        movieEntry.entryId = response[i].id;
        if (response[i].poster_path === null) {
          movieEntry.posterUrl = 'images/placerholder-image.jpeg';
        } else {
          movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
        }
        movieEntry.description = response[i].overview;
        data.movies.push(movieEntry);
        var renderNewMovie = renderMovies(movieEntry);
        var ulElement = document.getElementById('upcoming-movie-render-ul');
        ulElement.appendChild(renderNewMovie);
      }
      data.view = 'upcoming-movies-view';
      $upcomingMoviesView.className = '';
    });
    xhr.send();
  }
});

// RESPONSIVE NAV BAR

var $navToggle = document.getElementById('nav-toggle');
var $navElement = document.querySelector('nav');
var $navIcon = document.querySelectorAll('.nav-icon');
var $burgerMenu = document.querySelector('#burger-menu');

$navToggle.addEventListener('click', function () {
  $navElement.classList.toggle('nav-open');
  $navIcon.forEach(icon => {
    icon.classList.toggle('hidden');
  });
});

window.addEventListener('resize', function () {
  if (document.body.clientWidth > 768) {
    $navElement.classList.remove('nav-open');
    $navIcon.forEach(icon => {
      icon.classList.add('hidden');
    });
    $burgerMenu.classList.remove('hidden');
  }
});

// LISTENS FOR ALL 'POPULAR' LINKS/BUTTONS TO CALL API
document.addEventListener('click', function (event) {
  if (event.target.matches('#popular-nav-link') ||
    event.target.matches('#popular-footer-link') ||
    event.target.matches('.popular-movie-btn')) {

    // hides mobile nav once link is clicked
    if (event.target.matches('#popular-nav-link')) {
      $navElement.classList.remove('nav-open');
      $navIcon.forEach(icon => {
        icon.classList.toggle('hidden');
      });
    }

    // hides other views not in use

    $viewSearchMovies.className = 'hidden';
    $watchListView.className = 'hidden';
    $viewSearchForm.className = 'hidden';
    $upcomingMoviesView.className = 'hidden';
    $popularMoviesView.className = '';

    // resets data model object

    data.resultNumber = null;
    data.searchKeyword = '';
    data.movies = [];

    // calls for api for popular movies

    var targetUrl = encodeURIComponent('https://api.themoviedb.org/3/movie/popular?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&page=1');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
    xhr.setRequestHeader('token', 'abc123');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var response = xhr.response.results;
      for (var i = 0; i < response.length; i++) {
        var movieEntry = {};
        movieEntry.title = response[i].title;
        movieEntry.releaseDate = response[i].release_date;
        movieEntry.userRating = response[i].vote_average;
        movieEntry.entryId = response[i].id;
        if (response[i].poster_path === null) {
          movieEntry.posterUrl = 'images/placerholder-image.jpeg';
        } else {
          movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
        }
        movieEntry.description = response[i].overview;
        data.movies.push(movieEntry);
        var renderNewMovie = renderMovies(movieEntry);
        var ulElement = document.getElementById('popular-movie-render-ul');
        ulElement.appendChild(renderNewMovie);
      }
      data.view = 'popular-movies-view';
      $popularMoviesView.className = '';
    });
    xhr.send();
  }
});
function hideAddedMovieModal() {
  $addedMovieModal.className = 'hidden';
}
// EVENT ADDS MOVIE TO FAV ARRAY ONCE + BUTTON IS CLICKED

document.addEventListener('click', function (event) {

  if (event.target && event.target.matches('.add-icon')) {
    var targetLi = event.target.closest('li');
    var targetId = targetLi.getAttribute('data-entry-id');
    var targetIdNumber = parseInt(targetId);
    var addMovie = {};
    for (var i = 0; i < data.movies.length; i++) {
      if (targetIdNumber === data.movies[i].entryId) {
        addMovie.title = data.movies[i].title;
        addMovie.releaseDate = data.movies[i].releaseDate;
        addMovie.userRating = data.movies[i].userRating;
        addMovie.entryId = data.movies[i].entryId;
        addMovie.posterUrl = data.movies[i].posterUrl;
        addMovie.description = data.movies[i].description;
      }
    }
    data.favorites.unshift(addMovie);
    $addedMovieModal.className = '';
    setTimeout(hideAddedMovieModal, 10000);
  }
});

// FUNCTION CLOSES 'MOVIE ADDED MODAL' ONCE VIEW LIST LINK ON MODAL IS CLICKED
$addedMovieModal.addEventListener('click', function (event) {
  if (event.target.matches('#watch-list-modal-link')) {
    hideAddedMovieModal();
  }
});

// ADD BUTTON FOR MODAL (movie details view)

document.addEventListener('click', function (event) {
  if (event.target && event.target.matches('.add-modal-icon')) {
    var modalId = data.modal[0].entryId;
    var addMovie = {};
    for (var i = 0; i < data.movies.length; i++) {
      if (modalId === data.movies[i].entryId) {
        addMovie.title = data.movies[i].title;
        addMovie.releaseDate = data.movies[i].releaseDate;
        addMovie.userRating = data.movies[i].userRating;
        addMovie.entryId = data.movies[i].entryId;
        addMovie.posterUrl = data.movies[i].posterUrl;
        addMovie.description = data.movies[i].description;
      }
    }
    data.favorites.unshift(addMovie);
    $addedMovieModal.className = '';
    setTimeout(hideAddedMovieModal, 10000);
    var $modalCard = document.querySelector('[data-view="modal-card-view"]');
    $modalCard.className = 'hidden';
    data.modal = [];
  }
});

// LISTENS FOR ALL 'WATCH LIST' LINKS TO SHOW SAVED MOVIES
document.addEventListener('click', function (event) {
  if (event.target.matches('#watch-list-footer-link') ||
    event.target.matches('#watch-list-nav-link') ||
    event.target.matches('#watch-list-modal-link')) {

    var $watchListUl = document.getElementById('watch-list-render-ul');
    $watchListUl.textContent = '';

    // hides mobile nav once link is clicked

    if (event.target.matches('#watch-list-nav-link')) {
      $navElement.classList.remove('nav-open');
      $navIcon.forEach(icon => {
        icon.classList.toggle('hidden');
      });
    }

    // hides other views not in use

    $viewSearchMovies.className = 'hidden';
    $viewSearchForm.className = 'hidden';
    $upcomingMoviesView.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    $watchListView.className = 'hidden';

    for (var x = 0; x < data.favorites.length; x++) {
      var ulElementWatchList = document.getElementById('watch-list-render-ul');
      var WatchListRefresh = renderMovies(data.favorites[x]);
      ulElementWatchList.appendChild(WatchListRefresh);
    }
    data.view = 'watch-list-view';
    $watchListView.className = '';
    $viewSearchForm.className = 'hidden';
    $viewSearchMovies.className = 'hidden';
    $upcomingMoviesView.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    changePlusIcon();

  }
});

// FUNCTION DELETES MOVIE FROM FAV ARRAY ONCE - BUTTON IS CLICKED

document.addEventListener('click', function (event) {
  if (event.target && event.target.matches('.subtract-icon')) {
    var targetLi = event.target.closest('li');
    var targetId = targetLi.getAttribute('data-entry-id');
    var targetIdNumber = parseInt(targetId);

    var $watchListUl = document.getElementById('watch-list-render-ul');
    $watchListUl.textContent = '';
    for (var i = 0; i < data.favorites.length; i++) {
      if (targetIdNumber === data.favorites[i].entryId) {
        data.favorites.splice(i, 1);

        // renders update list
        for (var a = 0; a < data.favorites.length; a++) {
          var ulElementWatchList = document.getElementById('watch-list-render-ul');
          var WatchListRefresh = renderMovies(data.favorites[a]);
          ulElementWatchList.appendChild(WatchListRefresh);
        }
      }
      changePlusIcon();
    }
  }
});

// DELETE BUTTON FOR LIST MODAL (movie details view)

document.addEventListener('click', function (event) {
  if (event.target && event.target.matches('.subtract-modal-icon')) {

    var modalId = data.modal[0].entryId;

    var $watchListUl = document.getElementById('watch-list-render-ul');
    $watchListUl.textContent = '';

    for (var i = 0; i < data.favorites.length; i++) {
      if (modalId === data.favorites[i].entryId) {
        data.favorites.splice(i, 1);

        // renders update list
        for (var a = 0; a < data.favorites.length; a++) {
          var ulElementWatchList = document.getElementById('watch-list-render-ul');
          var WatchListRefresh = renderMovies(data.favorites[a]);
          ulElementWatchList.appendChild(WatchListRefresh);
        }
      }
      var $modalCard = document.querySelector('[data-view="list-modal-view"]');
      $modalCard.className = 'hidden';
      data.modal = [];
      changePlusIcon();
    }
  }
});

// CHANGES + ICONS TO -
function changePlusIcon() {
  var addIcons = document.querySelectorAll('.add-icon');
  addIcons.forEach(function (element) {
    element.setAttribute('src', 'images/subtract-icon.svg');
    element.setAttribute('class', 'subtract-icon');
  });
}

// FUNCTION CALLS 'NOW PLAYING' API
function nowPlayingApi() {
  var targetUrl = encodeURIComponent('https://api.themoviedb.org/3/movie/now_playing?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&page=1');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var response = xhr.response.results;
    for (var i = 0; i < response.length; i++) {
      var movieEntry = {};
      movieEntry.title = response[i].title;
      movieEntry.releaseDate = response[i].release_date;
      movieEntry.userRating = response[i].vote_average;
      movieEntry.entryId = response[i].id;
      if (response[i].poster_path === null) {
        movieEntry.posterUrl = 'images/placerholder-image.jpeg';
      } else {
        movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
      }
      movieEntry.description = response[i].overview;
      data.playing.push(movieEntry);
      var renderNewMovie = renderNowPlaying(movieEntry);
      var ulElement = document.getElementById('now-playing-render-ul');
      ulElement.appendChild(renderNewMovie);
    }
  });
  xhr.send();
}

// FUNCTION RENDERS NOW PLAYING SECTION

function renderNowPlaying(movie) {

  var liItem = document.createElement('li');
  var divCol = document.createElement('div');
  divCol.className = 'column-full pad-left-right';
  liItem.appendChild(divCol);
  liItem.setAttribute('data-entry-id', movie.entryId);

  var movieImg = document.createElement('img');
  movieImg.className = 'now-playing-img';
  movieImg.setAttribute('src', movie.posterUrl);
  divCol.appendChild(movieImg);

  var movieTitle = document.createElement('h3');
  movieTitle.textContent = movie.title;
  movieTitle.className = 'now-playing-title';
  divCol.appendChild(movieTitle);

  var nowPlayingLink = document.createElement('a');
  nowPlayingLink.className = 'now-playing-link';
  nowPlayingLink.textContent = 'View Details >';
  divCol.appendChild(nowPlayingLink);

  return liItem;
}

nowPlayingApi();
var $rightArrow = document.getElementById('right-arrow');

// CONTROLS SCROLL FOR NOW PLAYING

$rightArrow.addEventListener('click', function (event) {
  var nowPlayingUl = document.getElementById('now-playing-render-ul');
  nowPlayingUl.scrollLeft += 225;
});

var $leftArrow = document.getElementById('left-arrow');

$leftArrow.addEventListener('click', function (event) {
  var nowPlayingUl = document.getElementById('now-playing-render-ul');
  nowPlayingUl.scrollLeft -= 225;
});
