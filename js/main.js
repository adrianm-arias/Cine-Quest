// CAPTURES SEARCH INPUT VALUES

const $searchForm = document.querySelector('.search-form');
const $searchResultKeyword = document.querySelector('.search-results-keyword');
const $searchResultNumber = document.querySelector('.search-results-number');

// QUERIES DATA VIEW PROPERTIES FROM DOM

const $viewSearchMovies = document.querySelector('[data-view="search-movies"]');
const $viewSearchForm = document.querySelector('[data-view="search-form"]');
const $upcomingMoviesView = document.querySelector('[data-view="upcoming-movies-view"]');
const $popularMoviesView = document.querySelector('[data-view="popular-movies-view"]');
const $watchListView = document.querySelector('[data-view="watch-list-view"]');
const $addedMovieModal = document.querySelector('[data-view="added-movie-modal"]');
const $modalCardWatchList = document.querySelector('[data-view="list-modal-view"]');
const $confirmDeleteModal = document.querySelector('[data-view="confirm-delete-modal"]');

const $searchFooterForm = document.querySelector('.footer-form');

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
  const $movieRenderUl = document.getElementById('movie-render-ul');
  $movieRenderUl.textContent = '';

  if (event.target.matches('.search-form')) {
    // calls search api for main input

    const searchQuery = $searchForm.elements.search.value;
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
    const searchQueryFooter = $searchFooterForm.elements.search.value;
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

const $searchNavLink = document.getElementById('search-nav-link');

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
  const targetUrl = encodeURIComponent('https://api.themoviedb.org/3/search/movie?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl + 'query=' + keyword + '&page=1');
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const response = xhr.response.results;
    const resultNo = xhr.response.total_results;
    $searchResultNumber.textContent = resultNo;
    data.resultNumber = resultNo;
    for (let i = 0; i < response.length; i++) {
      const movieEntry = {};
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
      const renderNewMovie = renderMovies(movieEntry);
      const ulElement = document.getElementById('movie-render-ul');
      ulElement.appendChild(renderNewMovie);
    }
  });
  xhr.send();
}

// FUNCTION RENDERS MOVIE DATA FROM API

function renderMovies(movie) {

  const liItem = document.createElement('li');
  const divRow = document.createElement('div');
  divRow.className = 'row flex-row justify-content-center pad-bottom';
  liItem.appendChild(divRow);
  liItem.setAttribute('data-entry-id', movie.entryId);

  const divColumn = document.createElement('div');
  divColumn.className = 'column-one-thirds';
  divRow.appendChild(divColumn);

  const movieImg = document.createElement('img');
  movieImg.className = 'movie-img-small';
  movieImg.setAttribute('src', movie.posterUrl);
  divColumn.appendChild(movieImg);

  const divColumnText = document.createElement('div');
  divColumnText.className = 'column-two-thirds flex-row movie-border align-cont-center';
  divRow.appendChild(divColumnText);

  const divWrapper = document.createElement('div');
  divWrapper.className = 'movie-details-wrapper';
  divColumnText.appendChild(divWrapper);

  const movieTitle = document.createElement('h1');
  movieTitle.textContent = movie.title;
  movieTitle.className = 'movie-title';
  divWrapper.appendChild(movieTitle);
  const movieRelease = document.createElement('h2');
  movieRelease.className = 'movie-info';
  movieRelease.textContent = 'Release Date: ' + movie.releaseDate;
  divWrapper.appendChild(movieRelease);
  const movieRating = document.createElement('h2');
  movieRating.className = 'movie-info';
  movieRating.textContent = 'User Rating: ' + movie.userRating;
  divWrapper.appendChild(movieRating);

  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'flex-row align-cont-center';
  divWrapper.appendChild(btnWrapper);
  const movieBtn = document.createElement('button');
  movieBtn.textContent = 'View Movie Details';
  movieBtn.className = 'movie-btn';
  btnWrapper.appendChild(movieBtn);
  const addBtn = document.createElement('img');
  addBtn.setAttribute('src', 'images/add-icon.svg');
  addBtn.className = 'add-icon';
  btnWrapper.appendChild(addBtn);

  return liItem;
}

