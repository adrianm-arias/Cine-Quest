// captures search input values
var $searchForm = document.querySelector('.search-form');
var $searchResultKeyword = document.querySelector('.search-results-keyword');
var $searchResultNumber = document.querySelector('.search-results-number');
var $viewSearchMovies = document.querySelector('[data-view="search-movies"]');
var $viewSearchForm = document.querySelector('[data-view="search-form"]');
var $searchFooterForm = document.querySelector('.footer-form');

// listen for submit event on main search input
$searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  data.movies = [];
  data.nextEntryId = 1;
  document.querySelectorAll('[data-entry-id]').forEach(function (event) {
    event.remove();
  });
  var searchQuery = $searchForm.elements.search.value;
  $searchForm.reset();
  searchApi(searchQuery);
  $searchResultKeyword.textContent = searchQuery;
  $viewSearchMovies.className = '';
  $viewSearchForm.className = 'hidden';
});

// listens for submit event on footer search input
$searchFooterForm.addEventListener('submit', function (event) {
  event.preventDefault();
  document.querySelectorAll('[data-entry-id]').forEach(function (event) {
    event.remove();
  });
  var searchQuery = $searchFooterForm.elements.search.value;
  $searchFooterForm.reset();
  searchApi(searchQuery);
  $searchResultKeyword.textContent = searchQuery;
  $viewSearchMovies.className = '';
  $viewSearchForm.className = 'hidden';
});

var $searchNavLink = document.getElementById('search-nav-link');

$searchNavLink.addEventListener('click', function (event) {
  $viewSearchMovies.className = 'hidden';
  $viewSearchForm.className = '';
});

// api for search of any movie
function searchApi(keyword) {
  var targetUrl = encodeURIComponent('https://api.themoviedb.org/3/search/movie?api_key=98a5c967f4f2692337ac21e42f982ea8&language=en-US&');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl + 'query=' + keyword + '&page=1');
  xhr.setRequestHeader('token', 'abc123');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var response = xhr.response.results;
    $searchResultNumber.textContent = xhr.response.total_results;
    for (var i = 0; i < response.length; i++) {
      var movieEntry = {};
      movieEntry.title = response[i].title;
      movieEntry.releaseDate = response[i].release_date;
      movieEntry.userRating = response[i].vote_average;
      movieEntry.posterUrl = 'https://image.tmdb.org/t/p/original' + response[i].poster_path;
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

// function renders movie data from api
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

// this event gets the ID of select movie whose button is clicked to view more information
$movieDetailsUl.addEventListener('click', function (event) {
  if (event.target && event.target.matches('BUTTON')) {
    var targetLi = event.target.closest('li');
    var targetId = targetLi.getAttribute('data-entry-id');
    var targetIdNumber = parseInt(targetId);
    for (var i = 0; i < data.movies.length; i++) {
      if (targetIdNumber === data.movies[i].entryId) {
        var $modalCardTitle = document.querySelector('.movie-title-card');
        $modalCardTitle.textContent = data.movies[i].title;
        var $modalCardDate = document.querySelector('.movie-info-card-date');
        $modalCardDate.textContent = data.movies[i].releaseDate;
        var $modalCardRating = document.querySelector('.movie-info-card-rating');
        $modalCardRating.textContent = data.movies[i].userRating + ' / 10';
        var $modalCardUrl = document.querySelector('.movie-img-card');
        $modalCardUrl.setAttribute('src', data.movies[i].posterUrl);
        var $modalCardDesc = document.querySelector('.movie-info-card-desc');
        $modalCardDesc.textContent = data.movies[i].description;
      }
    }
    var $modalCard = document.querySelector('[data-view="modal-card-view"]');
    $modalCard.className = '';
  }
});

// this event close the modal when X button is
var $closeModalBtn = document.querySelector('.modal-btn');
$closeModalBtn.addEventListener('click', function (event) {
  var $modalCard = document.querySelector('[data-view="modal-card-view"]');
  $modalCard.className = 'hidden';
});
