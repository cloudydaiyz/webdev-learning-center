const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key='+API_KEY+'&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'; // root path for every image in the movie db
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key='+API_KEY+'&query='; // query

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

function returnMovies(url) {
    fetch(url)
        .then(res => res.json() )
        .then(data => {
            console.log(data);
            console.log(data.results);
            data.results.forEach(element => {
                // Recreate this object:
                // <div class="row">
                //     <div class="column">
                //         <div class="card">
                //             <center><img src="https://lumiere-a.akamaihd.net/v1/images/pp_disney_blackpanther_wakandaforever_1289_d3419b8f.jpeg" class="thumbnail" alt=""></center>
                //             <h3>Movie Title</h3>
                //         </div>
                //     </div>
                // </div>
                
                const divRow = document.createElement('div');
                divRow.setAttribute('class', 'row');

                const divColumn = document.createElement('div');
                divColumn.setAttribute('class', 'column');

                const divCard = document.createElement('div');
                divCard.setAttribute('class', 'card');

                const center = document.createElement('center');
                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image');

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');

                title.innerHTML = `${element.title}<br><a href="movie.html?id=${element.id}&title=${element.title}">reviews</a>`;
                image.src = IMG_PATH + element.poster_path;
                center.appendChild(image);

                divCard.appendChild(center);
                divCard.appendChild(title);
                divColumn.appendChild(divCard);
                divRow.appendChild(divColumn);

                main.appendChild(divRow);
            });
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';

    const searchItem = search.value;

    if(searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        searchItem.value = "";
    } else {
        returnMovies(APILINK);
    }
});

returnMovies(APILINK);