// EVENT OPENS MODAL AND POPULATES MOVIE DATA FROM MOVIES ARRAY
document.addEventListener('click', function (event) {
  if (data.view !== 'watch-list-view') {
    if (event.target && event.target.matches('.movie-btn')) {
      const targetLi = event.target.closest('li');
      const targetId = targetLi.getAttribute('data-entry-id');
      const targetIdNumber = parseInt(targetId);
      const movieCardModal = {};
      for (let i = 0; i < data.movies.length; i++) {
        if (targetIdNumber === data.movies[i].entryId) {
          const $modalCardTitle = document.querySelector('.movie-title-card');
          $modalCardTitle.textContent = data.movies[i].title;
          movieCardModal.title = data.movies[i].title;
          const $modalCardDate = document.querySelector('.movie-info-card-date');
          $modalCardDate.textContent = data.movies[i].releaseDate;
          movieCardModal.date = data.movies[i].releaseDate;
          const $modalCardRating = document.querySelector('.movie-info-card-rating');
          $modalCardRating.textContent = data.movies[i].userRating + ' / 10';
          movieCardModal.rating = data.movies[i].userRating + ' / 10';
          const $modalCardUrl = document.querySelector('.movie-img-card');
          $modalCardUrl.setAttribute('src', data.movies[i].posterUrl);
          movieCardModal.imgUrl = data.movies[i].posterUrl;
          const $modalCardDesc = document.querySelector('.movie-info-card-desc');
          $modalCardDesc.textContent = data.movies[i].description;
          movieCardModal.description = data.movies[i].description;
          movieCardModal.entryId = data.movies[i].entryId;
        }
      }
      data.modal.push(movieCardModal);
      const $modalCard = document.querySelector('[data-view="modal-card-view"]');
      $modalCard.className = '';
    }
    if (event.target.matches('.now-playing-link')) {
      const targetLiNowPlaying = event.target.closest('li');
      const targetIdNowPlaying = targetLiNowPlaying.getAttribute('data-entry-id');
      const targetIdNumberNowPlaying = parseInt(targetIdNowPlaying);
      const movieCardModalNowPlaying = {};
      for (let y = 0; y < data.playing.length; y++) {
        if (targetIdNumberNowPlaying === data.playing[y].entryId) {
          const $modalCardTitleNowPlaying = document.querySelector('.movie-title-card');
          $modalCardTitleNowPlaying.textContent = data.playing[y].title;
          movieCardModalNowPlaying.title = data.playing[y].title;
          const $modalCardDateNowPlaying = document.querySelector('.movie-info-card-date');
          $modalCardDateNowPlaying.textContent = data.playing[y].releaseDate;
          movieCardModalNowPlaying.date = data.playing[y].releaseDate;
          const $modalCardRatingNowPlaying = document.querySelector('.movie-info-card-rating');
          $modalCardRatingNowPlaying.textContent = data.playing[y].userRating + ' / 10';
          movieCardModalNowPlaying.rating = data.playing[y].userRating + ' / 10';
          const $modalCardUrlNowPlaying = document.querySelector('.movie-img-card');
          $modalCardUrlNowPlaying.setAttribute('src', data.playing[y].posterUrl);
          movieCardModalNowPlaying.imgUrl = data.playing[y].posterUrl;
          const $modalCardDescNowPlaying = document.querySelector('.movie-info-card-desc');
          $modalCardDescNowPlaying.textContent = data.playing[y].description;
          movieCardModalNowPlaying.description = data.playing[y].description;
          movieCardModalNowPlaying.entryId = data.playing[y].entryId;
        }
      }
      data.modal.push(movieCardModalNowPlaying);
      const $modalCardNowPlaying = document.querySelector('[data-view="modal-card-view"]');
      $modalCardNowPlaying.className = '';
    }
  }
});

