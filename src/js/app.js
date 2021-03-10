// ------ VARIABLE ------ //
let $window = $(window);
let $page = $('html, body');
let jsonPath = "src/json/movie.json"

// ------ READY FUNCT ------ //
$(document).ready( function(){
    firstPage();
    disableScroll();
})

// ------ FUNCTION ------ //
function disableScroll() {
    $page.scrollTop = $window.scrollY;
}

function firstPage(){

    $.getJSON(jsonPath, function(data){
        let spotlight = data.find(el => el.rank == 1);
    
        let trending = data.filter(el => el.rank <= 3);
        
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
        showMovie(spotlight);
        cardMovie();
    });
}

function showMovie(movie) {

    setTimeout( function(){

        $('.desc-movie').html(
            `<h2>${movie.name}</h2>
            <p>
                ${movie.desc}
            </p>
    
            <a href="#" class="btn btn-outline-info btn-movie">
                See Detail
            </a>`
        );

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
        )

        $('.content-movie').html(
            `<iframe width="300" height="180" src="https://www.youtube.com/embed/${movie.trailer}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        )
        
        // Call Function
        getDetail();
    }, 1200);

    setTimeout( function(){   
        $('.banner-movie').html(
            `<img src="src/image/${movie.image}" alt="${movie.name}">`
        );  
    }, 800);   
}

function cardMovie() {
    
    $('.card-movie').each(function() {
        
        $(this).on("click", function() {
            let recent_page = $('.desc-movie h2').html();
            let movie_name = $(this).attr('movie');
            
            if (recent_page != movie_name) {
        
                $('.card-movie').removeClass("active")
                $(this).addClass("active"); 
                
                $('.background-movie').addClass('animate');
                setTimeout( function(){
                    $('.background-movie').removeClass('animate');
                }, 1200);
            }

            $.getJSON(jsonPath, function(data){
                let movie_info = data.find(el => el.name == movie_name);
                
                showMovie(movie_info);
            });
        });      
    });
}

function getDetail() {
    $('.btn-movie').on("click", function(){
        $('#movie-page').addClass('detail-mode');
    });

    $('.back-btn').on("click", function(){
        $('#movie-page').removeClass('detail-mode');
    });
}






