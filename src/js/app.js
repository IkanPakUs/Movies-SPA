// ------ VARIABLE ------ //
let $window = $(window);
let $page = $('html, body');
let json_path = "src/json/movie.json"

// ------ READY FUNCT ------ //
$(document).ready( function(){
    firstPage();
    disableScroll();
    getList();
})

// Desc Status
// Status 1 = For give detail movie from movie list page directly
// Status 2 = For give detail movie from card movie main page
// Status 3 = For first page and first page appear from list

// ------ FUNCTION ------ //
function disableScroll() {
    // Disable user to scroll bottom

    $page.scrollTop = $window.scrollY;
}

function firstPage(){
    // First page will appear, and page will appear when from list movie . With status 3

    // Get data from json
    $.getJSON(json_path, function(data){
        // For movie rank 1 that will appear first
        let spotlight = data.find(el => el.rank == 1);
    
        // Trending card rank 1 - 3
        let trending = data.filter(el => el.rank <= 3);
        
        // Make card movie from trending
        $.each(trending, function(id, data){
            $('.trending-card-movies').append(
                `<div class="card">
                    <a href="#" class="card-movie ${data.page}" movie="${data.name}">
                        <img src="src/image/${data.poster}" class="card-img-top" alt="...">
                    </a>
                </div>`
            );
        });

        
        // Call Function
        showMovie(spotlight,3);
        cardMovie();
    });
}

function showMovie(movie,status) {
    
    // Showing movie information
    setTimeout( function(){
        $('.desc-movie').html(
            `<h2>${movie.name}</h2>
            <p>
                ${movie.desc}
            </p>
        
            <a href="#" class="btn btn-outline-info detail-btn">
                See Detail
            </a>`
        );
        
        // Call Function
        getDetail(status, movie);

    }, 100);

    // Status 3 and status 1 cause from list page and for first page need directly
    if (status === 3 || status === 1) {
        $('.banner-movie').html(
            `<img src="src/image/${movie.image}" alt="${movie.name}">`
        );

    } else {
        // appart from status 3, with delay 600 ms
        setTimeout( function(){   
            $('.banner-movie').html(
                `<img src="src/image/${movie.image}" alt="${movie.name}">`
            );  
        }, 800);
    }
}

function cardMovie() {
    
    // For trending card
    $('.trending-card-movies .card .card-movie').each( function() {
        
        $(this).on("click", function() {
            let recent_page = $('.desc-movie h2').html();
            let movie_name = $(this).attr('movie');
            
            if (recent_page != movie_name) {
                
                // Which card is active
                $('.card-movie').removeClass("active")
                $(this).addClass("active"); 
                
                // Animate banner fade-in and fade-out
                $('.background-movie').addClass('animate');
                setTimeout( function(){
                    $('.background-movie').removeClass('animate');
                }, 900);
            }

            // Get JSON alike the card clicked
            $.getJSON(json_path, function(data){
                let movie_info = data.find(el => el.name == movie_name);
                
                // Show the movie info with status 2
                showMovie(movie_info,2);
            });
        });      
    });
}

function getDetail(status, movie) {

    // Give detail movie from movie list with status 1 directly
    if(status == 1){
        $('#movie-page').addClass('detail-mode');
    }
    
    // Other status 1 mean give detail info from first page
    $('.detail-btn').on("click", function(){
        movieDetail(movie);
        $('#movie-page').addClass('detail-mode');
        $('body').css({ "overflow-y": "visible"})
    });
    
    // Back button from detail info
    $('.detail-back-btn').on("click", function(){
        $('#movie-page').removeClass('detail-mode');
        $('body').css({ "overflow-y": "hidden"})
        setTimeout( function(){
            $('.detail-info-movie').empty();
            $('.content-movie').empty();
        }, 800)
    });
}

function movieDetail(movie){

    setTimeout( function(){
        $('.detail-info-movie').html(
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
                    <p>${movie.rating}</p>
                </div>
                <div class="time">
                    <p>${movie.time} min</p>
                </div>
            </div>
            <div class="participant">
                <div class="directur">
                    <p>Directed By : ${movie.director}</p>
                </div>
            </div>`
        );

        $('.content-movie').html(
            `<iframe width="300" height="180" src="https://www.youtube.com/embed/${movie.trailer}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        );
    }, 100);
}

function getList() {
    
    // Go to movie list page, and make list card with status 1
    $('.more-btn').on("click", function(){
        movieList(1);
        $('#movie-page').addClass('list-mode');
        setTimeout( function(){
            $('.desc-movie').empty();
            $('.trending-card-movies .card .card-movie').empty();
        }, 800);
    })

    // Back from list page, make list movie empty and back to first page (status 3 give in first page)
    $('.list-back-btn').on("click", function(){
        $('.trending-card-movies').empty();
        firstPage();
        $('body').css({ "overflow-y": "hidden"})
        $('#movie-page').removeClass('list-mode');
        movieList(0);
    });
}

function movieList(status) {

    // If status 1, and then make card list to movie list page
    if(status == 1){

        $.getJSON(json_path, function(data){
    
            $.each(data, function(id, movie){
                $('.row-card').append(
                    `<div class="col">
                        <div class="card card-list">
                            <a href="#" class="card-movie" movie="${movie.name}">
                                <img src="src/image/${movie.poster}" class="card-img-top" alt="...">
                            </a>
                        </div>
                    </div>`
                )
            });

            $('.row-card .col .card-list .card-movie').each( function(){
        
                $(this).on("click", function(){
                    let movie_name = $(this).attr('movie');
                    $('body').css({ "overflow-y": "visible"})
                    
                    // Find movie alike attr movie
                    $.getJSON(json_path, function(data){
                        let movie = data.find(el => el.name == movie_name);
                        
                        // Show movie detail directly with status 1
                        showMovie(movie,1);
                        movieDetail(movie);
                    });
                });
            })
        });
    } else {
        // Delete all card list from movie list page
        setTimeout( function(){
            $('.row-card').empty();
        }, 800);
    }
}