// EVENT OPENS MODAL AND POPULATES MOVIE DATA FROM FAVORITES ARRAY
document.addEventListener('click', function (event) {
  if (data.view === 'watch-list-view') {
    if (event.target && event.target.matches('.movie-btn')) {

      const targetLi = event.target.closest('li');
      const targetId = targetLi.getAttribute('data-entry-id');
      const targetIdNumber = parseInt(targetId);
      const movieCardModal = {};
      data.deleteId = targetIdNumber;
      for (let i = 0; i < data.favorites.length; i++) {
        if (targetIdNumber === data.favorites[i].entryId) {
          const $modalCardTitleList = document.querySelector('.movie-list-title-card');
          $modalCardTitleList.textContent = data.favorites[i].title;
          movieCardModal.title = data.favorites[i].title;
          const $modalCardDateList = document.querySelector('.list-movie-info-card-date');
          $modalCardDateList.textContent = data.favorites[i].releaseDate;
          movieCardModal.date = data.favorites[i].releaseDate;
          const $modalCardRatingList = document.querySelector('.list-movie-info-card-rating');
          $modalCardRatingList.textContent = data.favorites[i].userRating + ' / 10';
          movieCardModal.rating = data.favorites[i].userRating + ' / 10';
          const $modalCardUrlList = document.querySelector('.list-movie-img-card');
          $modalCardUrlList.setAttribute('src', data.favorites[i].posterUrl);
          movieCardModal.imgUrl = data.favorites[i].posterUrl;
          const $modalCardDescList = document.querySelector('.list-movie-info-card-desc');
          $modalCardDescList.textContent = data.favorites[i].description;
          movieCardModal.description = data.favorites[i].description;
          movieCardModal.entryId = data.favorites[i].entryId;
        }
      }
      data.modal.push(movieCardModal);
      const $modalCard = document.querySelector('[data-view="list-modal-view"]');
      $modalCard.className = '';
    }
  }

});

// EVENT CLOSES LIST MODAL WINDOW WHEN X BUTTON IS CLICKED

const $closeListModalBtn = document.querySelector('.list-modal-btn');
$closeListModalBtn.addEventListener('click', function (event) {
  const $modalCard = document.querySelector('[data-view="list-modal-view"]');
  $modalCard.className = 'hidden';
  data.modal = [];
  data.deleteId = null;
});

// EVENT CLOSES MODAL WINDOW WHEN X BUTTON IS CLICKED

const $closeModalBtn = document.querySelector('.modal-btn');
$closeModalBtn.addEventListener('click', function (event) {
  const $modalCard = document.querySelector('[data-view="modal-card-view"]');
  $modalCard.className = 'hidden';
  data.modal = [];
  data.deleteId = null;
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
    for (let i = 0; i < data.movies.length; i++) {
      const ulElement = document.getElementById('movie-render-ul');
      const movieRefresh = renderMovies(data.movies[i]);
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
    for (let y = 0; y < data.movies.length; y++) {
      const ulElementUpcoming = document.getElementById('upcoming-movie-render-ul');
      const upcomingMovieRefresh = renderMovies(data.movies[y]);
      ulElementUpcoming.appendChild(upcomingMovieRefresh);
    }
    $upcomingMoviesView.className = '';
    $viewSearchForm.className = 'hidden';
    $viewSearchMovies.className = 'hidden';
    $popularMoviesView.className = 'hidden';
    $watchListView.className = 'hidden';
  }
  if (data.view === 'popular-movies-view') {
    for (let j = 0; j < data.movies.length; j++) {
      const ulElementPopular = document.getElementById('popular-movie-render-ul');
      const popularMovieRefresh = renderMovies(data.movies[j]);
      ulElementPopular.appendChild(popularMovieRefresh);
    }
    $popularMoviesView.className = '';
    $upcomingMoviesView.className = 'hidden';
    $viewSearchForm.className = 'hidden';
    $viewSearchMovies.className = 'hidden';
    $watchListView.className = 'hidden';
  }
  if (data.view === 'watch-list-view') {
    for (let a = 0; a < data.favorites.length; a++) {
      const ulElementWatchList = document.getElementById('watch-list-render-ul');
      const WatchListRefresh = renderMovies(data.favorites[a]);
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

    changeSubtractIcon();

    // resets data model object

    data.resultNumber = null;
    data.searchKeyword = '';
    data.movies = [];

    // calls for api for upcoming movies

    const targetUrl = encodeURIComponent('https://api.themoviedb.org/3/movie/upcoming?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&page=1');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
    xhr.setRequestHeader('token', 'abc123');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      const response = xhr.response.results;
      for (let i = 0; i < response.length; i++) {
        const movieEntry = {};
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
        const renderNewMovie = renderMovies(movieEntry);
        const ulElement = document.getElementById('upcoming-movie-render-ul');
        ulElement.appendChild(renderNewMovie);
      }
      data.view = 'upcoming-movies-view';
      $upcomingMoviesView.className = '';
    });
    xhr.send();
  }
});

