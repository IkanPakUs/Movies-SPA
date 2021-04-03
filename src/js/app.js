// ------ VARIABLE ------ //
let $window = $(window);
let $page = $("html, body");
let json_path = "src/json/movie.json";

// ------ READY FUNCT ------ //
$(document).ready(function () {
  disableScroll();
  liveSearch();
  firstPage();
  getList();
});

// Desc Status
// Status 1 = For give detail movie from movie list page directly
// Status 2 = For give detail movie from card movie main page
// Status 3 = For first page and first page appear from list

// ------ FUNCTION ------ //
function disableScroll() {
  // Disable user to scroll bottom

  $page.scrollTop = $window.scrollY;
}

function liveSearch() {
  $('.form-control').on('keyup', function() {
    $('.row-card').empty();

    let data_search = $(this).val();
    let expre = new RegExp(data_search, "i");

    $.getJSON(json_path, function(data){

      $.each(data, function(id, movie){

        if(movie.name.search(expre) != -1 ){
          listDisplay(movie);
        }
      });

      // Call Function
      getListCard();
    });
  });
}

//------ GET DATA FROM JSON FUNCTION ------//

async function firstPage() {
  // First page will appear, and page will appear when from list movie . With status 3

  // Get data from json
  await $.getJSON(json_path, function (data) {
    // For movie rank 1 that will appear first
    let spotlight = data.find((el) => el.rank == 1);

    // Trending card rank 1 - 3
    let trending = data.filter((el) => el.rank <= 3);

    trendingDisplay(trending);

    // Call Function
    spotlightDisplay(3, spotlight);
  });

  getTrendingCard();
}

function trendingCard(movie_name) {
  // Get JSON alike the card clicked
  $.getJSON(json_path, function (data) {
    let movie_info = data.find((el) => el.name == movie_name);

    // Show the movie info with status 2
    spotlightDisplay(2, movie_info);
  });
}

function detailListCard(movie_name) {

  // Find movie alike attr movie
  $.getJSON(json_path, function (data) {
    let movie = data.find((el) => el.name == movie_name);

    // Show movie detail directly with status 1
    backgroundDisplay( 1, movie);
    detailDisplay(movie);
    getDetail(1,null)
  });
}

async function movieList(status) {
  // If status 1, and then make card list to movie list page
  if (status == 1) {
    await $.getJSON(json_path, function (data) {
      $.each(data, function (id, movie) {
        listDisplay(movie);
      });
    });
  } else {
    // Delete all card list from movie list page
    setTimeout(function () {
      $(".row-card").empty();
    }, 800);
  }

  // Call Function
  getListCard();

  // Enable / Disable scroll
  let list_height_page = $("#movie-list").height();

  if (list_height_page > 695) {
    $("body").css({ "overflow-y": "visible" });
  }
}

//------ LOGIC FUNCTION ------//

function getTrendingCard() {
  // For trending card
  $(".trending-card-movies .card .card-movie").each(function () {
    $(this).on("click", function () {
      let recent_page = $(".desc-movie h2").html();
      let movie_name = $(this).attr("movie");

      if (recent_page != movie_name) {
        // Which card is active
        $(".card-movie").removeClass("active");
        $(this).addClass("active");

        // Animate banner fade-in and fade-out
        $(".background-movie").addClass("animate");
        setTimeout(function () {
          $(".background-movie").removeClass("animate");
        }, 900);
      }

      trendingCard(movie_name);
    });
  });
}

function getDetail(status, movie) {
  // Give detail movie from movie list with status 1 directly
  if (status == 1) {
    $("#movie-page").addClass("detail-mode");
  }

  // Other status 1 mean give detail info from first page
  $(".detail-btn").on("click", function () {
    detailDisplay(movie);
    $("#movie-page").addClass("detail-mode");
  });

  // Back button from detail info
  $(".detail-back-btn").on("click", function () {
    $("#movie-page").removeClass("detail-mode");
    setTimeout(function () {
      $(".detail-info-movie").empty();
      $(".content-movie").empty();
      $("#review-page").empty();
    }, 800);
  });
}

function getList() {
  // Go to movie list page, and make list card with status 1
  $(".more-btn").on("click", function () {
    movieList(1);
    $("#movie-page").addClass("list-mode");

    setTimeout(function () {
      $(".desc-movie").empty();
      $(".trending-card-movies").empty();
    }, 800);
  });

  // Back from list page, make list movie empty and back to first page (status 3 give in first page)
  $(".list-back-btn").on("click", function () {
    $(".trending-card-movies").empty();
    $("body").css({ "overflow-y": "hidden" });
    firstPage();
    $("#movie-page").removeClass("list-mode");
    movieList(0);
  });
}

function getListCard() {
  // For card get detail
  $(".row-card .col .card-list .card-movie").each(function () {
    $(this).on("click", function () {
      let movie_name = $(this).attr("movie");

      detailListCard(movie_name);
    });
  });
}

//------ DISPLAYING FUNCTION ------//

function spotlightDisplay(status, movie) {
  // Showing movie information
  setTimeout(function () {
    $(".desc-movie").html(
      `<h2>${movie.name}</h2>
            <p>
                ${movie.desc}
            </p>
        
            <div class="btn btn-outline-info detail-btn">
                See Detail
            </div>`
    );

    // Call Function
    getDetail(status, movie);
  }, 100);

  backgroundDisplay(status, movie)
}

function trendingDisplay(movie){

  // Make card movie from trending
  $.each(movie, function (id, movie) {
    $(".trending-card-movies").append(
      `<div class="card">
          <div class="card-movie ${movie.page}" movie="${movie.name}">
              <img src="src/image/${movie.poster}" class="card-img-top" alt="...">
          </div>
      </div>`
    );
  });
}

function backgroundDisplay(status, movie){
  // Status 3 and status 1 cause from list page and for first page need directly
  if (status === 3 || status === 1) {
    $(".banner-movie").html(
      `<img src="src/image/${movie.image}" alt="${movie.name}">`
    );
  } else {
    // appart from status 3, with delay 600 ms
    setTimeout(function () {
      $(".banner-movie").html(
        `<img src="src/image/${movie.image}" alt="${movie.name}">`
      );
    }, 800);
  }
}

function listDisplay(movie) {
  $(".row-card").append(
    `<div class="col">
        <div class="card card-list">
            <div class="card-movie" movie="${movie.name}">
                <img src="src/image/${movie.poster}" class="card-img-top" alt="...">
            </div>
        </div>
    </div>`
  );
}

function detailDisplay(movie) {
  setTimeout(function () {
    $(".detail-info-movie").html(
      `<div class="card">
                <a href="#" class="card-movie-detail" movie="${movie.name}">
                    <img src="src/image/${movie.poster}" class="card-img-top" alt="...">
                </a>
            </div>
            <div class="detail-name">
                <h2>${movie.name}</h2>
            </div>
            <div class="detail-desc">
                <p>Y${movie.desc}</p>
            </div>
            <div class="info-movie">
                <div class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <p>${movie.rating}</p>
                </div>
                <div class="time">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                    </svg>
                    <p>${movie.time} min</p>
                </div>
            </div>
            <div class="participant">
                <div class="directur">
                    <p>Directed By : ${movie.director}</p>
                </div>
            </div>`
    );

    $(".content-movie").html(
      `<iframe width="300" height="180" src="https://www.youtube.com/embed/${movie.trailer}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );

    $("#review-page").html(`<h4>Scroll to Bottom</h4>`);
  }, 100);
}
