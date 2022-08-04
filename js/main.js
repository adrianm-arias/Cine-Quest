// CAPTURES SEARCH INPUT VALUES

var $searchForm = document.querySelector('.search-form');
var $searchResultKeyword = document.querySelector('.search-results-keyword');
var $searchResultNumber = document.querySelector('.search-results-number');

// QUERIES DATA VIEW PROPERTIES FROM DOM

var $viewSearchMovies = document.querySelector('[data-view="search-movies"]');
var $viewSearchForm = document.querySelector('[data-view="search-form"]');
var $modalCardView = document.querySelector('[data-view="modal-card-view"]');
var $upcomingMoviesView = document.querySelector('[data-view="upcoming-movies-view"]');

var $searchFooterForm = document.querySelector('.footer-form');

// LISTENS FOR SUBMIT EVENT ON MAIN SEARCH INPUT

$searchForm.addEventListener('submit', function (event) {
  // RESETS DATA OBJECT

  event.preventDefault();
  $upcomingMoviesView.className = 'hidden';
  data.resultNumber = null;
  data.searchKeyword = '';
  data.movies = [];
  data.nextEntryId = 1;
  document.querySelectorAll('[data-entry-id]').forEach(function (event) {
    event.remove();
  });

  // BEGINS SEARCH QUERY FOR API

  var searchQuery = $searchForm.elements.search.value;
  $searchForm.reset();
  searchApi(searchQuery);
  $searchResultKeyword.textContent = searchQuery;
  data.searchKeyword = searchQuery;
  $viewSearchMovies.className = '';
  $viewSearchForm.className = 'hidden';
  data.view = 'search-movies';
});

// LISTENS FOR SUBMIT EVENT ON FOOTER SEARCH INPUT

$searchFooterForm.addEventListener('submit', function (event) {
  // RESETS DATA OBJECT

  event.preventDefault();
  $upcomingMoviesView.className = 'hidden';
  data.resultNumber = null;
  data.searchKeyword = '';
  data.movies = [];
  data.nextEntryId = 1;
  document.querySelectorAll('[data-entry-id]').forEach(function (event) {
    event.remove();
  });

  // BEGINS SEARCH QUERY FOR API

  var searchQuery = $searchFooterForm.elements.search.value;
  $searchFooterForm.reset();
  searchApi(searchQuery);
  $searchResultKeyword.textContent = searchQuery;
  data.searchKeyword = searchQuery;
  $viewSearchMovies.className = '';
  $viewSearchForm.className = 'hidden';
  data.view = 'search-movies';
});

// CHANGES VIEWS TO SEARCH FORM (NAV LINK)

// var $searchNavLink = document.getElementById('search-nav-link');
// $searchNavLink.addEventListener('click', function (event) {
//   $viewSearchMovies.className = 'hidden';
//   $upcomingMoviesView.className = 'hidden';
//   $viewSearchForm.className = '';
//   data.view = 'search-form';
// });

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
      movieEntry.movieId = response[i].id;
      if (response[i].poster_path === null) {
        movieEntry.posterUrl = 'images/placerholder-image.jpeg';
      } else {
        movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
      }
      movieEntry.entryId = data.nextEntryId;
      movieEntry.description = response[i].overview;
      data.nextEntryId++;
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
  // < li >
  //   <div class="row flex-row justify-content-center pad-bottom">
  //     <div class="column-one-thirds">
  //       <img class="movie-img-small"
  //         src="https://image.tmdb.org/t/p/original">
  //     </div>
  //     <div class="column-two-thirds flex-row movie-border align-cont-center">
  //       <div class="movie-details-wrapper">
  //         <h1 class="movie-title">Spider-Man: No Way Home</h1>
  //         <h2 class="movie-info">Release Date: 2021-12-15</h2>
  //         <h2 class="movie-info">User Rating: 8.1 / 10</h2>
  //         <button class="movie-btn">View Movie Details</button>
  //       </div>
  //     </div>
  //   </div>
  // </li >
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

  var movieBtn = document.createElement('button');
  movieBtn.textContent = 'View Movie Details';
  movieBtn.className = 'movie-btn';
  divWrapper.appendChild(movieBtn);

  return liItem;
}

var $movieDetailsUl = document.getElementById('movie-render-ul');

// EVENT OPENS MODAL AND POPULATES WITH MOVIE DATA

$movieDetailsUl.addEventListener('click', function (event) {
  data.modal = [];
  if (event.target && event.target.matches('BUTTON')) {
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
      }
    }
    data.modal.push(movieCardModal);
    var $modalCard = document.querySelector('[data-view="modal-card-view"]');
    $modalCard.className = '';
    data.view = 'modal-card-view';
  }
});

// EVENT CLOSES MODAL WINDOW WHEN X BUTTON IS CLICKED

var $closeModalBtn = document.querySelector('.modal-btn');
$closeModalBtn.addEventListener('click', function (event) {
  var $modalCard = document.querySelector('[data-view="modal-card-view"]');
  $modalCard.className = 'hidden';
  data.view = 'search-movies';
});

window.addEventListener('DOMContentLoaded', function loadMovies() {
  // ENSURES CORRECT PAGE VIEW IS LOADED AFTER PAGE REFRESH

  if (data.view === 'search-form') {
    $viewSearchForm.className = '';
    $viewSearchMovies.className = 'hidden';
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
  }
  if (data.view === 'modal-card-view') {
    $modalCardView.className = '';
    $viewSearchMovies.className = '';
    $viewSearchForm.className = 'hidden';
    var $modalCardTitle = document.querySelector('.movie-title-card');
    $modalCardTitle.textContent = data.modal[0].title;
    var $modalCardDate = document.querySelector('.movie-info-card-date');
    $modalCardDate.textContent = data.modal[0].date;
    var $modalCardRating = document.querySelector('.movie-info-card-rating');
    $modalCardRating.textContent = data.modal[0].rating;
    var $modalCardUrl = document.querySelector('.movie-img-card');
    $modalCardUrl.setAttribute('src', data.modal[0].imgUrl);
    var $modalCardDesc = document.querySelector('.movie-info-card-desc');
    $modalCardDesc.textContent = data.modal[0].description;
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
  }
});

// LISTEN FOR UPCOMING MOVIES BUTTON

var $upcomingMoviesBtn = document.querySelector('.upcoming-movie-btn');

$upcomingMoviesBtn.addEventListener('click', function () {
  // RESETS DATA MODEL OBJECT

  data.resultNumber = null;
  data.searchKeyword = '';
  data.movies = [];
  data.nextEntryId = 1;

  // CALLS API FOR UPCOMING MOVIES

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
      movieEntry.movieId = response[i].id;
      if (response[i].poster_path === null) {
        movieEntry.posterUrl = 'images/placerholder-image.jpeg';
      } else {
        movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
      }
      movieEntry.entryId = data.nextEntryId;
      movieEntry.description = response[i].overview;
      data.nextEntryId++;
      data.movies.push(movieEntry);
      var renderNewMovie = renderMovies(movieEntry);
      var ulElement = document.getElementById('upcoming-movie-render-ul');
      ulElement.appendChild(renderNewMovie);
    }
    data.view = 'upcoming-movies-view';
    $upcomingMoviesView.className = '';
    $viewSearchForm.className = 'hidden';
  });
  xhr.send();
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