// RESPONSIVE NAV BAR

const $navToggle = document.getElementById('nav-toggle');
const $navElement = document.querySelector('nav');
const $navIcon = document.querySelectorAll('.nav-icon');
const $burgerMenu = document.querySelector('#burger-menu');

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

    changeSubtractIcon();

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

    const targetUrl = encodeURIComponent('https://api.themoviedb.org/3/movie/popular?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&page=1');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
    xhr.setRequestHeader('token', 'abc123');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      const response = xhr.response.results;
      for (let i = 0; i < response.length; i++) {
        const movieEntry = {};
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
        const renderNewMovie = renderMovies(movieEntry);
        const ulElement = document.getElementById('popular-movie-render-ul');
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
    const targetLi = event.target.closest('li');
    const targetId = targetLi.getAttribute('data-entry-id');
    const targetIdNumber = parseInt(targetId);
    const addMovie = {};
    for (let i = 0; i < data.movies.length; i++) {
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

// FUNCTION ADDS MOVIE DETAILS FROM MODAL VIEW TO FAV ARRAY
document.addEventListener('click', function (event) {
  if (event.target && event.target.matches('.add-modal-icon')) {
    const modalId = data.modal[0].entryId;
    const addMovie = {};
    if (data.movies.length === 0) {
      for (let i = 0; i < data.playing.length; i++) {
        if (modalId === data.playing[i].entryId) {
          addMovie.title = data.playing[i].title;
          addMovie.releaseDate = data.playing[i].releaseDate;
          addMovie.userRating = data.playing[i].userRating;
          addMovie.entryId = data.playing[i].entryId;
          addMovie.posterUrl = data.playing[i].posterUrl;
          addMovie.description = data.playing[i].description;
        }
      }
    } else {
      for (let y = 0; y < data.movies.length; y++) {
        if (modalId === data.movies[y].entryId) {
          addMovie.title = data.movies[y].title;
          addMovie.releaseDate = data.movies[y].releaseDate;
          addMovie.userRating = data.movies[y].userRating;
          addMovie.entryId = data.movies[y].entryId;
          addMovie.posterUrl = data.movies[y].posterUrl;
          addMovie.description = data.movies[y].description;
        }
      }
    }
    data.favorites.unshift(addMovie);
    $addedMovieModal.className = '';
    setTimeout(hideAddedMovieModal, 10000);
    const $modalCard = document.querySelector('[data-view="modal-card-view"]');
    $modalCard.className = 'hidden';
    data.modal = [];
  }
});

// LISTENS FOR ALL 'WATCH LIST' LINKS TO SAVED MOVIES
document.addEventListener('click', function (event) {
  if (event.target.matches('#watch-list-footer-link') ||
    event.target.matches('#watch-list-nav-link') ||
    event.target.matches('#watch-list-modal-link')) {

    const $watchListUl = document.getElementById('watch-list-render-ul');
    $watchListUl.textContent = '';
    data.movies = [];
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

    for (let x = 0; x < data.favorites.length; x++) {
      const ulElementWatchList = document.getElementById('watch-list-render-ul');
      const WatchListRefresh = renderMovies(data.favorites[x]);
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

// CHANGES + ICONS TO -
function changePlusIcon() {
  const addIcons = document.querySelectorAll('.add-icon');
  addIcons.forEach(function (element) {
    element.setAttribute('src', 'images/subtract-icon.svg');
    element.setAttribute('class', 'subtract-icon');
  });
}

function changeSubtractIcon() {
  const addIcons = document.querySelectorAll('.subtract-icon');
  addIcons.forEach(function (element) {
    element.setAttribute('src', 'images/add-icon.svg');
    element.setAttribute('class', 'add-icon');
  });
}

// FUNCTION CALLS 'NOW PLAYING' API
function nowPlayingApi() {
  const targetUrl = encodeURIComponent('https://api.themoviedb.org/3/movie/now_playing?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&page=1');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const response = xhr.response.results;
    for (let i = 0; i < response.length; i++) {
      const movieEntry = {};
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
      const renderNewMovie = renderNowPlaying(movieEntry);
      const ulElement = document.getElementById('now-playing-render-ul');
      ulElement.appendChild(renderNewMovie);
    }
  });
  xhr.send();
}

// FUNCTION RENDERS NOW PLAYING SECTION

function renderNowPlaying(movie) {

  const liItem = document.createElement('li');
  const divCol = document.createElement('div');
  divCol.className = 'column-full pad-left-right';
  liItem.appendChild(divCol);
  liItem.setAttribute('data-entry-id', movie.entryId);

  const movieImg = document.createElement('img');
  movieImg.className = 'now-playing-img';
  movieImg.setAttribute('src', movie.posterUrl);
  divCol.appendChild(movieImg);

  const movieTitle = document.createElement('h3');
  movieTitle.textContent = movie.title;
  movieTitle.className = 'now-playing-title';
  divCol.appendChild(movieTitle);

  const nowPlayingLink = document.createElement('a');
  nowPlayingLink.className = 'now-playing-link';
  nowPlayingLink.textContent = 'View Details >';
  divCol.appendChild(nowPlayingLink);

  return liItem;
}

nowPlayingApi();
const $rightArrow = document.getElementById('right-arrow');

// CONTROLS SCROLL FOR NOW PLAYING

$rightArrow.addEventListener('click', function (event) {
  const nowPlayingUl = document.getElementById('now-playing-render-ul');
  nowPlayingUl.scrollLeft += 200;
});

const $leftArrow = document.getElementById('left-arrow');

$leftArrow.addEventListener('click', function (event) {
  const nowPlayingUl = document.getElementById('now-playing-render-ul');
  nowPlayingUl.scrollLeft -= 200;
});

// HIDES CONFIRM DELETE MODAL WHEN CANCEL IS CLICKED
document.addEventListener('click', function (event) {
  if (event.target.matches('#confirm-cancel-link')) {
    $confirmDeleteModal.className = 'hidden';
    data.deleteId = null;
  }
});

// SHOWS CONFIRM DELETE MODAL WHEN 'SUBTRACT ICON' IS CLICKED
document.addEventListener('click', function (event) {
  if (event.target.matches('.subtract-icon')) {
    $confirmDeleteModal.className = '';
    const targetLi = event.target.closest('li');
    const targetId = targetLi.getAttribute('data-entry-id');
    const targetIdNumber = parseInt(targetId);

    for (let i = 0; i < data.favorites.length; i++) {
      if (targetIdNumber === data.favorites[i].entryId) {
        data.deleteId = data.favorites[i].entryId;
      }
    }
  } else if (event.target.matches('.subtract-modal-icon')) {
    $confirmDeleteModal.className = '';
  }
});

// FUNCTION DELTES MOVIE FROM ARRAY AND REFRESH RENDER LIST ONCE 'CONFIRM DELETE BTN' IS CLICKED

document.addEventListener('click', function (event) {
  if (event.target.matches('.confirm-delete-btn')) {
    const $watchListUl = document.getElementById('watch-list-render-ul');
    $watchListUl.textContent = '';

    for (let i = 0; i < data.favorites.length; i++) {
      if (data.deleteId === data.favorites[i].entryId) {
        data.favorites.splice(i, 1);
        for (let a = 0; a < data.favorites.length; a++) {
          const ulElementWatchList = document.getElementById('watch-list-render-ul');
          const WatchListRefresh = renderMovies(data.favorites[a]);
          ulElementWatchList.appendChild(WatchListRefresh);
        }
      }
      changePlusIcon();
      $modalCardWatchList.className = 'hidden';
      $confirmDeleteModal.className = 'hidden';
    }
    data.deleteId = null;
    data.modal = [];
  }
});
